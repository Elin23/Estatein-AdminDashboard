import { useState, useMemo, useEffect } from "react";
import SubmissionCard from "../components/submissions/SubmissionCard";
import SubmissionFilters from "../components/submissions/SubmissionFilters";
import type { FormSubmission } from "../types";
import { onValue, ref, update } from "firebase/database";
import { db } from "../firebaseConfig";

type SubmissionWithType = FormSubmission & {
  formType: "contact" | "inquiry" | "property";
};

const Submissions = () => {
  const [submissions, setSubmissions] = useState<SubmissionWithType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    FormSubmission["status"] | "all"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "forms"), (snapshot) => {
      const val = snapshot.val() || {};
      const items: SubmissionWithType[] = Object.entries(val).flatMap(
        ([formType, byId]: any) => {
          if (!byId) return [];
          return Object.entries(byId).map(([id, payload]: [string, any]) => {
            const ts = payload.createdAt;
            const dateMs = typeof ts === "number" ? ts : Date.now();
            const formName =
              formType === "contact"
                ? "Contact Form"
                : formType === "inquiry"
                ? "Inquiry Form"
                : "Property Form";

            const category =
              payload.propertyType || payload.inquiryType || "General";

            const status: FormSubmission["status"] =
              payload.status || "pending";
            const data: Record<string, string> = {
              firstName: payload.firstName ?? "",
              lastName: payload.lastName ?? "",
              email: payload.email ?? "",
              phone: payload.phone ?? "",
              location: payload.location ?? "",
              propertyType: payload.propertyType ?? "",
              bedrooms: payload.bedrooms ?? "",
              bathrooms: payload.bathrooms ?? "",
              budget: payload.budget ?? "",
              message: payload.message ?? "",
            };

            return {
              id,
              formId: id,
              formName,
              category,
              submittedAt: new Date(dateMs),
              status,
              data,
              formType: formType as SubmissionWithType["formType"],
            };
          });
        }
      );

      items.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
      setSubmissions(items);
    });

    return () => unsubscribe();
  }, []);

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

  const handleUpdateStatus = async (
    id: string,
    status: FormSubmission["status"]
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status } : sub))
    );

    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;

    try {
      await update(ref(db, `forms/${sub.formType}/${id}`), { status });
    } catch (error) {}
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Form Submissions
        </h1>
      </div>

      <SubmissionFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubmissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No submissions found matching the selected filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Submissions;
