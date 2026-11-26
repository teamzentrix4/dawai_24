"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, ImageIcon, IndianRupee, Layers, Package, Plus, Save, Search, Text, Trash2 } from "lucide-react";
import PageHeader from "./PageHeader";
import { categoryVerificationOptions, discountPercent, isPendingCategory, productSteps, productStockOptions, suggestedProductSlug, validateProduct, validProductUrl } from "@/lib/productWizard";

const icons = [Package, Layers, IndianRupee, Text, ImageIcon, Search, ClipboardCheck];
const shortTitles = ["Basic info", "Category", "Pricing", "Description", "Images", "SEO", "Review"];
const required = new Set(["product_name", "stock"]);
const units = ["tablets", "capsules", "ml", "gm", "Sachet", "diapers"];
const fieldLabels = Object.assign({}, ...productSteps.map(step => step.fields), { active: "Publish on website" });
const input = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-normal outline-none transition focus:border-[#7b2cbf] focus:ring-4 focus:ring-violet-50 disabled:bg-slate-50 disabled:text-slate-400";
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50";
const primary = button + " bg-[#7b2cbf] text-white hover:bg-[#6922a8]";
const secondary = button + " border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const lastStep = productSteps.length - 1;

function startingValues(product) {
  const values = Object.fromEntries(Object.keys(fieldLabels).map(key => [key, product?.[key] ?? ""]));
  return {
    ...values,
    active: product?.active ?? true,
    prescriptionRequired: product?.prescriptionRequired ?? "false",
    stock: product?.stock ?? "0",
    gallery_images: product?.gallery_images.length ? product.gallery_images : [""],
  };
}

function Field({ field, error, hint, wide, children }) {
  const id = "product-" + field;
  const label = fieldLabels[field] || "Gallery image " + (Number(field.split(".")[1]) + 1);
  return <div className={wide ? "sm:col-span-2" : undefined}>
    <label htmlFor={id} className="block text-sm font-bold text-slate-700">
      {label}{required.has(field) && <span aria-hidden="true" className="ml-1 text-red-600">*</span>}
    </label>
    {children({
      id, name: field.startsWith("gallery_images.") ? "gallery_images" : field,
      "aria-required": required.has(field) || undefined,
      "aria-invalid": Boolean(error) || undefined,
      "aria-describedby": error || hint ? id + "-detail" : undefined,
      className: input + (error ? " border-red-400" : ""),
    })}
    {(error || hint) && <p id={id + "-detail"} className={"mt-1.5 text-xs " + (error ? "font-medium text-red-700" : "text-slate-500")}>{error || hint}</p>}
  </div>;
}

function Detail({ field, children }) {
  return <div className="min-w-0 rounded-xl bg-slate-50 px-4 py-3">
    <dt className="text-xs font-bold text-slate-500">{fieldLabels[field]}</dt>
    <dd className="mt-1 break-words text-sm font-medium text-slate-700">{children}</dd>
  </div>;
}

function Photo({ url, label }) {
  const [failed, setFailed] = useState(false);
  if (!failed && validProductUrl(url, true)) {
    return <img src={url} alt={label} onError={() => setFailed(true)} referrerPolicy="no-referrer" className="size-full object-contain p-2" />;
  }
  return <div className="grid justify-items-center gap-1.5 text-slate-400">
    <ImageIcon size={22} aria-hidden="true" />
    <span className="sr-only">{failed ? "Image unavailable" : "No image"}</span>
  </div>;
}

function Preview({ name, brand, image, mrp, price }) {
  return <aside className="min-w-0 self-start rounded-2xl border border-slate-200 bg-white p-5 xl:sticky xl:top-6">
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-lg bg-violet-50 text-[#7b2cbf]"><ImageIcon size={18} /></span>
      <h2 className="font-extrabold">Product preview</h2>
    </div>
    <div className="mt-4 flex gap-4 xl:block">
      <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50 xl:aspect-[4/3] xl:h-auto xl:w-full">
        <Photo key={image} url={image} label="Product preview" />
      </div>
      <div className="min-w-0 xl:mt-4">
        <p className="break-words text-base font-extrabold text-slate-900">{name.trim() || "Product name"}</p>
        <p className="mt-1 break-words text-sm text-slate-500">{brand.trim() || "Brand"}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-extrabold text-[#7b2cbf]">{price === "" ? "—" : money.format(Number(price))}</span>
          {price !== "" && Number(mrp) > Number(price) && <span className="text-slate-500 line-through">{money.format(Number(mrp))}</span>}
        </div>
      </div>
    </div>
  </aside>;
}

export default function ProductForm({ categories, action, product, headerAction }) {
  const [values, setValues] = useState(() => startingValues(product));
  const [step, setStep] = useState(0);
  const [returnToReview, setReturnToReview] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(product));
  const [savedSlug, setSavedSlug] = useState(product?.slug ?? "");
  const [discountEdited, setDiscountEdited] = useState(Boolean(product?.discount));
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [pending, setPending] = useState(false);
  const [focusField, setFocusField] = useState("");
  const saving = useRef(false);
  const heading = useRef(null);
  const category = categories.find(item => item.id === values.category);
  const subcategories = category?.subcategories ?? [];
  const current = productSteps[step];
  const Icon = icons[step];
  const shownCategory = category && !isPendingCategory(category) ? category.name : "Pending review";
  const subcategory = subcategories.find(item => item.id === values.subcategory);

  useEffect(() => {
    if (!focusField) return;
    const target = focusField === "heading" ? heading.current : document.getElementById("product-" + focusField);
    target?.focus();
    setFocusField("");
  }, [focusField, step]);

  function change(field, value) {
    if (field === "slug") setSlugEdited(true);
    if (field === "discount") setDiscountEdited(true);
    if (field === "mrp" && value === "") setDiscountEdited(false);
    setValues(previous => {
      const next = { ...previous, [field]: value };
      if (field === "product_name" && !slugEdited) next.slug = suggestedProductSlug(value);
      if (field === "category" && !categories.find(item => item.id === value)?.subcategories.some(item => item.id === next.subcategory)) next.subcategory = "";
      if (field === "mrp" || field === "selling_price") {
        if (!next.mrp || !next.selling_price) next.discount = "";
        else if (!discountEdited) next.discount = discountPercent(next.mrp, next.selling_price);
      }
      return next;
    });
    setErrors(previous => ({ ...previous, [field]: undefined, ...(field === "category" ? { subcategory: undefined } : {}), ...(field === "product_name" && !slugEdited ? { slug: undefined } : {}) }));
    setFeedback(null);
  }

  function move(next, fromReview = false) {
    setStep(next);
    setReturnToReview(fromReview);
    setFocusField("heading");
  }

  function showErrors(nextErrors) {
    setErrors(nextErrors);
    const first = [...Object.keys(fieldLabels), "active"].find(key => key === "gallery_images"
      ? Object.keys(nextErrors).some(field => field.startsWith("gallery_images."))
      : nextErrors[key]);
    const target = first === "gallery_images" ? Object.keys(nextErrors).find(key => key.startsWith("gallery_images.")) : first;
    const targetStep = first === "active" ? lastStep : productSteps.findIndex(item => first in item.fields);
    if (targetStep >= 0) {
      setReturnToReview(step === lastStep && targetStep !== lastStep);
      setStep(targetStep);
      setFocusField(target);
    }
  }

  function nextStep() {
    const invalid = Object.fromEntries(Object.entries(validateProduct(values, categories, { existingSlug: savedSlug })).filter(([key]) => key.split(".")[0] in current.fields));
    if (Object.keys(invalid).length) showErrors(invalid);
    else move(returnToReview ? lastStep : step + 1);
  }

  async function save(intent) {
    if (saving.current) return;
    setFeedback(null);
    const publishing = intent === "publish";
    const invalid = validateProduct(values, categories, { publishing, existingSlug: savedSlug });
    if (publishing && !values.active) invalid.active = "Enable publication to publish this product.";
    if (Object.keys(invalid).length) return showErrors(invalid);

    const payload = new FormData();
    for (const [key, value] of Object.entries({ ...values, auto_slug: !slugEdited, intent })) {
      if (Array.isArray(value)) value.forEach(item => payload.append(key, item));
      else payload.append(key, String(value));
    }
    saving.current = true;
    setPending(true);
    try {
      const result = await action(payload);
      if (result.errors) showErrors(result.errors);
      else if (result.product) {
        setErrors({});
        const saved = result.product;
        setValues(previous => ({ ...previous, ...saved }));
        setSavedSlug(saved.slug);
        setSlugEdited(true);
        setFeedback({ text: saved.active ? "Product published." : "Draft saved.", success: true, id: saved.product_id });
        if (!values.product_id) window.history.replaceState(null, "", "/admin/products/" + saved.product_id + "/edit");
      } else setFeedback({ text: result.message });
    } catch {
      setFeedback({ text: "Could not save the product. Your changes are still here. Please try again." });
    } finally {
      saving.current = false;
      setPending(false);
    }
  }

  function field(key, options = {}) {
    const { hint, wide, area, type = "text", prefix, ...attributes } = options;
    const inlineUrl = ["image_url", "source_url", "category_source_url"].includes(key) && values[key].trim()
      && !validProductUrl(values[key].trim(), key === "image_url");
    return <Field field={key} wide={wide} hint={hint} error={errors[key] || (inlineUrl ? "Enter a valid HTTP or HTTPS URL." : undefined)}>{props => {
      const common = { ...props, ...attributes, value: values[key], onChange: event => change(key, event.target.value) };
      if (area) return <textarea {...common} rows={area} className={props.className + " resize-y py-3"} />;
      return <div className="relative">
        {prefix && <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-3.5 grid h-11 items-center text-sm text-slate-500">{prefix}</span>}
        <input {...common} type={type} className={props.className + " h-11 " + (prefix ? "pl-8" : "")} />
      </div>;
    }}</Field>;
  }

  function select(key, options, { disabled = false, value = values[key], onChange = inputValue => change(key, inputValue) } = {}) {
    return <Field field={key} error={errors[key]}>{props => <select {...props} value={value} disabled={disabled} className={props.className + " h-11"} onChange={event => onChange(event.target.value)}>
      {options.map(([option, label]) => <option key={option} value={option}>{label}</option>)}
    </select>}</Field>;
  }

  function changeGallery(index, value) {
    const gallery = [...values.gallery_images];
    if (value === null) gallery.splice(index, 1);
    else gallery[index] = value;
    change("gallery_images", gallery.length ? gallery : [""]);
    setErrors(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => value === null ? !key.startsWith("gallery_images.") : key !== "gallery_images." + index)));
  }

  function display(key) {
    if (key === "category") return shownCategory;
    if (key === "subcategory") return isPendingCategory(subcategory) || isPendingCategory(category) ? "Pending review" : subcategory?.name;
    if (key === "category_status") return values.category_status || "Pending review";
    if (key === "discount") return values.discount === "" ? "" : values.discount + "%";
    if (key === "mrp" || key === "selling_price") return values[key] === "" ? "" : money.format(Number(values[key]));
    if (key === "prescriptionRequired") return values[key] === "true" ? "Required" : "Not required";
    if (key === "gallery_images") return values.gallery_images.filter(value => value.trim()).join("\n");
    if (key === "product_id") return values.product_id || "Generated on first save";
    return values[key];
  }

  const date = value => value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : values.product_id ? "Unavailable" : "Available after saving";

  return <section>
    <PageHeader title={values.product_id ? "Edit product" : "Add product"} parent="Products" description={"Step " + (step + 1) + " of " + productSteps.length + " · " + current.title} secondaryAction={headerAction} />

    <ol aria-label="Product form progress" className="mb-5 flex gap-1.5 rounded-xl border border-slate-200 bg-white p-3 sm:grid sm:grid-cols-7 sm:gap-2">
      {shortTitles.map((title, index) => <li key={title} aria-current={index === step ? "step" : undefined} className="min-w-0 flex-1">
        <div className={"h-1.5 rounded-full " + (index <= step ? "bg-[#7b2cbf]" : "bg-slate-100")} />
        <span className={"mt-2 hidden truncate text-xs sm:block " + (index === step ? "font-extrabold text-[#7b2cbf]" : "font-medium text-slate-500")}>{index + 1}. {title}</span>
        <span className="sr-only sm:hidden">{index + 1}. {title}</span>
      </li>)}
    </ol>

    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(230px,300px)]">
      <form noValidate onSubmit={event => { event.preventDefault(); if (step < lastStep) nextStep(); }} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
        <fieldset disabled={pending} className="min-w-0 p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-[#7b2cbf]"><Icon size={20} /></span>
            <h2 ref={heading} tabIndex={-1} className="text-lg font-extrabold outline-none">{current.title}</h2>
          </div>

          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            {step === 0 && <>
              {field("product_name", { placeholder: "e.g. Paracetamol 500 mg" })}
              {field("brand", { placeholder: "e.g. Dawai24" })}
              {field("manufacturer", { placeholder: "Manufacturer name" })}
              {field("sku", { placeholder: "e.g. MED-001", hint: "Optional for drafts. Required to publish." })}
              {field("slug", { placeholder: "product-name-prx-00001", hint: "The suggested slug gets the product ID on first save. You can enter your own slug." })}
              <dl><Detail field="product_id">{display("product_id")}</Detail></dl>
            </>}

            {step === 1 && <>
              {select("category", [["", values.product_id && !category ? "Pending review" : "Select category"], ...(isPendingCategory(category) ? [[category.id, "Pending review"]] : []), ...categories.filter(item => !isPendingCategory(item)).map(item => [item.id, item.name + (item.active ? "" : " (inactive)")])])}
              {select("subcategory", [["", isPendingCategory(category) && !subcategory ? "Pending review" : "No subcategory"], ...(isPendingCategory(subcategory) ? [[subcategory.id, "Pending review"]] : []), ...subcategories.filter(item => !isPendingCategory(item)).map(item => [item.id, item.name + (item.active ? "" : " (inactive)")])], { disabled: !category || isPendingCategory(category) })}
              {select("category_status", [["", "Select verification status"], ...categoryVerificationOptions.map(item => [item, item])])}
              {field("pack_size", { placeholder: "e.g. Strip of 10 tablets" })}
              {field("unit", { placeholder: "e.g. tablets", list: "product-unit-suggestions" })}
              <datalist id="product-unit-suggestions">{units.map(unit => <option key={unit.toLowerCase()} value={unit} />)}</datalist>
              {field("country_of_origin", { placeholder: "e.g. India" })}
              {select("prescriptionRequired", [["false", "Not required"], ["true", "Prescription required"]])}
            </>}

            {step === 2 && <>
              {field("mrp", { type: "number", min: 0, step: "0.01", prefix: "₹", placeholder: "0.00" })}
              {field("selling_price", { type: "number", min: 0, step: "0.01", prefix: "₹", placeholder: "0.00" })}
              {field("discount", { type: "number", min: 0, max: 100, step: "0.01", disabled: !values.mrp, hint: "Suggested when both prices are known." })}
              {select("stock_status", [["", "Select stock status"], ...productStockOptions.map(item => [item, item])])}
              {field("stock", { type: "number", min: 0, step: "1", hint: "1–5 is low stock. 6 or more is in stock." })}
            </>}

            {step === 3 && <>
              {field("short_description", { wide: true, area: 3, placeholder: "A short summary of the product" })}
              {field("description", { wide: true, area: 8, placeholder: "Full product description" })}
            </>}

            {step === 4 && <>
              {field("image_url", { wide: true, placeholder: "https://example.com/product.jpg", inputMode: "url" })}
              <div className="space-y-3 border-t border-slate-100 pt-4 sm:col-span-2">
                <h3 className="text-sm font-extrabold">Gallery images</h3>
                {values.gallery_images.map((value, index) => {
                  const key = "gallery_images." + index;
                  const invalid = value.trim() && !validProductUrl(value.trim(), true);
                  return <div key={index} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                    <div className="mt-5 grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border bg-slate-50">
                      <Photo key={value} url={value.trim()} label={"Gallery image " + (index + 1)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Field field={key} error={errors[key] || (invalid ? "Enter a valid HTTP or HTTPS image URL." : undefined)}>{props => <input {...props} value={value} inputMode="url" placeholder="https://example.com/image.jpg" className={props.className + " h-11"} onChange={event => changeGallery(index, event.target.value)} />}</Field>
                      <button type="button" onClick={() => changeGallery(index, null)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:underline" aria-label={"Remove gallery image " + (index + 1)}><Trash2 size={13} />Remove</button>
                    </div>
                  </div>;
                })}
                <button type="button" onClick={() => { change("gallery_images", [...values.gallery_images, ""]); setFocusField("gallery_images." + values.gallery_images.length); }} className={secondary}><Plus size={16} />Add image URL</button>
              </div>
            </>}

            {step === 5 && <>
              {field("meta_title", { wide: true, hint: values.meta_title.length + " characters" })}
              <div className="-mt-3 sm:col-span-2"><button type="button" disabled={!values.product_name} onClick={() => change("meta_title", values.product_name)} className="text-xs font-bold text-[#7b2cbf] hover:underline disabled:opacity-50">Use product name</button></div>
              {field("meta_description", { wide: true, area: 3, hint: values.meta_description.length + " characters" })}
              <div className="-mt-3 sm:col-span-2"><button type="button" disabled={!values.short_description} onClick={() => change("meta_description", values.short_description)} className="text-xs font-bold text-[#7b2cbf] hover:underline disabled:opacity-50">Use short description</button></div>
              {field("meta_keywords", { wide: true, placeholder: "Separate keywords with commas" })}
              <h3 className="border-t border-slate-100 pt-4 text-sm font-extrabold sm:col-span-2">Source URLs</h3>
              {field("source_url", { placeholder: "https://...", inputMode: "url" })}
              {field("category_source_url", { placeholder: "https://...", inputMode: "url" })}
            </>}

            {step === lastStep && <>
              {productSteps.slice(0, lastStep).map(({ title, fields }, index) => <section key={title} className="min-w-0 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold">{title}</h3>
                  <button type="button" onClick={() => move(index, true)} className="text-sm font-bold text-[#7b2cbf] hover:underline" aria-label={"Edit " + title}>Edit</button>
                </div>
                <dl className="mt-3 space-y-2 text-xs">{Object.entries(fields).map(([key, label]) => <div key={key}>
                  <dt className="font-semibold text-slate-500">{label}</dt>
                  <dd className="mt-0.5 whitespace-pre-wrap break-words text-slate-800">{display(key) || "—"}</dd>
                </div>)}</dl>
              </section>)}
              <dl className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                <Detail field="created_at">{date(values.created_at)}</Detail>
                <Detail field="updated_at">{date(values.updated_at)}</Detail>
              </dl>
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                  <input id="product-active" name="active" type="checkbox" checked={values.active} onChange={event => change("active", event.target.checked)} aria-invalid={Boolean(errors.active)} aria-describedby={errors.active ? "product-active-error" : undefined} className="mt-0.5 size-4 accent-[#7b2cbf]" />
                  <span><b className="block text-sm">Publish on website</b><span className="mt-0.5 block text-xs text-slate-500">Published products appear on the storefront. Save draft keeps the product unpublished.</span></span>
                </label>
                {errors.active && <p id="product-active-error" className="mt-2 text-xs font-medium text-red-700">{errors.active}</p>}
              </div>
            </>}
          </div>
        </fieldset>

        {feedback && <p role={feedback.success ? "status" : "alert"} className={"mx-5 mb-4 flex flex-wrap items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold sm:mx-6 " + (feedback.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800")}>
          {feedback.success && <Check size={16} />}{feedback.text}
          {feedback.id && <span className="break-all text-xs font-normal">Product ID: {feedback.id}</span>}
          {feedback.success && <Link href="/admin/products" className="ml-auto underline">Products</Link>}
        </p>}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
          <button type="button" disabled={step === 0 || pending} onClick={() => move(step - 1, returnToReview)} className={secondary}><ArrowLeft size={16} />Back</button>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={pending} onClick={() => save("draft")} className={secondary}><Save size={16} />{pending ? "Saving…" : "Save draft"}</button>
            {step < lastStep
              ? <button type="submit" disabled={pending} className={primary}>{returnToReview ? "Return to review" : "Next"}<ArrowRight size={16} /></button>
              : <button type="button" disabled={pending} onClick={() => save("publish")} className={primary}><Check size={16} />Publish product</button>}
          </div>
        </div>
      </form>
      <Preview name={values.product_name} brand={values.brand} image={values.image_url.trim()} mrp={values.mrp} price={values.selling_price} />
    </div>
  </section>;
}
