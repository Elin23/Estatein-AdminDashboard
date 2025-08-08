import { useRef, useState } from "react"
import { db } from "../../firebaseConfig"
import { push, ref, set } from "firebase/database"

const Testimonials = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [clientImageUrl, setClientImageUrl] = useState<string>("")
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
      handleImageUpload(file, (url) => setClientImageUrl(url), setUploadingMain)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || ""

    const data = {
      name: get("name"),
      location: get("location"),
      subject: get("subject"),
      review: get("review"),
      clientImage: clientImageUrl,
    }

    console.log("FINAL DATA:", data)

    try {
      const newRef = push(ref(db, "testimonials"))
      await set(newRef, data)
      console.log("Added successfully")
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
      <h2 className="text-2xl font-bold">Basic Info</h2>

      <input
        name="name"
        placeholder="Client Name"
        className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
      />
      <input
        name="location"
        placeholder="Client Location"
        className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
      />
      <input
        name="subject"
        placeholder="Subject"
        className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
      />

      <textarea
        name="review"
        placeholder="Client Review"
        className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
      />

      <h2 className="text-xl font-bold mt-6">Client Image</h2>
      <input
        type="file"
        accept=".png, .jpg, .jpeg, .webp"
        onChange={handleMainImage}
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      {uploadingMain && <p>Uploading main image...</p>}
      {clientImageUrl && (
        <img
          src={clientImageUrl}
          className="w-24 h-24 object-cover rounded mt-2"
        />
      )}

      <button
        type="submit"
        className="bg-[#1A1A1A] text-white px-4 py-3 rounded-lg w-full mt-6 hover:bg-[#703BF7]"
      >
        Submit Review
      </button>
    </form>
  )
}

export default Testimonials
