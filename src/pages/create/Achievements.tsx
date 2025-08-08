import { useRef } from "react"
import { db } from "../../firebaseConfig"
import { push, ref, set } from "firebase/database"

const Achievements = () => {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const form = formRef.current
    if (!form) return

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || ""

    const propertyData = {
      title: get("title"),
      description: get("description"),
    }

    console.log("FINAL PROPERTY:", propertyData)
    try {
      const newRef = push(ref(db, "achievements"))
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
      <h2 className="text-2xl font-bold">Achievements</h2>
      <input
        name="title"
        placeholder="Title"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <textarea
        name="description"
        placeholder="description"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2 block"
      />

      <button
        type="submit"
        className="bg-[#1A1A1A] text-white px-4 py-3 rounded-lg w-full mt-6 hover:bg-[#703BF7]"
      >
        Submit Achievement
      </button>
    </form>
  )
}

export default Achievements
