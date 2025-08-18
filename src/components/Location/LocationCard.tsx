import { useSelector } from "react-redux"
import type { LocationData } from "../../types/forms"
import { Mail, Phone, MapPin } from "lucide-react"
import type { RootState } from "../../redux/store"
import GeneralBtn from "../buttons/GeneralBtn"
interface LocationCardProps {
  data: LocationData
  onEdit: () => void
  onDelete: () => void
}
function LocationCard({ data, onEdit, onDelete }: LocationCardProps) {
  const role = useSelector((state: RootState) => state.auth.role) || ""

  return (
    <div className="bg-white dark:bg-gray-800 flex flex-col shadow-md rounded-2xl p-4 hover:shadow-lg transition w-full huge:max-w-[452px] h-full">
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-semibold text-purple60">{data.branch}</h3>
          <p className="text-gray-800 dark:text-white">{data.address}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-[#703BF7]/20 dark:bg-purple60/20 text-gray-800 dark:text-white text-xs rounded">
            {data.category}
          </span>
          <p className="mt-2 text-sm text-gray-800 dark:text-white">
            {data.details}
          </p>
          <div className="mt-3 border-t pt-2 text-sm items-start flex flex-col space-y-2">
            <p className="flex space-x-2 text-gray-800 dark:text-white items-center">
              <Mail /> <span>{data.email}</span>
            </p>
            <p className="flex space-x-2 text-gray-800 dark:text-white items-center">
              <Phone />
              <span>{data.phone}</span>
            </p>
            <p className="flex space-x-2 text-gray-800 dark:text-white items-center">
              <MapPin />
              <span>{data.city}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          {role === "admin" && (
            <>
        {onEdit && (
          <GeneralBtn
            btnContent="Edit"
            actionToDo={onEdit}
            btnType="update"
          />
        )}
              {onDelete && (
                <GeneralBtn
                  btnContent="Delete"
                  actionToDo={onDelete}
                  btnType="delete"
                  targetLabel={data.branch}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LocationCard
