import React, { useMemo, useState } from "react";
import { Check, Reply, ChevronDown, ChevronUp } from "lucide-react";
import type { ContactType } from "../../types";
import EmailReplyModalUI from "../EmailForm/EmailReplyModalUI";
import { composeContactEmailMessage } from "../EmailForm/composeEmailMessage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import {
  sendEmail,
  resetEmailState,
  selectEmailSending,
  selectEmailError,
  selectEmailSuccess,
} from "../../redux/slices/emailSlice";

interface ContactListItemProps {
  contact: ContactType;
  onUpdateStatus: (id: string, status: ContactType["status"]) => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  onUpdateStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const sending = useSelector(selectEmailSending);
  const sendError = useSelector(selectEmailError);
  const sendSuccess = useSelector(selectEmailSuccess);

  const statusColors: Record<ContactType["status"], string> = {
    new: "bg-blue-100 text-blue-800",
    read: "bg-gray-100 text-gray-800",
    replied: "bg-green-100 text-green-800",
  };

  const firstName = useMemo(() => {
    const n = (contact.name || "").trim();
    return n ? n.split(" ")[0] : "";
  }, [contact.name]);

  const { subject: defaultSubject, message: defaultMessage } = useMemo(
    () => composeContactEmailMessage(contact),
    [contact]
  );

  const handleSendEmail = async ({
    to,
    subject,
    message,
  }: {
    to: string;
    subject: string;
    message: string;
  }) => {
    const finalSubject = subject?.trim() || defaultSubject;
    const finalMessage = message?.trim() || defaultMessage;

    try {
      await dispatch(
        sendEmail({
          to,
          subject: finalSubject,
          message: finalMessage,
          meta: {
            customer_name: firstName || "there",
            form_name: "Contact Form",
            category: contact.subject || "General",
          },
        })
      ).unwrap();

      onUpdateStatus(contact.id, "replied");
      setIsModalOpen(false);
      dispatch(resetEmailState());
    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(resetEmailState());
  };

  return (
    <div className="border-l-4 dark:border-white95 px-3.5 lg-custom:px-5 py-3 rounded-r-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex justify-between gap-3 flex-wrap">
        <h3 className="font-medium text-black dark:text-white95">
          {contact.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[contact.status]
          }`}
        >
          {contact.status}
        </span>
      </div>

      <div className="flex justify-between items-start mt-4">
        <div>
          <p className="text-sm text-black dark:text-white95">
            {contact.email}
          </p>
          <p className="text-sm text-black dark:text-white95 mt-1">
            Received on {contact.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[1000px] mt-4" : "max-h-0"
        }`}
      >
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-black dark:text-white95">
              Subject
            </h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {contact.subject}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-black dark:text-white95">
              Message
            </h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {contact.message}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {contact.status === "new" && (
              <button
                onClick={() => onUpdateStatus(contact.id, "read")}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Check className="w-4 h-4" /> Mark as Read
              </button>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
            >
              <Reply className="w-4 h-4" /> Reply by Email
            </button>

            {contact.status !== "replied" && (
              <button
                onClick={() => onUpdateStatus(contact.id, "replied")}
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                disabled={sending}
              >
                <Check className="w-4 h-4" /> Mark as Replied
              </button>
            )}
          </div>
        </div>
      </div>

      <EmailReplyModalUI
        open={isModalOpen}
        onClose={closeModal}
        title="Send an Email to the client"
        onSubmit={handleSendEmail}
        loading={sending}
        error={sendError}
        success={sendSuccess}
        defaultEmail={contact.email}
        defaultSubject={defaultSubject}
        defaultMessage={defaultMessage}
      />
    </div>
  );
};

export default ContactListItem;
