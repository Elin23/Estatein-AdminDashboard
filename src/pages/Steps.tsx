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
      renderTitle={(item) => `${item.stepNum}. ${item.title}`}
      renderDescription={(item) => item.description}
    />
  );
}
export default Steps;