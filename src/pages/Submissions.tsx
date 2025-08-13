import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  subscribeToSubmissions,
  changeSubmissionStatus,
} from "../redux/slices/submissionsSlice";
import SubmissionFilters from "../components/submissions/SubmissionFilters";
import ExportButton from "../components/UI/ExportReportButton";
import { exportSubmissionsToExcel } from "../lib/exportSubmissions";
import Pagination from "../components/UI/Pagination";
import SubmissionCard from "../components/submissions/SubmissionCard";
import type { ExtendedStatus } from "../redux/slices/submissionsSlice";

const Submissions = () => {
  const dispatch = useDispatch<AppDispatch>();

  const submissions = useSelector(
    (state: RootState) => state.submissions.items
  );
  const loading = useSelector((state: RootState) => state.submissions.loading);

  const [selectedStatus, setSelectedStatus] = useState<ExtendedStatus | "all">(
    "all"
  );
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(subscribeToSubmissions());
  }, [dispatch]);

  const categories = useMemo(
    () => Array.from(new Set(submissions.map((s) => s.category))),
    [submissions]
  );
  const filteredSubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) =>
          (selectedStatus === "all" || submission.status === selectedStatus) &&
          (!selectedCategory || submission.category === selectedCategory)
      ),
    [submissions, selectedStatus, selectedCategory]
  );
  const handleUpdateStatus = (id: string, status: ExtendedStatus) => {
    dispatch(changeSubmissionStatus({ id, status }));
  };
  return (
    <div className="p-6 huge:max-w-[1390px] huge:mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Form Submissions
        </h1>

        <ExportButton
          data={filteredSubmissions}
          onExport={exportSubmissionsToExcel}
          buttonLabel="Export to Excel"
          disabled={filteredSubmissions.length === 0}
        />
      </div>

      <SubmissionFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />

      <Pagination
        items={filteredSubmissions}
        renderItem={(item) => (
          <SubmissionCard
            key={item.id}
            submission={item}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        loading={loading}
      />

    </div>
  );
};

export default Submissions;
