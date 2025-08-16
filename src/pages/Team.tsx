import { useEffect, useState } from "react";
import TeamForm from "../components/Team/TeamForm";
import GenericCard from "../components/GenericCard/GenericCard";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { exportTeamReport } from "../lib/exportTeamReport";
import ExportButton from "../components/UI/ExportReportButton";
import Pagination from "../components/UI/Pagination";
import {
  subscribeTeam,
  addOrUpdateMember,
  deleteMember,
} from "../redux/slices/teamSlice";
import type { TeamMember } from "../types/index";

export default function Team() {
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: RootState) => state.auth.role) || "";
  const members = useSelector((state: RootState) => state.team.members);
  const loading = useSelector((state: RootState) => state.team.loading);
  const error = useSelector((state: RootState) => state.team.error);

  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(subscribeTeam());
  }, [dispatch]);

  const handleSave = async (
    memberData: Omit<TeamMember, "id">,
    id?: string
  ) => {
    await dispatch(addOrUpdateMember({ memberData, id }));
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      await dispatch(deleteMember(id));
    }
  };

  return (
    <div className="p-6 huge:max-w-[1390px] huge:mx-auto">
      <div className="flex flex-col lg-custom:flex-row justify-between  mb-4 ">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Our Team
        </h1>

        <div className="flex flex-col  lg-custom:flex-row lg-custom:items-center gap-3">
          <ExportButton
            data={members}
            onExport={exportTeamReport}
            buttonLabel="Export to Excel"
            disabled={members.length === 0}
          />

          {role === "admin" && (
            <button
              className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors
              ring-2 ring-blue-600  ring-offset-2     ring-offset-white dark:ring-offset-gray-900
                  disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
            >
              + Add Member
            </button>
          )}


        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {showForm ? (
        <TeamForm
          initialData={editing ?? undefined}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSubmit={handleSave}
        />
      ) : (
        <Pagination
          items={members}
          renderItem={(member) => (
            <GenericCard
              key={member.id}
              title={member.name}
              subtitle={member.role}
              imageSrc={member.clientImage}
              imageAlt={member.name}
              twitterLink={member.twitterLink}
              onEdit={() => {
                setEditing(member);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(member.id)}
              hasImage={true}
            />
          )}
          loading={loading}
        />
      )}
    </div>
  );
}
