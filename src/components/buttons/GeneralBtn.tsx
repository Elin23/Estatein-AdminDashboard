import { useState, type MouseEvent, type ReactNode } from "react"
import ModalComponent from "../ModalComponent"

type GeneralBtnProps = {
  actionToDo?: (data?: any, id?: string) => void
  btnType: "delete" | "update" | "add"
  btnContent: ReactNode
  disabled?: boolean
}

function GeneralBtn({
  actionToDo,
  btnType,
  btnContent,
  disabled,
}: GeneralBtnProps) {
  const [showModal, setShowModal] = useState<boolean>(false)
  const deleteStyles =
    "px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
  const updateAndADdStyles =
    "bg-purple60 hover:bg-purple65  text-white px-4 py-2 rounded"
  const handleBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowModal(true)
  }

  const handleCLoseModal = () => {
    setShowModal(false)
  }
  return (
    <>
      <button
        className={`${btnType == "delete" ? deleteStyles : updateAndADdStyles}`}
        onClick={(e) => handleBtnClicked(e)}
        type="button"
        disabled={disabled}
      >
        {btnContent}
      </button>
      {showModal && (
        <ModalComponent
          modalType={btnType}
          closeModal={handleCLoseModal}
          actionToDo={actionToDo}
        />
      )}
    </>
  )
}

export default GeneralBtn
