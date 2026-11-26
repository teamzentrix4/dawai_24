
"use client";

import { useMemo, useState } from "react";

const steps = [
    { title: "Basic Details", subtitle: "Product identity and brand information" },
    { title: "Category Details", subtitle: "Organize your product" },
    { title: "Pricing & Packaging", subtitle: "Set product price and pack details" },
    { title: "Product Details", subtitle: "Description, images and inventory" },
    { title: "SEO & Review", subtitle: "Optimize and review your product" },
];

const initialData = {
    product_id: "",
    product_name: "",
    slug: "",
    sku: "",
    brand: "",
    manufacturer: "",
    country_of_origin: "India",

    category: "",
    subcategory: "",
    category_status: "Active",
    category_source_url: "",

    mrp: "",
    selling_price: "",
    discount: "",
    pack_size: "",
    unit: "",

    description: "",
    short_description: "",
    image_url: "",
    gallery_images: "",
    stock_status: "In Stock",
    source_url: "",

    meta_title: "",
    meta_description: "",
    meta_keywords: "",
};

export default function ProductWizard({
    categories = [],
    brands = [],
    createAction,
}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState(initialData);

    const selectedCategory = categories.find(
        (category) => category.id === data.category
    );

    const subcategories = selectedCategory?.subcategories || [];

    const discount = useMemo(() => {
        const mrp = Number(data.mrp);
        const selling = Number(data.selling_price);

        if (!mrp || !selling || mrp <= 0 || selling > mrp) return 0;

        return Math.round(((mrp - selling) / mrp) * 100);
    }, [data.mrp, data.selling_price]);

    const updateField = (name, value) => {
        setData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((previous) => previous + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep((previous) => previous - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700";

    const renderInput = (label, name, placeholder = "", type = "text") => (
        <div>
            <label className={labelClass}>{label}</label>
            <input
                type={type}
                name={name}
                value={data[name]}
                onChange={(e) => updateField(name, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
            />
        </div>
    );

    const renderTextarea = (label, name, placeholder = "") => (
        <div>
            <label className={labelClass}>{label}</label>
            <textarea
                name={name}
                rows={4}
                value={data[name]}
                onChange={(e) => updateField(name, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
            />
        </div>
    );

    const renderSelect = (label, name, options) => (
        <div>
            <label className={labelClass}>{label}</label>
            <select
                name={name}
                value={data[name]}
                onChange={(e) => {
                    updateField(name, e.target.value);

                    if (name === "category") {
                        updateField("subcategory", "");
                    }
                }}
                className={inputClass}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <form action={createAction} className="space-y-6">
            {/* Send all form values once */}
            {Object.entries(data).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
            ))}

            {/* Progress Header */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-purple-700">
                            STEP {currentStep + 1} OF 5
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            {steps[currentStep].title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {steps[currentStep].subtitle}
                        </p>
                    </div>

                    <div className="text-2xl font-bold text-purple-700">
                        {Math.round(((currentStep + 1) / 5) * 100)}%
                    </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                        className="h-full rounded-full bg-purple-700 transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                    />
                </div>

                <div className="mt-5 grid grid-cols-5 gap-2">
                    {steps.map((step, index) => (
                        <div key={step.title} className="text-center">
                            <div
                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${index <= currentStep
                                    ? "bg-purple-700 text-white"
                                    : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <p
                                className={`mt-2 hidden text-xs font-medium sm:block ${index === currentStep
                                    ? "text-purple-700"
                                    : "text-gray-500"
                                    }`}
                            >
                                {step.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                {currentStep === 0 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            Basic Product Information
                        </h3>

                        <div className="grid gap-5 md:grid-cols-2">
                            {renderInput("Product ID", "product_id", "Enter product ID")}
                            {renderInput("Product Name *", "product_name", "Enter product name")}
                            {renderInput("Slug", "slug", "product-url-slug")}
                            {renderInput("SKU", "sku", "Enter SKU")}
                            {renderSelect("Brand", "brand", [
                                { value: "Alka Pharma", label: "Alka Pharma" },
                                { value: "Indian Pharmaceuticals", label: "Indian Pharmaceuticals" },
                                { value: "Alsun Pharma", label: "Alsun Pharma" },
                                { value: "Health Plan", label: "Health Plan" },
                                { value: "Alpha Drugs & Pharmaceuticals", label: "Alpha Drugs & Pharmaceuticals" },
                                { value: "M.M Pharma", label: "M.M Pharma" },
                                { value: "Rx Solution", label: "Rx Solution" },
                                { value: "Healthcare Lifesciences", label: "Healthcare Lifesciences" },
                                { value: "Gipla Healthcare", label: "Gipla Healthcare" },
                                { value: "Alpha Healthcare", label: "Alpha Healthcare" },
                                { value: "Pristine Formulations", label: "Pristine Formulations" },
                                { value: "Biochem Pharmaceutical Industries", label: "Biochem Pharmaceutical Industries" },
                                { value: "View Laboratories", label: "View Laboratories" },
                                { value: "Pharmed Ltd.", label: "Pharmed Ltd." },
                                { value: "Novitas Remedies Pvt. Ltd.", label: "Novitas Remedies Pvt. Ltd." },
                                { value: "Solis Pharma", label: "Solis Pharma" },
                                { value: "Tablets India Ltd.", label: "Tablets India Ltd." },
                                { value: "BMP Life Sciences", label: "BMP Life Sciences" },
                                { value: "Piramal Pharma Ltd.", label: "Piramal Pharma Ltd." },
                                { value: "Group Pharmaceuticals Ltd.", label: "Group Pharmaceuticals Ltd." },
                            ])}
                            {renderInput("Manufacturer", "manufacturer", "Enter manufacturer")}
                            {renderInput("Country of Origin", "country_of_origin", "India")}
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            Category Information
                        </h3>

                        <div className="grid gap-5 md:grid-cols-2">
                            {renderSelect(
                                "Category *",
                                "category",
                                categories.map((category) => ({
                                    value: category.id,
                                    label: category.name,
                                }))
                            )}

                            {renderSelect(
                                "Subcategory",
                                "subcategory",
                                subcategories.map((subcategory) => ({
                                    value: subcategory.id,
                                    label: subcategory.name,
                                }))
                            )}

                            {renderSelect("Category Status", "category_status", [
                                { value: "Active", label: "Active" },
                                { value: "Inactive", label: "Inactive" },
                            ])}

                            {renderInput(
                                "Category Source URL",
                                "category_source_url",
                                "https://example.com/category"
                            )}
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            Pricing & Packaging
                        </h3>

                        <div className="grid gap-5 md:grid-cols-2">
                            {renderInput("MRP *", "mrp", "Enter MRP", "number")}
                            {renderInput(
                                "Selling Price *",
                                "selling_price",
                                "Enter selling price",
                                "number"
                            )}

                            <div>
                                <label className={labelClass}>Discount (%)</label>
                                <input
                                    type="number"
                                    value={discount}
                                    readOnly
                                    className={`${inputClass} bg-gray-50`}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Automatically calculated from MRP and selling price.
                                </p>
                            </div>

                            {renderInput("Pack Size", "pack_size", "e.g. 10")}
                            {renderInput("Unit", "unit", "e.g. Tablets, ml, gm")}
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            Product Description & Inventory
                        </h3>

                        <div className="grid gap-5 md:grid-cols-2">
                            {renderInput(
                                "Image URL",
                                "image_url",
                                "Enter main product image URL"
                            )}
                            {renderInput(
                                "Gallery Images",
                                "gallery_images",
                                "Enter image URLs separated by commas"
                            )}
                            {renderSelect("Stock Status", "stock_status", [
                                { value: "In Stock", label: "In Stock" },
                                { value: "Out of Stock", label: "Out of Stock" },
                                { value: "Low Stock", label: "Low Stock" },
                            ])}
                            {renderInput(
                                "Source URL",
                                "source_url",
                                "https://example.com/product"
                            )}
                        </div>

                        {renderTextarea(
                            "Short Description",
                            "short_description",
                            "Write a short product description"
                        )}

                        {renderTextarea(
                            "Full Description",
                            "description",
                            "Write complete product details"
                        )}
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            SEO Information
                        </h3>

                        <div className="space-y-5">
                            {renderInput("Meta Title", "meta_title", "Enter SEO title")}
                            {renderTextarea(
                                "Meta Description",
                                "meta_description",
                                "Write SEO meta description"
                            )}
                            {renderTextarea(
                                "Meta Keywords",
                                "meta_keywords",
                                "Enter keywords separated by commas"
                            )}
                        </div>

                        <div className="rounded-xl bg-purple-50 p-5">
                            <h4 className="mb-4 font-bold text-purple-900">
                                Product Review
                            </h4>

                            <div className="grid gap-3 text-sm sm:grid-cols-2">
                                {Object.entries(data).map(([key, value]) => (
                                    <div key={key} className="rounded-lg bg-white p-3">
                                        <p className="text-xs capitalize text-gray-500">
                                            {key.replaceAll("_", " ")}
                                        </p>
                                        <p className="mt-1 break-words font-medium text-gray-900">
                                            {value || "Not provided"}
                                        </p>
                                    </div>
                                ))}
                                <div className="rounded-lg bg-white p-3">
                                    <p className="text-xs text-gray-500">Calculated Discount</p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {discount}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                    <button
                        type="button"
                        onClick={previousStep}
                        disabled={currentStep === 0}
                        className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="rounded-xl bg-purple-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
                        >
                            Next Step →
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="rounded-xl bg-purple-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
                        >
                            Save Product
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
