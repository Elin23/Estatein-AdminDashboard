import React from "react";
import { Mail } from "lucide-react";
import type { ContactType } from "../../types";
import ContactListItem from "./ContactListItem";
import Pagination from "../UI/Pagination";

interface ContactListProps {
  contacts: ContactType[];
  onUpdateStatus: (id: string, status: ContactType["status"]) => void;
  loading: boolean
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onUpdateStatus,
  loading
}) => {
  if (!loading && contacts.length === 0) {
    return (
        <p className="text-gray-500 dark:text-gray-400">
          No contact requests yet
        </p>
    );
  }

  return (
    // <div className="max-w-4xl mx-auto space-y-4">
    <div className="mx-auto space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Contact Requests
      </h2>

      <Pagination
        items={contacts}
        renderItem={(item: ContactType) => (
          <ContactListItem
            key={item.id}
            contact={item}
            onUpdateStatus={onUpdateStatus}
          />

        )}
        loading={loading}
      />
    </div>
  );
};

export default ContactList;
