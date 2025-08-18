import { useRef } from "react";
import type { Location } from "../../types"; // use Location instead of LocationData
import FormField from "../InputField/FormField";
import CancleBtn from "../buttons/CancleBtn";
import GeneralBtn from "../buttons/GeneralBtn";

interface LocationFormProps {
  initialData?: Location | null;
  onSubmit: (data: Omit<Location, "id">, id?: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

function LocationForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading,
}: LocationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
    const mapLink = get("mapLink");


    if (
      !branch ||
      !address ||
      !details ||
      !email ||
      !phone ||
      !city ||
      !category ||
      !mapLink
    ) {
      alert("Please fill in all fields before saving.");
      return;
    }

     const normalizedMapLink = mapLink.startsWith("http")
       ? mapLink
       : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
           mapLink
         )}`;

    await onSubmit(
      
      {
        branch,
        address,
        details,
        email,
        phone,
        city,
        category,
        createdAt: initialData?.createdAt ?? Date.now(),
         mapLink: normalizedMapLink,
      },
      initialData?.id
    );

    form.reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-4 lg-custom:p-[40px] 2xl:p-[50px] gap-[24px] lg-custom:gap-[40px] 2xl:gap-[50px] flex flex-col w-full rounded-xl border bg-white dark:bg-gray-800"
    >
      <h2 className="2xl:text-2xl text-xl font-bold text-gray-800 dark:text-white">
        {initialData?.branch ? "Edit Location" : "Add Location"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          id="branch"
          name="branch"
          label="Branch Name"
          defaultValue={initialData?.branch}
          placeholder="Branch Name"
          required
        />

        <FormField
          id="address"
          name="address"
          label="Address"
          defaultValue={initialData?.address}
          placeholder="Address"
          required
        />

        <FormField
          id="category"
          name="category"
          label="Category"
          placeholder="Select Category"
          defaultValue={initialData?.category || ""}
          select
          options={[
            { value: "regional", label: "Regional" },
            { value: "international", label: "International" },
          ]}
        />

        <FormField
          id="details"
          name="details"
          label="Location Details"
          placeholder="Location Details"
          defaultValue={initialData?.details}
          multiline
          rows={4}
          required
          className="md:col-span-2"
        />
      </div>

      <h2 className="2xl:text-2xl text-xl font-bold text-gray-800 dark:text-white mt-4">
        Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormField
          type="email"
          id="email"
          name="email"
          label="Email"
          defaultValue={initialData?.email}
          placeholder="Email"
          required
        />

        <FormField
          id="phone"
          name="phone"
          label="Phone Number"
          defaultValue={initialData?.phone}
          placeholder="Phone Number"
          required
        />

        <FormField
          id="city"
          name="city"
          label="City"
          defaultValue={initialData?.city}
          placeholder="City"
          required
        />

        <FormField
          id="mapLink"
          name="mapLink"
          label="Map Link"
          defaultValue={initialData?.mapLink}
          placeholder="Map Link"
          required
        />
      </div>

      <div className="flex gap-4 mt-4">
        <GeneralBtn
          btnContent={loading ? "Saving..." : "Save"}
          btnType="add"
          actionToDo={() => formRef.current?.requestSubmit()}
          disabled={loading}
        />
        <CancleBtn onCLick={onCancel} disabled={loading} />
      </div>
    </form>
  );
}

export default LocationForm;
