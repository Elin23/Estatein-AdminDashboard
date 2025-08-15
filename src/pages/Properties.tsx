import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Building2 } from "lucide-react"
import PropertyForm from "../components/PropertyForm"
import ExportButton from "../components/UI/ExportReportButton"
import Pagination from "../components/UI/Pagination"
import { exportProperties } from "../lib/exportProperties"
import type { Property, PropertyFormData } from "../types"
import type { RootState, AppDispatch } from "../redux/store"
import {
  subscribeToProperties,
  addProperty,
  deleteProperty,
  editProperty,
} from "../redux/slices/propertiesSlice"
import PropertiesCard from "../components/Properties/PropertiesCard"

const Properties = () => {
  const dispatch = useDispatch<AppDispatch>()

  const role = useSelector((state: RootState) => state.auth.role) || ""
  const { list: properties, loading } = useSelector(
    (state: RootState) => state.properties
  )

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [propBeingEdited, setPropertyBeingEdited] = useState<Property | null>(
    null
  )

  const locations = ["Hubli", "Dharwad", "Belgaum", "Mysore", "Bangalore"]

  const handleAddProperty = async (
    propertyData: Omit<Property, "id" | "createdAt">
  ) => {
    await dispatch(addProperty(propertyData))
    setShowForm(false)
  }

  const handleDeleteProperty = useCallback(async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      await dispatch(deleteProperty(id))
    }
  }, [])

  const startEditProperty = (property: Property) => {
    setShowForm(true)
    setPropertyBeingEdited(property)
    setEditing(true)
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const saveEditedProperty = async (
    id: string,
    propertyData: PropertyFormData
  ) => {
    await dispatch(editProperty({ id, propertyData }))
    setEditing(false)
    setShowForm(false)
  }

  useEffect(() => {
    dispatch(subscribeToProperties())
  }, [dispatch])

  return (
    <div className="p-6 huge:max-w-[1390px] huge:mx-auto">
      <div className="flex flex-col  lg:flex-row lg:items-center lg:justify-between mb-6 gap-4 lg:gap-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Properties
        </h1>
        <div className="flex flex-col  sm:flex-row sm:items-center gap-3">
          <ExportButton
            data={properties}
            fileName={`properties_report_${new Date()
              .toISOString()
              .slice(0, 10)}.xlsx`}
            getSheetName={() => "Properties"}
            mapData={exportProperties}
            buttonLabel="Export to Excel"
            disabled={properties.length === 0}
          />
          {(role === "admin" || role === "sales") && (
            <button
              onClick={() => {
                setEditing(false)
                setShowForm(!showForm)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Cancel" : "Add New Property"}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <PropertyForm
            onSubmit={handleAddProperty}
            locations={locations}
            isloading={loading}
            editing={editing}
            setEditing={setEditing}
            propertyBeingEdited={propBeingEdited}
            onEdit={saveEditedProperty}
          />
        </div>
      )}

      {loading ? (
        <div className="w-full h-full text-4xl text-center flex justify-center bg-blue-700 p-10 text-white">
          loading...
        </div>
      ) : (
        <Pagination
          items={properties}
          loading={loading}
          renderItem={(property) => (
            <PropertiesCard
              property={property}
              handleDeleteProperty={() => handleDeleteProperty(property.id)}
              startEditProperty={() => startEditProperty(property)}
            />
          )}
        />
      )}

      {properties.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No properties yet</h3>
          <p className="mt-1 text-gray-500">
            Get started by adding a new property.
          </p>
        </div>
      )}
    </div>
  )
}

export default Properties
