import React from "react"
import { Save, Plus } from "lucide-react"
import FormField from "./FormField"
import type { FormField as FormFieldType } from "../../types"

interface FormBuilderProps {
  formName: string
  selectedCategory: string
  fields: FormFieldType[]
  onFormNameChange: (name: string) => void
  onCategoryChange: (category: string) => void
  onAddField: () => void
  onUpdateField: (id: string, updates: Partial<FormFieldType>) => void
  onRemoveField: (id: string) => void
  onSave: () => void
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  formName,
  selectedCategory,
  fields,
  onFormNameChange,
  onAddField,
  onUpdateField,
  onRemoveField,
  onSave,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Form Name
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => onFormNameChange(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            placeholder="Enter form name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
        </div>
      </div>

      {selectedCategory ? (
        <>
          <div className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                onUpdate={(updates) => onUpdateField(field.id, updates)}
                onRemove={() => onRemoveField(field.id)}
              />
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={onAddField}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Field
            </button>
            <button
              onClick={onSave}
              disabled={!formName || fields.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" /> Save Form
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Please select a category to start building your form
        </div>
      )}
    </div>
  )
}

export default FormBuilder
