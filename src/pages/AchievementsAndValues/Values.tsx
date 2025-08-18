import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import type { ValueItem } from "../../types/ValueItem";
import ValueForm from "../../components/Values/ValuesForm";
import {
  subscribeToValues,
  addValue,
  updateValue,
  deleteValue,
} from "../../redux/slices/valuesSlice";
import CrudSection from "../../components/CrudSection";
import GenericCard from "../../components/GenericCard/GenericCard";

function Values() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  return (
    <CrudSection<ValueItem>
      title="Values"
      addBtnText="+ Add Value"
      role={role}
      selectList={(state) => state.values.items}
      selectLoading={(state) => state.values.loading}
      selectError={(state) => state.values.error}
      subscribeAction={subscribeToValues}
      addAction={addValue}
      updateAction={updateValue}
      deleteAction={deleteValue}
      FormComponent={ValueForm}
      renderItem={(item, { onEdit, onDelete }) => (
        <GenericCard
          key={item.id}
          title={item.title}
          description={item.description}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}
export default Values;
