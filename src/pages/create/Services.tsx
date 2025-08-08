import { useRef, useState } from "react"
import { db } from "../../firebaseConfig"
import { push, ref, set } from "firebase/database"

const Services = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [mainImageUrl, setMainImageUrl] = useState<string>("")
  const [uploadingMain, setUploadingMain] = useState(false)
  const [subServices, setSubServices] = useState<
    { name: string; description: string; image: string; uploading: boolean }[]
  >([])

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
      handleImageUpload(file, (url) => setMainImageUrl(url), setUploadingMain)
    }
  }

  const handleAddSubService = () => {
    setSubServices([
      ...subServices,
      { name: "", description: "", image: "", uploading: false },
    ])
  }

  const handleSubNameChange = (index: number, value: string) => {
    const updated = [...subServices]
    updated[index].name = value
    setSubServices(updated)
  }
  const handleSubDescChange = (index: number, value: string) => {
    const updated = [...subServices]
    updated[index].description = value
    setSubServices(updated)
  }

  const handleSubImageChange = (index: number, file: File) => {
    const updated = [...subServices]
    updated[index].uploading = true
    setSubServices(updated)

    handleImageUpload(
      file,
      (url) => {
        updated[index].image = url
        updated[index].uploading = false
        setSubServices([...updated])
      },
      (v) => {
        updated[index].uploading = v
        setSubServices([...updated])
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || ""

    const data = {
      type: get("name"),
      description: get("description"),
      mainImage: mainImageUrl,
      subServices: subServices.map((sub) => ({
        name: sub.name,
        description: sub.description,
        image: sub.image,
      })),
      learnTitle: get("learnTitle"),
      learnText: get("learnText"),
    }

    console.log("FINAL DATA:", data)

    try {
      const newRef = push(ref(db, "services"))
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
        placeholder="Service Name"
        className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
      />

      <textarea
        name="description"
        placeholder="Service Description"
        className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
      />

      <h2 className="text-xl font-bold mt-6">Main Service Image</h2>
      <input
        type="file"
        accept=".png, .jpg, .jpeg, .webp"
        onChange={handleMainImage}
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      {uploadingMain && <p>Uploading main image...</p>}
      {mainImageUrl && (
        <img
          src={mainImageUrl}
          className="w-24 h-24 object-cover rounded mt-2"
        />
      )}

      <h2 className="text-xl font-bold mt-6">Sub Services</h2>
      {subServices.map((sub, i) => (
        <div
          key={i}
          className="border border-black/20 p-4 rounded-lg my-2 space-y-2"
        >
          <input
            type="text"
            value={sub.name}
            placeholder={`Sub Service #${i + 1}`}
            onChange={(e) => handleSubNameChange(i, e.target.value)}
            className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
          />
          <textarea
            value={sub.description}
            placeholder={`Sub Service #${i + 1} description`}
            onChange={(e) => handleSubDescChange(i, e.target.value)}
            className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
          />
          <input
            className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
            type="file"
            accept=".png, .jpg, .jpeg, .webp"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleSubImageChange(i, file)
            }}
          />
          {sub.uploading && <p>Uploading image...</p>}
          {sub.image && (
            <img
              src={sub.image}
              className="w-24 h-24 object-cover rounded mt-2"
            />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddSubService}
        className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg hover:bg-[#703BF7]"
      >
        + Add Sub Service
      </button>

      <h2 className="text-xl font-bold mt-6">Learn more</h2>
      <input
        name="learnTitle"
        placeholder="Learn More Title"
        className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
      />

      <textarea
        name="learnText"
        placeholder="Learn More Text"
        className="border border-[#1A1A1A]/50 rounded-lg p-2 w-full"
      />

      <button
        type="submit"
        className="bg-[#1A1A1A] text-white px-4 py-3 rounded-lg w-full mt-6 hover:bg-[#703BF7]"
      >
        Submit Service
      </button>
    </form>
  )
}

export default Services
