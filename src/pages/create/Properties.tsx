import { useRef, useState } from "react"
import { db } from "../../firebaseConfig"
import { push, ref, set } from "firebase/database"

const Properties = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    const uploadedUrls: string[] = []

    for (const file of Array.from(files)) {
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
        uploadedUrls.push(data.data.url)
      }
    }

    setImageUrls(uploadedUrls)
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const form = formRef.current
    if (!form) return

    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value || ""

    const propertyData = {
      type: get("type"),
      location: get("location"),
      price: parseFloat(get("price")),
      description: get("description"),
      bedrooms: parseInt(get("bedrooms")),
      bathrooms: parseInt(get("bathrooms")),
      area: parseFloat(get("area")),
      features: get("features")
        .split(",")
        .map((f) => f.trim()),

      images: imageUrls,

      additionalFees: {
        transferTax: parseFloat(get("transferTax")),
        legalFees: parseFloat(get("legalFees")),
        inspection: parseFloat(get("inspection")),
        insurance: parseFloat(get("insurance")),
        mortgageFees: parseFloat(get("mortgageFees")),
      },

      monthlyCosts: {
        propertyTaxes: parseFloat(get("monthlyTaxes")),
        hoa: parseFloat(get("hoaFee")),
      },

      totalInitialCosts: {
        listingPrice: parseFloat(get("listingPrice")),
        additionalFees: parseFloat(get("totalAdditionalFees")),
        downPayment: parseFloat(get("downPayment")),
        mortgageAmount: parseFloat(get("mortgageAmount")),
      },

      monthlyExpenses: {
        propertyTaxes: parseFloat(get("expenseTaxes")),
        hoa: parseFloat(get("expenseHoa")),
        insurance: parseFloat(get("expenseInsurance")),
      },
    }

    console.log("FINAL PROPERTY:", propertyData)
    try {
      const newRef = push(ref(db, "properties"))
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
      <h2 className="text-2xl font-bold">Basic Info</h2>
      <input
        name="type"
        placeholder="Type (e.g., Apartment)"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="location"
        placeholder="Location"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />

      <input
        name="bedrooms"
        type="number"
        placeholder="Bedrooms"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="bathrooms"
        type="number"
        placeholder="Bathrooms"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="area"
        type="number"
        placeholder="Area (m²)"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="features"
        placeholder="Features (comma separated)"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <textarea
        name="description"
        placeholder="Description"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2 block"
      />

      <h2 className="text-2xl font-bold mt-8">Upload Images</h2>
      <input
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
        type="file"
        accept=".png, .jpg, .jpeg, .webp"
        multiple
        onChange={handleImageUpload}
      />
      {uploading && <p>Uploading images...</p>}
      <div className="flex gap-2 flex-wrap mt-2">
        {imageUrls.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="Preview"
            className="w-24 h-24 object-cover rounded"
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8">Additional Fees</h2>
      <input
        name="transferTax"
        type="number"
        placeholder="Transfer Tax"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="legalFees"
        type="number"
        placeholder="Legal Fees"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="inspection"
        type="number"
        placeholder="Home Inspection"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="insurance"
        type="number"
        placeholder="Property Insurance"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="mortgageFees"
        type="number"
        placeholder="Mortgage Fees"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />

      <h2 className="text-2xl font-bold mt-8">Monthly Costs</h2>
      <input
        name="monthlyTaxes"
        type="number"
        placeholder="Property Taxes"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="hoaFee"
        type="number"
        placeholder="HOA Fee"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />

      <h2 className="text-2xl font-bold mt-8">Total Initial Costs</h2>
      <input
        name="listingPrice"
        type="number"
        placeholder="Listing Price"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="totalAdditionalFees"
        type="number"
        placeholder="Additional Fees Total"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="downPayment"
        type="number"
        placeholder="Down Payment"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="mortgageAmount"
        type="number"
        placeholder="Mortgage Amount"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />

      <h2 className="text-2xl font-bold mt-8">Monthly Expenses</h2>
      <input
        name="expenseTaxes"
        type="number"
        placeholder="Property Taxes"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="expenseHoa"
        type="number"
        placeholder="HOA Fee"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />
      <input
        name="expenseInsurance"
        type="number"
        placeholder="Insurance"
        className="border border-[#1A1A1A]/50 rounded-lg mr-2 p-2"
      />

      <button
        type="submit"
        className="bg-[#1A1A1A] text-white px-4 py-3 rounded-lg w-full mt-6 hover:bg-[#703BF7]"
      >
        Submit Property
      </button>
    </form>
  )
}

export default Properties
