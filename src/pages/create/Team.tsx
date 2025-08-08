import { useRef, useState } from "react"
import { db } from "../../firebaseConfig"
import { push, ref, set } from "firebase/database"

const Team = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [memberImageUrl, setMemberImageUrl] = useState<string>("")
  const [uploadingMain, setUploadingMain] = useState(false)

  const handleImageUpload = async (
    file: File,
    cb: (url: string) => void,
    setLoading: (v: boolean) => void
  ) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("image", file)

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=edeee7c6c2851a590946b20e9ce00b5d`,
      {
        method: "POST",
        body: formData,
      }
    )

    const data = await res.json()
    if (data?.success) {
      cb(data.data.url)
    }
    setLoading(false)
  }

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file, (url) => setMemberImageUrl(url), setUploadingMain)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const form = formRef.current
    if (!form) return

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || ""

    const propertyData = {
      title: get("title"),
      description: get("description"),
      clientImage: memberImageUrl,
    }

    console.log("FINAL PROPERTY:", propertyData)
    try {
      const newRef = push(ref(db, "team"))
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
      <h2 className="text-2xl font-bold">Team Member</h2>
      <input
        name="name"
        placeholder="Name"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="role"
        placeholder="Role"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2 block"
      />

      <h2 className="text-xl font-bold mt-6">Member Image</h2>
      <input
        type="file"
        accept=".png, .jpg, .jpeg, .webp"
        onChange={handleMainImage}
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      {uploadingMain && <p>Uploading image...</p>}
      {memberImageUrl && (
        <img
          src={memberImageUrl}
          className="w-24 h-24 object-cover rounded mt-2"
        />
      )}

      <button
        type="submit"
        className="bg-[#1A1A1A] text-white px-4 py-3 rounded-lg w-full mt-6 hover:bg-[#703BF7]"
      >
        Submit Member
      </button>
    </form>
  )
}

export default Team
