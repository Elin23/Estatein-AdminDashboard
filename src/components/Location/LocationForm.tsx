import { useRef } from "react";
import type { LocationData } from "../../types/forms";

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
          <label
            htmlFor="branch"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold text-gray-800 dark:text-white"
          >
            Branch Name
          </label>
          <input
            id="branch"
            name="branch"
            defaultValue={initialData.branch}
            placeholder="Branch Name"
            className="rounded-lg  text-sm/[20px] 2xl:text-lg font-medium border border-black dark:border-white  text-black dark:text-white px-5 py-4"
          />
        </div>

        <div className="flex flex-col w-full relative">
          <label
            htmlFor="address"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-800 dark:text-white"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={initialData.address}
            placeholder="Address"
            className="rounded-lg border-black dark:border-white  text-black dark:text-white text-sm/[20px] 2xl:text-lg font-medium border  px-5 py-4"
          />
        </div>

        <div className="flex flex-col w-full relative">
          <label
            htmlFor="category"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold text-gray-800 dark:text-white"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={initialData.category || ""}
            className="rounded-lg border-black dark:border-white  text-black dark:text-white text-sm/[20px] 2xl:text-lg font-medium border  px-5 py-4"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option className=" dark:text-black text-white" value="regional">Regional</option>
            <option className=" dark:text-black text-white" value="international">International</option>
          </select>
        </div>

        <div className="flex flex-col w-full relative md:col-span-2">
          <label
            htmlFor="details"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold text-gray-800 dark:text-white"
          >
            Location Details
          </label>
          <textarea
            id="details"
            name="details"
            defaultValue={initialData.details}
            placeholder="Location Details"
            className="rounded-lg border-black dark:border-white  text-black dark:text-white text-sm/[20px] 2xl:text-lg font-medium border  px-5 py-4 resize-none"
            rows={4}
          />
        </div>
      </div>

      <h2 className="2xl:text-2xl text-xl font-bold text-gray-800 dark:text-white mt-4">
        Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col w-full relative">
          <label
            htmlFor="email"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-800 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={initialData.email}
            placeholder="Email"
            className="rounded-lg border-black dark:border-white  text-black dark:text-white text-sm/[20px] 2xl:text-lg font-medium border  px-5 py-4"
          />
        </div>

        <div className="flex flex-col w-full relative">
          <label
            htmlFor="phone"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-800 dark:text-white"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={initialData.phone}
            placeholder="Phone Number"
            className="rounded-lg border-black dark:border-white  text-black dark:text-white text-sm/[20px] 2xl:text-lg font-medium border  px-5 py-4"
          />
        </div>

        <div className="flex flex-col w-full relative">
          <label
            htmlFor="city"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-800 dark:text-white"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            defaultValue={initialData.city}
            placeholder="City"
            className="rounded-lg border-black dark:border-white  text-black dark:text-white text-sm/[20px] 2xl:text-lg font-medium border  px-5 py-4"
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
