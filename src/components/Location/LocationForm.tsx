import { useRef } from "react";
import type { LocationData } from "../../types/forms";
import FormField from "../InputField/FormField";

interface LocationFormProps {
  initialData?: Partial<LocationData>;
  onSubmit: (data: LocationData) => void;
  onCancel: () => void;
  loading?: boolean;
}

function LocationForm({
  initialData = {},
  onSubmit,
  onCancel,
  loading,
}: LocationFormProps) {

  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value.trim() || "";

    const branch = get("branch");
    const address = get("address");
    const details = get("details");
    const email = get("email");
    const phone = get("phone");
    const city = get("city");
    const category = get("category");

    if (
      !branch ||
      !address ||
      !details ||
      !email ||
      !phone ||
      !city ||
      !category
    ) {
      alert("Please fill in all fields before saving.");
      return;
    }

    onSubmit({
      branch,
      address,
      details,
      email,
      phone,
      city,
      category,
      createdAt: initialData?.createdAt || Date.now(),
    });

    form.reset();
  };


  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-4 lg-custom:p-[40px] 2xl:p-[50px] gap-[24px] lg-custom:gap-[40px] 2xl:gap-[50px] flex flex-col w-full rounded-xl border  bg-white dark:bg-gray-800"
    >
      <h2 className="2xl:text-2xl text-xl font-bold text-gray-800 dark:text-white">
        {initialData.branch ? "Edit Location" : "Add Location"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col w-full relative">
          <FormField
            id="branch"
            name="branch"
            label="Branch Name"
            defaultValue={initialData.branch}
            placeholder="Branch Name"
            required
          />
        </div>


        <div className="flex flex-col w-full relative">
          <FormField
            id="address"
            name="address"
            label="Address"
            defaultValue={initialData.address}
            placeholder="Address"
            required
          />
        </div>

        <div className="flex flex-col w-full relative">
          <FormField
            id="category"
            name="category"
            label="Category"
            placeholder="Select Category"
            defaultValue={initialData.category || ""}
            select
            options={[
              { value: "regional", label: "Regional" },
              { value: "international", label: "International" },
            ]}
          />
        </div>

        <div className="flex flex-col w-full relative md:col-span-2">
          <FormField
            id="details"
            name="details"
            label="Location Details"
            placeholder="Location Details"
            defaultValue={initialData.details}
            multiline
            rows={4}
            required
          />
        </div>
      </div>

      <h2 className="2xl:text-2xl text-xl font-bold text-gray-800 dark:text-white mt-4">
        Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col w-full relative">
          <FormField
            type="email"
            id="email"
            name="email"
            label="Email"
            defaultValue={initialData.email}
            placeholder="Email"
            required
          />
        </div>

        <div className="flex flex-col w-full relative">
          <FormField
            id="phone"
            name="phone"
            label="Phone Number"
            defaultValue={initialData.phone}
            placeholder="Phone Number"
            required
          />
        </div>

        <div className="flex flex-col w-full relative">
          <FormField
            id="city"
            name="city"
            label="City"
            defaultValue={initialData.city}
            placeholder="City"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="2xl:py-4.5 2xl:px-11.5 lg-custom:py-3.5 lg-custom:px-[34px] 2xl:text-lg text-sm/[24px] rounded-lg text-white bg-purple60 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-6 py-3 rounded-lg text-sm/[24px]"
        >
          Cancel
        </button>
        
      </div>
    </form>
  );
}

export default LocationForm;
