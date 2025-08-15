import React from "react";
import type { ContactType } from "../../types";
import ContactListItem from "./ContactListItem";
import Pagination from "../UI/Pagination";

interface ContactListProps {
  contacts: ContactType[];
  onUpdateStatus: (id: string, status: ContactType["status"]) => void;
  loading: boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onUpdateStatus,
  loading,
}) => {
  if (!loading && contacts.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        No contact requests yet
      </p>
    );
  }

  return (
    <div>
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
