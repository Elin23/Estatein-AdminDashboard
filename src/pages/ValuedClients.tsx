// pages/ValuedClients.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { ValuedClient } from "../types/ValuedClient";
import ValuedClientsForm from "../components/ValuedClients/ValuedClientsForm";
import ValuedClientCard from "../components/ValuedClients/ValuedClientCard";
import CrudSection from "../components/CrudSection";

import {
  subscribeToClients,
  addClient,
  updateClient,
  deleteClient,
} from "../redux/slices/ClientsSlice";

function ValuedClients() {
  const role = useSelector((state: RootState) => state.auth.role) || "";

  return (
    <CrudSection<ValuedClient>
      title="Valued Clients"
      addBtnText="+ Add Valued Client"
      role={role}
      selectList={(state) => state.clients.items}
      selectLoading={(state) => state.clients.loading}
      selectError={(state) => state.clients.error}
      subscribeAction={subscribeToClients}
      addAction={addClient}
      updateAction={(payload) => updateClient(payload)}
      deleteAction={deleteClient}
      FormComponent={ValuedClientsForm}
      renderItem={(client, { onEdit, onDelete }) => (
        <ValuedClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}

export default ValuedClients;