import React, { useEffect, useMemo, useState, type Dispatch } from "react";
import { X } from "lucide-react";
import type { Property, PropertyFormData } from "../types";
import FeaturesInput from "./form/FeaturesInput";
import FormField from "./InputField/FormField";

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  locations: string[];
  isloading: boolean;
  editing: boolean;
  setEditing: Dispatch<React.SetStateAction<boolean>>;
  propertyBeingEdited: Property | null;
  onEdit: (id: any, property: any) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  locations,
  isloading,
  editing,
  propertyBeingEdited,
  onEdit,
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const titlePh = useMemo(
    () => (category ? `Attractive ${category} title` : "Property title"),
    [category]
  );


    const baseBtn =
    "inline-flex items-center justify-center rounded-xl px-3 md:px-4 py-1.5 md:py-2 " +
    "text-[10px] md:text-sm font-medium transition-transform duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm";

  const addColors =
    "text-white bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 " +
    "focus-visible:ring-emerald-500 ring-1 ring-emerald-500/40 " +
    "hover:shadow-[0_8px_20px_rgba(16,185,129,0.35)]";

  const updateColors =
    "text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 " +
    "focus-visible:ring-indigo-500 ring-1 ring-indigo-500/40 " +
    "hover:shadow-[0_8px_20px_rgba(79,70,229,0.35)]";





  const pricePh = useMemo(() => {
    if (!category) return "Enter listing price";
    if (category === "apartment") return "e.g., 120000";
    if (category === "villa") return "e.g., 450000";
    if (category === "house") return "e.g., 200000";
    return "e.g., 90000";
  }, [category]);

  const areaPh = useMemo(
    () => (category === "apartment" ? "e.g., 120 (sqm)" : "e.g., 350 (sqm)"),
    [category]
  );

  const mapPh = useMemo(
    () =>
      location
        ? `Paste Google Maps URL for ${location}`
        : "Paste Google Maps URL",
    [location]
  );

  const bedroomsPh = useMemo(
    () => (category === "apartment" ? "e.g., 2" : "e.g., 4"),
    [category]
  );

  const bathroomsPh = useMemo(
    () => (category === "apartment" ? "e.g., 1" : "e.g., 2"),
    [category]
  );

  const tagsPh = useMemo(
    () => "Comma-separated, e.g., sea view, garden",
    []
  );

  const transferTaxPh = "e.g., 25000";
  const legalFeesPh = "e.g., 3000";
  const inspectPh = "e.g., 500";
  const insurancePh = "e.g., 1200 / year";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=edeee7c6c2851a590946b20e9ce00b5d`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data?.success) {
        uploadedUrls.push(data.data.url);
      }
    }

    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    e.target.value = "";
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const yearValue = formData.get("buildYear") as string;
    const realYear = yearValue.split("-")[0];

    const propertyData: PropertyFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location,
      type: category,
      features,
      images: imageUrls,
      mapUrl: formData.get("mapUrl") as string,
      area: Number(formData.get("area")),
      bathrooms: formData.get("bathrooms") as string,
      bedrooms: formData.get("bedrooms") as string,
      buildYear: realYear,
      price: Number(formData.get("price")),
      status: status as "available" | "sold",
      tags: formData.get("tags") as string,

      additionalFees: {
        transferTax: Number(formData.get("transferTax")),
        inspection: Number(formData.get("homeInspection")),
        insurance: Number(formData.get("annualInsurance")),
        legalFees: Number(formData.get("legalFees")),
      },
      monthlyCosts: {
        hoa: Number(formData.get("hoa")),
        propertyTaxes: Number(formData.get("propertyTaxes")),
      },
      monthlyExpenses: {
        hoa: Number(formData.get("hoa")),
        insurance: Number(formData.get("annualInsurance")) / 12,
        propertyTaxes: Number(formData.get("propertyTaxes")),
      },
      totalInitialCosts: {
        downPayment: Number(formData.get("downPayment")),
        additionalFees:
          Number(formData.get("transferTax")) +
          Number(formData.get("legalFees")) +
          Number(formData.get("homeInspection")) +
          Number(formData.get("annualInsurance")),
        listingPrice: Number(formData.get("price")),
        mortgageAmount: Number(formData.get("mortgageAmount")),
      },
    };

    if (editing) {
      onEdit(propertyBeingEdited!.id, propertyData);
    } else {
      onSubmit(propertyData);
    }

    e.currentTarget.reset();
    setImageUrls([]);
    setFeatures([]);
    setLocation("");
    setCategory("");
    setStatus("");
  };

  useEffect(() => {
    if (editing && propertyBeingEdited) {
      setFeatures(propertyBeingEdited.features || []);
      setImageUrls(propertyBeingEdited.images || []);
      setLocation(propertyBeingEdited.location || "");
      setCategory(propertyBeingEdited.type || "");
      setStatus(propertyBeingEdited.status || "");
    } else {
      setFeatures([]);
      setImageUrls([]);
      setLocation("");
      setCategory("");
      setStatus("");
    }
  }, [editing, propertyBeingEdited]);

  const buildYearDefaultDate =
    editing && propertyBeingEdited?.buildYear
      ? `${propertyBeingEdited.buildYear}-01-01`
      : "";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
    >
      <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
        {editing ? "Edit Property" : "Add New Property"}
      </h2>

      {isloading && (
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
      )}

      <div className="grid grid-cols-1 lg-custom:grid-cols-2 gap-4">
        <FormField
          id="title"
          name="title"
          label="Title"
          required
          defaultValue={editing ? propertyBeingEdited?.title : ""}
          placeholder={titlePh}
        />
        <FormField
          id="price"
          type="number"
          name="price"
          label="Price"
          required
          defaultValue={editing ? propertyBeingEdited?.price : ""}
          placeholder={pricePh}
        />
      </div>

      <FormField
        id="description"
        name="description"
        label="Description"
        multiline
        rows={4}
        required
        defaultValue={editing ? propertyBeingEdited?.description : ""}
        placeholder={
          category ? `Describe the ${category} in detail…` : "Short description…"
        }
        className="mt-2"
      />

      <div className="grid grid-cols-1 lg-custom:grid-cols-3 gap-4 mt-2">
        <FormField
          id="location"
          label="Location"
          name="location"
          required
          select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          options={locations.map((loc) => ({ value: loc, label: loc }))}
          placeholder={editing ? "Change location…" : "Select Location"}
        />

        <FormField
          id="category"
          label="Category"
          name="category"
          required
          select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder={editing ? "Change category…" : "Select Category"}
          options={[
            { value: "villa", label: "villa" },
            { value: "apartment", label: "apartment" },
            { value: "house", label: "house" },
          ]}
        />

        <FormField
          id="area"
          type="number"
          name="area"
          label="Area (sq ft)"
          required
          defaultValue={editing ? propertyBeingEdited?.area : ""}
          placeholder={areaPh}
        />
      </div>

      <div className="grid grid-cols-1 lg-custom:grid-cols-3 gap-4 mt-2">
        <div>
          <FormField
            id="buildYear"
            type="date"
            name="buildYear"
            label="Build Year"
            required
            defaultValue={buildYearDefaultDate}
          />
          <p className="text-xs text-gray-500 mt-1">
            Pick any day in the build year — we only save the year.
          </p>
        </div>

        <FormField
          id="bedrooms"
          type="number"
          name="bedrooms"
          label="Bedrooms Count"
          required
          defaultValue={editing ? propertyBeingEdited?.bedrooms : ""}
          placeholder={bedroomsPh}
        />
        <FormField
          id="bathrooms"
          label="Bathrooms Count"
          name="bathrooms"
          type="number"
          required
          defaultValue={editing ? propertyBeingEdited?.bathrooms : ""}
          placeholder={bathroomsPh}
        />
      </div>

      <div className="grid grid-cols-1 lg-custom:grid-cols-3 gap-4 mt-2">
        <FormField
          id="mapUrl"
          label="Map URL"
          name="mapUrl"
          type="url"
          required
          placeholder={mapPh}
          defaultValue={editing ? propertyBeingEdited?.mapUrl : ""}
        />
        <FormField
          id="status"
          label="Status"
          name="status"
          required
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder={editing ? "Change status…" : "Select Status"}
          options={[
            { value: "available", label: "available" },
            { value: "sold", label: "sold" },
          ]}
        />
        <FormField
          id="tags"
          label="Tags"
          name="tags"
          required
          placeholder={tagsPh}
          defaultValue={editing ? propertyBeingEdited?.tags : ""}
        />
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">
          Images
        </label>
        <FormField
          id="images"
          label=""
          name="images"
          file
          accept=".png,.jpg,.jpeg,.webp"
          multiple
          onChange={(e) => {
            handleImageUpload(e as React.ChangeEvent<HTMLInputElement>);
          }}
        />

        {uploading && (
          <div className="w-10 h-10 animate-ping rounded-full bg-blue-700 mx-auto my-2" />
        )}

        <div className="grid grid-cols-2 lg-custom:grid-cols-3 gap-3">
          {imageUrls.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setImageUrls(imageUrls.filter((_, i) => i !== index))
                }
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <FeaturesInput features={features} setFeatures={setFeatures} />
      </div>

      <div className="mt-4">
        <h3 className="text-base font-semibold text-black dark:text-white mb-2">
          Additional Fees
        </h3>
        <div className="grid grid-cols-1 lg-custom:grid-cols-3 gap-4">
          <FormField
            id="transferTax"
            label="Transfer Tax"
            name="transferTax"
            type="number"
            required
            placeholder={transferTaxPh}
            defaultValue={
              editing ? propertyBeingEdited?.additionalFees?.transferTax : ""
            }
          />
          <FormField
            id="legalFees"
            label="Legal Fees"
            name="legalFees"
            type="number"
            required
            placeholder={legalFeesPh}
            defaultValue={
              editing ? propertyBeingEdited?.additionalFees?.legalFees : ""
            }
          />
          <FormField
            id="homeInspection"
            label="Home Inspection"
            name="homeInspection"
            type="number"
            required
            placeholder={inspectPh}
            defaultValue={
              editing ? propertyBeingEdited?.additionalFees?.inspection : ""
            }
          />
          <FormField
            id="annualInsurance"
            label="Annual Insurance"
            name="annualInsurance"
            type="number"
            required
            placeholder={insurancePh}
            defaultValue={
              editing ? propertyBeingEdited?.additionalFees?.insurance : ""
            }
          />
        </div>
      </div>

      <div className=" text-end">

        <button
          type="submit"
          className={`${baseBtn} ${editing ? updateColors : addColors}`}
          disabled={uploading}
        >
          {editing ? "Update Property" : "Add Property"}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
