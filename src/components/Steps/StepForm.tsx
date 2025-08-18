import { useEffect, useRef, useState } from "react"
import type { Step } from "../../types/Steps"
import FormField from "../InputField/FormField"

interface StepFormProps {
  initialData?: Step | null
  onCancel: () => void
  onSubmit: (data: Omit<Step, "id">, id?: string) => Promise<void>
}

export default function StepForm({
  initialData = null,
  onCancel,
  onSubmit,
}: StepFormProps) {
  const [stepNum, setStepNum] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const fromRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (initialData) {
      setStepNum(initialData.stepNum)
      setTitle(initialData.title)
      setDescription(initialData.description)
    } else {
      setStepNum("")
      setTitle("")
      setDescription("")
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stepNum.trim() || !title.trim() || !description.trim()) {
      return alert("Please fill all fields")
    }
    setLoading(true)
    try {
      await onSubmit(
        {
          stepNum: stepNum.trim(),
          title: title.trim(),
          description: description.trim(),
        },
        initialData?.id
      )
      if (!initialData) {
        setStepNum("")
        setTitle("")
        setDescription("")
      }
    } catch {
      alert("Save failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
      ref={fromRef}
    >
      <FormField
        label="Step Num"
        name="stepNum"
        type="number"
        value={stepNum}
        onChange={(e) => setStepNum(e.target.value)}
        required
        placeholder="ex. 01"
      />

      <FormField
        label="Title"
        name="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Enter step title"
      />

      <FormField
        label="Description"
        name="description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Enter step description"
      />

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-white rounded 
    ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple60 hover:bg-purple70"
            }`}
        >
          {loading
            ? initialData
              ? "Updating..."
              : "Saving..."
            : initialData
              ? "Update"
              : "Add"}
        </button>
      </div>
    </form>
  )
}
