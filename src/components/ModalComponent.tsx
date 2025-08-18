import { createPortal } from "react-dom"

type ModalComponentProps = {
  closeModal?: () => void;
  actionToDo: ((data?: any, id?: string) => void) | undefined;
  /** مثال: "user" | "property" | "team" | "newsletter subscription" */
  targetLabel?: string;
};

function ModalComponent({ actionToDo, closeModal, targetLabel }: ModalComponentProps) {
  const executeAction = () => {
    if (actionToDo) {
      actionToDo();
      console.log("action implemented");
    }
    closeModal?.();
  };

  const confirmStyle =
    "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500";

  const accentBar = "from-red-400/80 via-red-500 to-red-600";

  const message = targetLabel?.trim()
    ? `Are you sure you want to delete this ${targetLabel}?`
    : "Are you sure you want to delete?";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px]"
      onClick={closeModal}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-3xl shadow-[0_12px_50px_rgba(0,0,0,0.35)]
                   ring-1 ring-black/5 dark:ring-white/10
                   bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
                   overflow-hidden transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* شريط علوي أحمر */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${accentBar}`} />

        <div className="px-6 py-6 md:px-8 md:py-8">
          {/* أيقونة تحذير */}
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl
                          bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200/60 dark:ring-gray-700/60">
            <span className="text-lg font-bold text-gray-700 dark:text-gray-200">!</span>
          </div>

          <p
            id="modal-title"
            className="text-center text-2xl md:text-3xl font-semibold tracking-tight
                       text-gray-900 dark:text-gray-100"
          >
            {message}
          </p>

          <p className="mt-3 text-center text-sm md:text-base text-gray-600 dark:text-gray-300">
            This action may affect your data and cannot be easily undone.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 md:gap-4">
            <button
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm md:text-base font-medium
                         text-gray-700 bg-white/90 hover:bg-white
                         ring-1 ring-inset ring-gray-300
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400
                         dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:ring-gray-700 dark:focus-visible:ring-gray-600"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm md:text-base font-medium text-white
                          shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${confirmStyle}`}
              onClick={executeAction}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ModalComponent;
