import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { TeamMember } from "../types";
import TeamForm from "../components/Team/TeamForm";
import GenericCard from "../components/GenericCard/GenericCard";
import CrudSection from "../components/CrudSection";
import { exportTeamReport } from "../lib/exportTeamReport";
import {
  subscribeTeam,
  deleteMember,
  addMember,
  updateMember,
} from "../redux/slices/teamSlice";

function Team() {
  const role = useSelector((state: RootState) => state.auth.role) || "";
  return (
    <div className="p-6 huge:max-w-[1390px] huge:mx-auto">
      <CrudSection<TeamMember>
        title=""
        addBtnText="+ Add Member"
        role={role}
        selectList={(state) => state.team.members}
        selectLoading={(state) => state.team.loading}
        selectError={(state) => state.team.error}
        subscribeAction={subscribeTeam}
        exportReport={exportTeamReport}
        addAction={addMember}
        updateAction={updateMember}
        deleteAction={deleteMember}
        FormComponent={TeamForm}
        renderItem={(member, { onEdit, onDelete }) => (
          <GenericCard
            key={member.id}
            title={member.name}
            subtitle={member.role}
            imageSrc={member.clientImage}
            imageAlt={member.name}
            twitterLink={member.twitterLink}
            email={member.email}
            onEdit={onEdit}
            onDelete={onDelete}
            hasImage={true}
          />
        )}
      />
    </div>
  );
}

export default Team;