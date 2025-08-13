
interface CancleBtnProps{
    onCLick: ()=>void;
    disabled?:boolean;
}


function CancleBtn({onCLick,disabled} : CancleBtnProps) {
  return (
    <button
        type="button"
        onClick={onCLick}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        disabled={disabled}
    >
        Cancel
    </button>  )
}

export default CancleBtn