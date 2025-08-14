import type { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom"



type ModalComponentProps = {
    closeModal?: () =>void;
    modalType : "delete" | "update" | "add";
    actionToDo: ((data?: any,id?:string) => void) | undefined;
}

function ModalComponent({actionToDo,closeModal,modalType} : ModalComponentProps) {

    const executeAction = ()=>{
        if(actionToDo){
            actionToDo();
            console.log('action implemented')
        }
        closeModal?.();
    }
    const deleteStyle : string = "bg-red-600 rounded-lg text-white px-5 py-2";
  return createPortal(
    <div 
    className="fixed h-screen z-50 inset-0 bg-purple60/30 dark:bg-purple99/10 backdrop-blur-sm flex justify-center overflow-y-auto items-start lg-custom:items-center"
    onClick={closeModal}    
        >
        <div 
        className="modal_content rounded-xl border border-purple60 bg-purple75 my-8 p-6 w-max h-max overflow-y-auto
        flex items-center justify-center text-center"
        onClick={(e)=>e.stopPropagation()}
        >
        <div className="flex flex-col gap-8">
            <p className="text-xl lg-custom:text-3xl huge:text-4xl text-black dark:text-white font-semibold ">
                {modalType == 'delete' ? "Are you sure you want to delete item?" :
                 modalType == 'add' ? "Are you sure you wany to add item?" :
                 "You want Update?"}
            </p>
            <div>
                <div className="flex items-center w-full justify-center gap-9">
                    <button className="bg-purple70 rounded-lg text-white px-5 py-2 text-base lg-custom:text-lg font-medium cursor-pointer" onClick={closeModal}>
                        Cancel
                    </button>                            
                    <button 
                    className={`${modalType == 'delete' ? deleteStyle : "bg-purple60 rounded-lg text-white px-5 py-2"} text-base lg-custom:text-lg font-medium cursor-pointer`}
                    onClick={executeAction}
                    >
                        {modalType == 'delete' ? "Delete" : modalType =="add" ? "Add" : "Update"}
                    </button>
                </div>                
            </div>
        </div>
        </div>
    </div>
    ,
    document.body
  )
}

export default ModalComponent