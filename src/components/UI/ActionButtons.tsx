import React from "react"

interface ActionButtonsProps {
  onAddClick?: () => void
  addBtnText?: string
  addBtnClassName?: string

  showSubmit?: boolean
  submitText?: string
  disableSubmit?: boolean

  onEdit?: () => void
  onDelete?: () => void

  onCancel?: () => void
  disableCancel?: boolean
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddClick,
  addBtnText = "+ Add",
  addBtnClassName,
  showSubmit = false,
  submitText = "Add",
  disableSubmit = false,
  onEdit,
  onDelete,
  onCancel,
  disableCancel = false,
}) => {
  return (
    <div className="flex gap-2 items-center">
      {onAddClick && (
        <button
          type="button"
          onClick={() => {
            onAddClick()
          }}
          className={
            addBtnClassName ??
            "px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          }
        >
          {addBtnText}
        </button>
      )}

      {showSubmit && (
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disableSubmit}
        >
          {submitText}
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          onClick={() => {
            onEdit()
          }}
          className="px-3 py-1 bg-purple-700 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Edit
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={() => {
            onDelete()
          }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={() => {
            onCancel()
          }}
          disabled={disableCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      )}
    </div>
  )
}

export default ActionButtons
