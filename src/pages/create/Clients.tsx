import { useRef } from "react"
import { db } from "../../firebaseConfig"
import { push, ref, set } from "firebase/database"

const Clients = () => {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const form = formRef.current
    if (!form) return

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || ""

    const propertyData = {
      name: get("name"),
      since: get("since"),
      domain: get("domain"),
      category: get("category"),
      review: get("review"),
    }

    console.log("FINAL PROPERTY:", propertyData)
    try {
      const newRef = push(ref(db, "clients"))
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
      <h2 className="text-2xl font-bold">Client</h2>
      <input
        name="name"
        placeholder="Company Name"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="since"
        placeholder="Client Since"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="domain"
        placeholder="Domain"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="category"
        placeholder="Category"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <textarea
        name="review"
        placeholder="What They Said 🤗"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2 block"
      />

      <button
        type="submit"
        className="bg-[#1A1A1A] text-white px-4 py-3 rounded-lg w-full mt-6 hover:bg-[#703BF7]"
      >
        Submit Client
      </button>
    </form>
  )
}

export default Clients
