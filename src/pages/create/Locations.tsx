import { useRef } from "react"
import { db } from "../../firebaseConfig"
import { push, ref, set } from "firebase/database"

const Locations = () => {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const form = formRef.current
    if (!form) return

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || ""

    const propertyData = {
      branch: get("branch"),
      address: get("address"),
      details: get("details"),
      email: get("email"),
      phone: get("phone"),
      city: get("city"),
    }

    console.log("FINAL PROPERTY:", propertyData)
    try {
      const newRef = push(ref(db, "locations"))
      await set(newRef, propertyData)
      console.log("Added !!")
    } catch (error) {
      console.error("Failed", error)
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 p-6 max-w-3xl my-10 mx-auto bg-[#703BF7]/10 rounded-2xl"
    >
      <h2 className="text-2xl font-bold">Location</h2>
      <input
        name="branch"
        placeholder="Branch Name"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="address"
        placeholder="Address"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <textarea
        name="details"
        placeholder="Location Details"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2 block"
      />

      <h2 className="text-2xl font-bold">Contact</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="phone"
        placeholder="Phone Number"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="city"
        placeholder="City"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />

      <button
        type="submit"
        className="bg-[#1A1A1A] text-white px-4 py-3 rounded-lg w-full mt-6 hover:bg-[#703BF7]"
      >
        Submit Location
      </button>
    </form>
  )
}

export default Locations
