import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  subscribeToContacts,
  updateContactStatus,
} from "../redux/slices/contactsSlice";
import ExportButton from "../components/UI/ExportReportButton";
import { exportContactReport } from "../lib/exportContactReport";
import type { AppDispatch } from "../redux/store";
import ContactList from "../components/contact/ContactList";

const Contact = () => {
  const dispatch: AppDispatch = useDispatch();
  const { list: contacts, loading } = useSelector(
    (state: RootState) => state.contacts
  );

  useEffect(() => {
    dispatch(subscribeToContacts());
  }, [dispatch]);

  const handleUpdateStatus = (
    id: string,
    status: "new" | "read" | "replied" | "rejected" | "reviewed" | "approved"
  ) => {
    dispatch(updateContactStatus({ id, status }));
  };

  const sortedContacts = useMemo(() => {
    return [...contacts].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [contacts]);

  return (
    <div className="p-6">
      <div className="flex flex-col lg-custom:flex-row justify-between lg-custom:items-center gap-5 flex-wrap mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white ">
          Contact Requests
        </h1>

        {contacts.length > 0 && (
          <ExportButton
            data={contacts}
            onExport={exportContactReport}
            buttonLabel="Export to Excel"
            disabled={contacts.length === 0}
          />
        )}
      </div>

      <ContactList
        contacts={sortedContacts}
        onUpdateStatus={handleUpdateStatus}
        loading={loading}
      />
    </div>
  );
};

export default Contact;
