import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  subscribeToContacts,
  updateContactStatus,
} from "../redux/slices/contactsSlice";
import ContactList from "../components/contact/ContactList";
import { ContactListSkeleton } from "../components/contact/ContactListSkeleton";
import ExportButton from "../components/UI/ExportReportButton";
import { exportContactReport } from "../lib/exportContactReport";
import type { AppDispatch } from "../redux/store";


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
    status: "new" | "read" | "replied"
  ) => {
    dispatch(updateContactStatus({ id, status }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
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

      <ContactList contacts={contacts} onUpdateStatus={handleUpdateStatus} loading ={loading}/>

    
    </div>
  );
};

export default Contact;
