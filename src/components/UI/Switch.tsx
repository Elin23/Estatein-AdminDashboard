import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../../redux/slices/themeSlice"
import type { RootState } from "../../redux/store"
import MoonIcon from "../icons/MoonIcon"
import SunIcon from "../icons/SunIcon"

const Switch = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.theme)
  const checked = theme === "light"

  const handleToggle = () => {
    dispatch(toggleTheme())
  }

  return (
    <label className="relative size-6 md:size-10 bg-white dark:bg-gray-900 shadow-[0_0_30px_10px_rgba(0,0,0,0.05)] rounded-full grid place-items-center cursor-pointer transition-all duration-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        className="hidden"
      />

      {/* Moon */}
      <div
        className={`absolute transition-transform duration-500 grid place-items-center ${
          checked ? "rotate-[360deg] scale-0" : "delay-200 scale-100"
        }`}
      >
        <MoonIcon className="md:size-5 size-3 text-gray15 dark:text-white" />
      </div>

      {/* Sun */}
      <div
        className={`absolute transition-transform duration-500 grid place-items-center ${
          checked ? "scale-100 rotate-[360deg]" : "delay-200 scale-0"
        }`}
      >
        <SunIcon className="md:size-5 size-3 text-yellow-600" />
      </div>
    </label>
  )
}

export default Switch
