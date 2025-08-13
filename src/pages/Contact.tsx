import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebaseConfig";

import ContactList from "../components/contact/ContactList";
import type { ContactType } from "../types";
import { ContactListSkeleton } from "../components/contact/ContactListSkeleton";

const Contact = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const contactsRef = ref(db, "forms/contact");

    const unsubscribe = onValue(
      contactsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list: ContactType[] = Object.entries(data).map(([id, value]) => {
            const val = value as any;
            return {
              id,
              name: `${val.firstName ?? ""} ${val.lastName ?? ""}`.trim(),
              email: val.email ?? "",
              subject: val.inquiryType || "No Subject",
              message: val.message || "No Message",
              createdAt: val.createdAt ? new Date(val.createdAt) : new Date(),
              status: (val.status as ContactType["status"]) || "new",
            };
          });

          list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          setContacts(list);
        } else {
          setContacts([]);
        }
        setLoading(false);
      },
      () => {
        setContacts([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1430px] mx-auto mt-18">
        <ContactListSkeleton count={6} />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Contact Requests
        </h1>
        <div>No contacts found.</div>
      </div>
    );
  }

  const handleUpdateStatus = async (id: string, status: ContactType["status"]) => {
    setContacts((prev) =>
      prev.map((contact) => (contact.id === id ? { ...contact, status } : contact))
    );

    try {
      await update(ref(db, `forms/contact/${id}`), { status });
    } catch (e) {
      console.error("Failed to update status in DB", e);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Contact Requests
      </h1>

      <ContactList contacts={contacts} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
};

export default Contact;
