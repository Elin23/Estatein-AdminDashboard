import { X } from "lucide-react"
import React, { useState } from "react"
import FormField from "../InputField/FormField"
import GeneralBtn from "../buttons/GeneralBtn"

interface FeaturesInputProps {
  features: string[]
  setFeatures: React.Dispatch<React.SetStateAction<string[]>>
}

export default function FeaturesInput({
  features,
  setFeatures,
}: FeaturesInputProps) {
  const [currentFeature, setCurrentFeature] = useState("")

  const addFeature = () => {
    const trimmed = currentFeature.trim()
    if (!trimmed) return
    if (features.includes(trimmed)) return

    setFeatures([...features, trimmed])
    setCurrentFeature("")
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addFeature()
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Features
      </label>

      <div className="flex gap-2">
        <FormField
          onChange={(e) => setCurrentFeature(e.target.value)}
          onKeyDown={handleKeyDown}
          value={currentFeature}
          placeholder="Add a feature..."
          className=" w-full"
        />

        <GeneralBtn
          btnContent="Add"
          actionToDo={addFeature}
          btnType="add"
        />
      </div>

      <div className="flex flex-col gap-2 mt-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
            flex items-center justify-start gap-4 w-max py-2 px-1"
          >
            {feature}
            <button
              type="button"
              onClick={() => removeFeature(feature)}
              className="text-base text-red-600 cursor-pointer  rounded-lg bg-gray40 h-8 w-8 flex items-center justify-center
              hover:bg-gray30 duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
