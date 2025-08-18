import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import StepForm from "../components/Steps/StepForm";
import type { Step } from "../types/Steps"; 
import {
  subscribeToSteps,
  addStep,
  updateStep,
  deleteStep,
} from "../redux/slices/stepsSlice";
import CrudSection from "../components/CrudSection";
import GenericCard from "../components/GenericCard/GenericCard";

function Steps() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  return (
    <CrudSection<Step>
      title="Steps"
      addBtnText="+ Add Step"
      role={role}
      selectList={(state) => state.steps.list}
      selectLoading={(state) => state.steps.loading}
      selectError={(state) => state.steps.error}
      subscribeAction={subscribeToSteps}
      addAction={addStep}
      updateAction={updateStep}
      deleteAction={deleteStep}
      FormComponent={StepForm}
      renderItem={(step, { onEdit, onDelete }) => (
        <GenericCard
          key={step.id}
          title={`${step.stepNum}. ${step.title}`}
          description={step.description}
          onEdit={onEdit}
          onDelete={onDelete}
          hasImage={true}
        />
        )}
    />
  );
}
export default Steps;