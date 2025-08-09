// import { useRef } from "react";
// import type { LocationData } from "../types/forms";

// interface LocationFormProps {
//   initialData?: Partial<LocationData>;
//   onSubmit: (data: LocationData) => void;
//   onCancel: () => void;
//   loading?: boolean;
// }

// function LocationForm({
//   initialData = {},
//   onSubmit,
//   onCancel,
//   loading,
// }: LocationFormProps) {
//   const formRef = useRef<HTMLFormElement>(null);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const form = formRef.current;
//     if (!form) return;

//     const get = (name: string) =>
//       (form.elements.namedItem(name) as HTMLInputElement)?.value || "";

//     onSubmit({
//       branch: get("branch"),
//       address: get("address"),
//       details: get("details"),
//       email: get("email"),
//       phone: get("phone"),
//       city: get("city"),
//       category: get("category"),
//     });

//     form.reset();
//   };

//   return (
//     <form
//       ref={formRef}
//       onSubmit={handleSubmit}
//       className="space-y-4 bg-[#703BF7]/10 rounded-2xl p-6"
//     >
//       <h2 className="text-2xl font-bold">
//         {initialData.branch ? "Edit Location" : "Add Location"}
//       </h2>

//       <input
//         name="branch"
//         defaultValue={initialData.branch}
//         placeholder="Branch Name"
//         className="input"
//       />
//       <input
//         name="address"
//         defaultValue={initialData.address}
//         placeholder="Address"
//         className="input"
//       />

//       <select
//         name="category"
//         defaultValue={initialData.category || ""}
//         className="input"
//       >
//         <option value="" disabled>
//           Select Category
//         </option>
//         <option value="regional">Regional</option>
//         <option value="international">International</option>
//       </select>

//       <textarea
//         name="details"
//         defaultValue={initialData.details}
//         placeholder="Location Details"
//         className="input"
//       />

//       <h2 className="text-2xl font-bold">Contact</h2>
//       <input
//         type="email"
//         name="email"
//         defaultValue={initialData.email}
//         placeholder="Email"
//         className="input"
//       />
//       <input
//         name="phone"
//         defaultValue={initialData.phone}
//         placeholder="Phone Number"
//         className="input"
//       />
//       <input
//         name="city"
//         defaultValue={initialData.city}
//         placeholder="City"
//         className="input"
//       />

//       <div className="flex gap-2">
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-[#703BF7] text-white px-4 py-2 rounded-lg"
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="bg-gray-400 text-white px-4 py-2 rounded-lg"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

// export default LocationForm;
import { useRef } from "react";
import type { LocationData } from "../types/forms";

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
      (form.elements.namedItem(name) as HTMLInputElement)?.value || "";

    onSubmit({
      branch: get("branch"),
      address: get("address"),
      details: get("details"),
      email: get("email"),
      phone: get("phone"),
      city: get("city"),
      category: get("category"),
    });

    form.reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-5 lg-custom:p-[40px] 2xl:p-[50px] gap-[30px] lg-custom:gap-[40px] 2xl:gap-[50px] flex flex-col w-full rounded-xl border border-white90 dark:border-gray15 bg-white dark:bg-gray-800"
    >
      <h2 className="2xl:text-2xl text-xl font-bold  text-gray-700 dark:text-gray-200">
        {initialData.branch ? "Edit Location" : "Add Location"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col w-full relative">
          <label
            htmlFor="branch"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-700 dark:text-gray-200"
          >
            Branch Name
          </label>
          <input
            id="branch"
            name="branch"
            defaultValue={initialData.branch}
            placeholder="Branch Name"
            className="rounded-lg bg-white97 dark:bg-gray10 text-gray60 dark:text-gray40 text-sm/[20px] 2xl:text-lg font-medium border border-white90 dark:border-gray15 px-5 py-4"
          />
        </div>

        <div className="flex flex-col w-full relative">
          <label
            htmlFor="address"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-700 dark:text-gray-200"
          >
            Address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={initialData.address}
            placeholder="Address"
            className="rounded-lg bg-white97 dark:bg-gray10 text-gray60 dark:text-gray40 text-sm/[20px] 2xl:text-lg font-medium border border-white90 dark:border-gray15 px-5 py-4"
          />
        </div>

        <div className="flex flex-col w-full relative">
          <label
            htmlFor="category"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-700 dark:text-gray-200"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={initialData.category || ""}
            className="rounded-lg bg-white97 dark:bg-gray10 text-gray60 dark:text-gray40 text-sm/[20px] 2xl:text-lg font-medium border border-white90 dark:border-gray15 px-5 py-4"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="regional">Regional</option>
            <option value="international">International</option>
          </select>
        </div>

        <div className="flex flex-col w-full relative md:col-span-2">
          <label
            htmlFor="details"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-700 dark:text-gray-200"
          >
            Location Details
          </label>
          <textarea
            id="details"
            name="details"
            defaultValue={initialData.details}
            placeholder="Location Details"
            className="rounded-lg bg-white97 dark:bg-gray10 text-gray60 dark:text-gray40 text-sm/[20px] 2xl:text-lg font-medium border border-white90 dark:border-gray15 px-5 py-4 resize-none"
            rows={4}
          />
        </div>
      </div>

      <h2 className="2xl:text-2xl text-xl font-bold  text-gray-700 dark:text-gray-200 mt-6">
        Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col w-full relative">
          <label
            htmlFor="email"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-700 dark:text-gray-200"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={initialData.email}
            placeholder="Email"
            className="rounded-lg bg-white97 dark:bg-gray10 text-gray60 dark:text-gray40 text-sm/[20px] 2xl:text-lg font-medium border border-white90 dark:border-gray15 px-5 py-4"
          />
        </div>

        <div className="flex flex-col w-full relative">
          <label
            htmlFor="phone"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-700 dark:text-gray-200"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={initialData.phone}
            placeholder="Phone Number"
            className="rounded-lg bg-white97 dark:bg-gray10 text-gray60 dark:text-gray40 text-sm/[20px] 2xl:text-lg font-medium border border-white90 dark:border-gray15 px-5 py-4"
          />
        </div>

        <div className="flex flex-col w-full relative">
          <label
            htmlFor="city"
            className="mb-2.5 text-base/[1.5] 2xl:text-xl font-semibold  text-gray-700 dark:text-gray-200"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            defaultValue={initialData.city}
            placeholder="City"
            className="rounded-lg bg-white97 dark:bg-gray10 text-gray60 dark:text-gray40 text-sm/[20px] 2xl:text-lg font-medium border border-white90 dark:border-gray15 px-5 py-4"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="normalPurple 2xl:py-4.5 2xl:px-11.5 lg-custom:py-3.5 lg-custom:px-[34px] 2xl:text-lg text-sm/[24px] rounded-lg text-white bg-[#703BF7] disabled:opacity-50"
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
