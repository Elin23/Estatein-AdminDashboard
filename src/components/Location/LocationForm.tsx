import { useRef } from "react";
import FormField from "../InputField/FormField";
import GeneralBtn from "../buttons/GeneralBtn";
import type { Location } from "../../types";

interface LocationFormProps {
  initialData?: Location | null;
  onSubmit: (data: Omit<Location, "id">, id?: string) => Promise<void> | void;
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


    if (!branch || !address || !details || !email || !phone || !city || !category ||
      !mapLink) {
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
    const payload: Omit<Location, "id"> = {
      branch,
      address,
      details,
      email,
      phone,
      city,
      category,
       mapLink,
      createdAt: initialData?.createdAt ?? Date.now(),
      ...(initialData?.id ? { updatedAt: Date.now() } : {}),
    };

    await onSubmit(payload, initialData?.id ?? undefined);
    form.reset();
  };

  const isEditing = Boolean(initialData?.id);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
    >
      <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
        {isEditing ? "Edit Location" : "Add Location"}
      </h2>

      <div className="grid grid-cols-1 lg-custom:grid-cols-2 gap-4">
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
          required
        />

        <div className="flex flex-col w-full relative lg-custom:col-span-2">
          <FormField
            id="details"
            name="details"
            label="Location Details"
            placeholder="Location Details"
            defaultValue={initialData?.details}
            multiline
            required
          />
        </div>
      </div>

      <h2 className="2xl:text-2xl text-xl font-bold text-gray-800 dark:text-white mt-4">
        Contact
      </h2>

      <div className="grid grid-cols-1 lg-custom:grid-cols-3 gap-5">
        <div className="flex flex-col w-full relative">
          <FormField
            type="email"
            id="email"
            name="email"
            label="Email"
            defaultValue={initialData?.email}
            placeholder="Email"
            required
          />
        </div>

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

      <div className="flex justify-end gap-3 mt-4">
        <GeneralBtn
          btnContent="Cancel"
          btnType="cancel"
          actionToDo={onCancel}
          disabled={loading}
        />
        <GeneralBtn
          btnContent={loading ? "Saving..." : isEditing ? "Save Changes" : "Add Location"}
          btnType="add"
          actionToDo={() => formRef.current?.requestSubmit()}
          disabled={!!loading}
        />
      </div>
    </form>
  );
}

export default LocationForm;
