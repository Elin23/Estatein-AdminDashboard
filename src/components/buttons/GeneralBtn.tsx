import { useState, type MouseEvent, type ReactNode } from "react";
import ModalComponent from "../ModalComponent";

type GeneralBtnProps = {
  actionToDo?: (data?: any, id?: string) => void;
  btnType: "delete" | "update" | "add" | "cancel";
  btnContent: ReactNode;
  disabled?: boolean;
  targetLabel?: string;
};

function GeneralBtn({
  actionToDo,
  btnType,
  btnContent,
  disabled,
  targetLabel,
}: GeneralBtnProps) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const baseBtn =
    "inline-flex items-center justify-center rounded-xl px-3 md:px-4 py-1.5 md:py-2 " +
    "text-[10px] md:text-sm font-medium transition-transform duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm";

  const deleteColors =
    "text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 " +
    "focus-visible:ring-red-500 ring-1 ring-red-500/40 " +
    "hover:shadow-[0_8px_20px_rgba(220,38,38,0.35)]";

  const addColors =
    "text-white bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 " +
    "focus-visible:ring-emerald-500 ring-1 ring-emerald-500/40 " +
    "hover:shadow-[0_8px_20px_rgba(16,185,129,0.35)]";

  const updateColors =
    "text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 " +
    "focus-visible:ring-indigo-500 ring-1 ring-indigo-500/40 " +
    "hover:shadow-[0_8px_20px_rgba(79,70,229,0.35)]";

  const cancelColors =
    "text-gray-800 dark:text-gray-100 bg-white hover:bg-gray-50 " +
    "ring-1 ring-inset ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:ring-gray-700 " +
    "focus-visible:ring-gray-400 dark:focus-visible:ring-gray-600";

  const colorByType =
    btnType === "delete"
      ? deleteColors
      : btnType === "add"
      ? addColors
      : btnType === "update"
      ? updateColors
      : cancelColors; // cancel

  const handleBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (btnType === "delete") {
      setShowModal(true);
    } else {
      actionToDo?.();
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <button
        className={`${baseBtn} ${colorByType}`}
        onClick={handleBtnClicked}
        type="button"
        disabled={disabled}
      >
        {btnContent}
      </button>

      {btnType === "delete" && showModal && (
        <ModalComponent
          closeModal={handleCloseModal}
          actionToDo={actionToDo}
          targetLabel={targetLabel}
        />
      )}
    </>
  );
}

export default GeneralBtn;
