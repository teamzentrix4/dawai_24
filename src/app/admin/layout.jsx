import AdminShell from "@/components/Admin/AdminShell";
import DatabaseUnavailable from "@/components/Admin/DatabaseUnavailable";
import {db,isDatabaseUnavailable} from "@/lib/db";
import {getAdminSession} from "@/lib/auth";
import {redirect} from "next/navigation";

export const dynamic="force-dynamic";

export default async function AdminLayout({children}){
  let auth;
  try {
    auth = await getAdminSession();
  } catch (error) {
    if (isDatabaseUnavailable(error)) return <DatabaseUnavailable />;
    throw error;
  }
  if (!auth) redirect("/login?next=/admin");
  let notifications=[];
  const admin={name:auth.user.name,email:auth.user.email,role:auth.user.role.replaceAll("_"," ")};
  try{
    const [orders,prescriptions,customers,inquiries,lowStock]=await db.$transaction([
      db.order.findMany({take:5,orderBy:{createdAt:"desc"},include:{customer:true}}),
      db.prescription.findMany({take:5,orderBy:{createdAt:"desc"}}),
      db.customer.findMany({take:5,orderBy:{createdAt:"desc"}}),
      db.contactInquiry.findMany({take:5,orderBy:{createdAt:"desc"}}),
      db.product.count({where:{active:true,stock:{lte:5}}}),
    ]);
    const orderEvents=orders.map(x=>({id:`order-${x.id}`,type:"order",title:"New order received",message:`${x.orderNumber} · ${x.customer?.name||"Guest customer"} · ₹${Number(x.total).toLocaleString("en-IN")}`,href:"/admin/orders",createdAt:x.createdAt.toISOString()}));
    const rxEvents=prescriptions.map(x=>({id:`rx-${x.id}`,type:"prescription",title:"Prescription uploaded",message:`${x.customerName||"Customer"} submitted a prescription`,href:"/admin/prescriptions",createdAt:x.createdAt.toISOString()}));
    const customerEvents=customers.map(x=>({id:`customer-${x.id}`,type:"customer",title:"New customer",message:`${x.name||x.phone||"A customer"} joined Dawai24`,href:"/admin/customers",createdAt:x.createdAt.toISOString()}));
    const contactEvents=inquiries.map(x=>({id:`contact-${x.id}`,type:"contact",title:"New support enquiry",message:`${x.name}: ${x.message}`,href:"/admin/support",createdAt:x.createdAt.toISOString()}));
    notifications=[...orderEvents,...rxEvents,...customerEvents,...contactEvents].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,10);
    if(lowStock>0)notifications.unshift({id:`stock-${lowStock}`,type:"stock",title:"Inventory needs attention",message:`${lowStock} published product${lowStock===1?" has":"s have"} low or no stock`,href:"/admin/products",createdAt:new Date().toISOString()});
  }catch{}
  return <AdminShell notifications={notifications} admin={admin}>{children}</AdminShell>;
}
