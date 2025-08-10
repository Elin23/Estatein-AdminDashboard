import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebaseConfig";
import type { Contact } from "../types";
import ContactList from "../components/contact/ContactList";

const Contact = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const contactsRef = ref(db, "forms/contact");

    const unsubscribe = onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Contact[] = Object.entries(data).map(([id, value]) => {
          const val = value as any;
          // console.log(data);
          return {
            id,
            name: val.firstName + " " + val.lastName,
            email: val.email,
            subject: val.inquiryType || "No Subject",
            message: val.message || "No Message",
            createdAt: val.createdAt ? new Date(val.createdAt) : new Date(),
            status: val.status || "new",
          };
        });
        setContacts(list);
      } else {
        setContacts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="text-4xl text-center mt-32">Loading contacts...</div>
    );

  if (contacts.length === 0)
    return <div className="text-4xl text-center mt-32">No contacts found.</div>;

  const handleUpdateStatus = (id: string, status: Contact["status"]) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, status } : contact
      )
    );
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
