import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import LocationForm from "../../components/Location/LocationForm";
import LocationCard from "../../components/Location/LocationCard";
import CrudSection from "../../components/CrudSection";

import {
  subscribeToLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} from "../../redux/slices/locationSlice";
import { exportLocationsToExcel } from "../../lib/exportLocations";
import type { Location } from "../../types";

function Locations() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  return (
    <CrudSection<Location>
      title="Our Locations"
      addBtnText="+ Add Location"
      role={role}
      selectList={(state) => state.locations.items}
      selectLoading={(state) => state.locations.loading}
      selectError={(state) => state.locations.error}
      subscribeAction={subscribeToLocations}
      exportReport={exportLocationsToExcel}
      addAction={addLocation}
      updateAction={updateLocation}
      deleteAction={deleteLocation}
      FormComponent={LocationForm}
      renderItem={(location, { onEdit, onDelete }) => (
        <LocationCard
          key={location.id}
          data={location}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}

export default Locations;