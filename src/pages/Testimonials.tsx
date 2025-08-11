import { useState, useEffect, useMemo } from "react"
import { onValue, ref, update } from "firebase/database"
import { db } from "../firebaseConfig"
import TestimonialCard from "../components/TestimonialsCard"

interface Testimonial {
  id: string
  clientImage: string
  location: string
  name: string
  rate: number
  review: string
  show: boolean
  subject: string
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [search, setSearch] = useState("")
  const [showFilter, setShowFilter] = useState<"all" | "true" | "false">("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    const unsub = onValue(ref(db, "testimonials"), (snapshot) => {
      const data = snapshot.val() || {}
      const list: Testimonial[] = Object.entries(data).map(
        ([id, value]: any) => ({
          id,
          ...value,
        })
      )
      setTestimonials(list)
    })
    return () => unsub()
  }, [])

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
      const matchesShow =
        showFilter === "all"
          ? true
          : showFilter === "true"
          ? t.show === true
          : t.show === false
      return matchesSearch && matchesShow
    })
  }, [testimonials, search, showFilter])

  const handleToggleShow = async (id: string, newValue: boolean) => {
    try {
      await update(ref(db, `testimonials/${id}`), { show: newValue })
    } catch (err) {
      console.error("Error updating show:", err)
    }
  }

  const handleBulkUpdate = async (newValue: boolean) => {
    const updates: Record<string, any> = {}
    selectedItems.forEach((id) => {
      updates[`testimonials/${id}/show`] = newValue
    })
    try {
      await update(ref(db), updates)
      setSelectedItems([])
    } catch (err) {
      console.error("Bulk update error:", err)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Testimonials
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          />
          <select
            value={showFilter}
            onChange={(e) => setShowFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All</option>
            <option value="true">Visible</option>
            <option value="false">Hidden</option>
          </select>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleBulkUpdate(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Show Selected
          </button>
          <button
            onClick={() => handleBulkUpdate(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Hide Selected
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((item) => (
          <div key={item.id} className="relative">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
              className="absolute top-3 left-3 w-6 h-6 cursor-pointer border-2 border-gray-400 rounded-sm dark:border-gray-600"
            />
            <TestimonialCard
              testimonial={item}
              onToggleShow={handleToggleShow}
            />
          </div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No testimonials found.
          </p>
        </div>
      )}
    </div>
  )
}

export default Testimonials
