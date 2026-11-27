"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { totals } from "@/lib/catalog";

const Ctx = createContext(null);
const KEY = "dawai24-store-v1";
const PENDING_CART_KEY = "dawai24-pending-cart";

const initial = { cart: [], wishlist: [], pin: "", user: null, addresses: [], orders: [], coupon: "" };
const addCartLine = (cart, id, qty) => {
  const existing = cart.find((item) => item.id === id);
  return existing
    ? cart.map((item) => item.id === id ? { ...item, qty: Math.min(10, item.qty + qty) } : item)
    : [...cart, { id, qty }];
};

export function StoreProvider({ children }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [couponRules, setCouponRules] = useState({});
  const [storeSettings, setStoreSettings] = useState({});
  const [authGateOpen, setAuthGateOpen] = useState(false);

  useEffect(() => {
    let saved = initial;
    try { const raw = localStorage.getItem(KEY); if (raw) saved = { ...initial, ...JSON.parse(raw),addresses:[],orders:[] }; } catch {}
    fetch("/api/auth/session").then((r)=>r.ok?r.json():{}).then(async(auth)=>{const customer=auth.customer||null;const addresses=customer?await fetch("/api/customer/addresses").then(r=>r.ok?r.json():[]):[];let cart=saved.cart;try{const pending=customer?JSON.parse(localStorage.getItem(PENDING_CART_KEY)||"null"):null;if(pending?.id){cart=addCartLine(cart,pending.id,Math.max(1,Number(pending.qty)||1));localStorage.removeItem(PENDING_CART_KEY)}}catch{}setState({...saved,cart,user:customer,addresses})}).catch(()=>setState({...saved,user:null,addresses:[]})).finally(()=>setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state, ready]);

  useEffect(() => {
    fetch("/api/catalog/products").then((r) => r.ok ? r.json() : []).then(setCatalog).catch(() => setCatalog([]));
    fetch("/api/catalog/coupons").then((r) => r.ok ? r.json() : []).then((rows) => setCouponRules(Object.fromEntries(rows.map((x) => [x.code, x])))).catch(() => setCouponRules({}));
    fetch("/api/catalog/settings").then((r)=>r.ok?r.json():{}).then(setStoreSettings).catch(()=>setStoreSettings({}));
  }, []);

  const toast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const patch = (fn) => setState((s) => ({ ...s, ...fn(s) }));

  const api = useMemo(() => ({
    addToCart(id, qty = 1) {
      patch((s) => ({ cart: addCartLine(s.cart, id, qty) }));
      toast("Added to cart");
    },
    requestAddToCart(id, qty = 1) {
      if (state.user) {
        patch((s) => ({ cart: addCartLine(s.cart, id, qty) }));
        toast("Added to cart");
        return true;
      }
      try { localStorage.setItem(PENDING_CART_KEY, JSON.stringify({ id, qty })); } catch {}
      setAuthGateOpen(true);
      return false;
    },
    setQty: (id, qty) => patch((s) => ({ cart: qty <= 0 ? s.cart.filter((c) => c.id !== id) : s.cart.map((c) => (c.id === id ? { ...c, qty: Math.min(10, qty) } : c)) })),
    removeFromCart(id) { patch((s) => ({ cart: s.cart.filter((c) => c.id !== id) })); toast("Removed from cart", "info"); },
    clearCart: () => patch(() => ({ cart: [], coupon: "" })),
    toggleWish(id) {
      patch((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] }));
    },
    setPin: (pin) => patch(() => ({ pin })),
    setCoupon: (coupon) => patch(() => ({ coupon })),
    login(user) { patch(() => ({ user })); },
    logout() { patch(() => ({ user: null })); toast("Logged out", "info"); },
    async saveAddress(a) {const response=await fetch("/api/customer/addresses",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!response.ok){toast("Please login to save an address","error");return null}const row=await response.json();patch(s=>({addresses:[row,...s.addresses]}));return row},
    async deleteAddress(id) {const response=await fetch("/api/customer/addresses",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});if(response.ok)patch(s=>({addresses:s.addresses.filter(a=>a.id!==id)}));},
    placeOrder(order) { patch((s) => ({ orders: [order, ...s.orders], cart: [], coupon: "" })); },
    openDrawer: () => setDrawer(true),
    closeDrawer: () => setDrawer(false),
    closeAuthGate: () => setAuthGateOpen(false),
    toast,
  }), [state.user, toast]);

  const lines = useMemo(
    () => state.cart.map((c) => ({ ...c, product: catalog.find((p) => p.id === c.id) })).filter((l) => l.product),
    [state.cart, catalog]
  );
  const sums = useMemo(() => totals(lines, state.coupon, couponRules, storeSettings), [lines, state.coupon, couponRules, storeSettings]);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <Ctx.Provider value={{ ...state, ready, catalog, couponRules, storeSettings, lines, sums, count, drawer, toasts, authGateOpen, ...api }}>
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
};
