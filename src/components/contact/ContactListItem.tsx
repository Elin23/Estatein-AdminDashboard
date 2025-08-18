import React, { memo, useMemo, useState } from "react"
import { CheckCircle, Mail } from "lucide-react"
import type { ContactType } from "../../types"
import EmailReplyModalUI from "../EmailForm/EmailReplyModalUI"
import { composeContactEmailMessage } from "../EmailForm/composeEmailMessage"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../redux/store"
import {
  sendEmail,
  resetEmailState,
  selectEmailSending,
  selectEmailError,
  selectEmailSuccess,
} from "../../redux/slices/emailSlice"

interface ContactListItemProps {
  contact: ContactType
  onUpdateStatus: (id: string, status: ContactType["status"]) => void
}

const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  onUpdateStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const sending = useSelector(selectEmailSending)
  const sendError = useSelector(selectEmailError)
  const sendSuccess = useSelector(selectEmailSuccess)

  const statusColors: Record<ContactType["status"], string> = {
    new: "bg-red-100 text-red-800",
    read: "bg-green-100 text-green-800",
    approved: "bg-green-100 text-green-800",
    replied: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    reviewed: "bg-yellow-100 text-yellow-800",
  }

  const firstName = useMemo(() => {
    const n = (contact.name || "").trim()
    return n ? n.split(" ")[0] : ""
  }, [contact.name])

  const { subject: defaultSubject, message: defaultMessage } = useMemo(
    () => composeContactEmailMessage(contact),
    [contact]
  )

  const handleSendEmail = async ({
    to,
    subject,
    message,
  }: {
    to: string
    subject: string
    message: string
  }) => {
    const finalSubject = subject?.trim() || defaultSubject
    const finalMessage = message?.trim() || defaultMessage

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
      ).unwrap()

      onUpdateStatus(contact.id, "replied")
      setIsModalOpen(false)
      dispatch(resetEmailState())
    } catch (e) {
      console.error(e)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    dispatch(resetEmailState())
  }

  return (
    <div className="flex flex-col justify-between gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <div className="flex flex-col lg-custom:flex-row justify-between gap-3 flex-wrap">
        <h3 className="text-xl font-medium text-black dark:text-white95">
          {contact.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium text-center ${
            statusColors[contact.status]
          }`}
        >
          {contact.status}
        </span>
      </div>
      <p className="text-black dark:text-white95 break-words">
        {contact.email}
      </p>

      <div>
        <h4 className="text-lg font-medium text-black dark:text-white95">
          Subject
        </h4>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {contact.subject}
        </p>
      </div>
      <div>
        <h4 className="text-lg font-medium text-black dark:text-white95">
          Message
        </h4>
        <p className="mt-1 text-gray-600 dark:text-gray-400 break-words">
          {contact.message}
        </p>
      </div>
      <div className="flex flex-col lg-custom:flex-row flex-wrap  gap-4 pt-2">
        {contact.status === "new" && (
          <button
            onClick={() => onUpdateStatus(contact.id, "read")}
            className="flex justify-center items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" /> Mark as Read
          </button>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex justify-center items-center gap-1 px-3 py-1 bg-purple65 hover:bg-purple60 text-white rounded-md transition-colors text-sm cursor-pointer"
        >
          <Mail className="w-4 h-4" /> Send Email
        </button>

        {contact.status !== "replied" && (
          <button
            onClick={() => onUpdateStatus(contact.id, "replied")}
            className="flex justify-center items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm cursor-pointer"
            disabled={sending}
          >
            <CheckCircle className="w-4 h-4" /> Mark as Replied
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Received on {contact.createdAt.toLocaleDateString()}
      </p>

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
  )
}

export default memo(ContactListItem)
