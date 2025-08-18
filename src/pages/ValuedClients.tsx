import { useState, useEffect, useCallback } from "react"
import { db } from "../firebaseConfig"
import { ref, onValue, push, set, update, remove } from "firebase/database"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import ValuedClientsForm from "../components/ValuedClients/ValuedClientsForm"
import ValuedClientCard from "../components/ValuedClients/ValuedClientCard"
import type { ValuedClient } from "../types/ValuedClient"
import Modal from "../components/UI/Modal"

function ValuedClients() {
  const role = useSelector((state: RootState) => state.auth.role) || ""
  const [clients, setClients] = useState<ValuedClient[]>([])
  const [loading, setLoading] = useState(true)
  const [editingClient, setEditingClient] = useState<ValuedClient | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    await remove(ref(db, `clients/${id}`))
  }

  const handleDeleteClick = useCallback((id: string) => {
    setClientToDelete(id)
    setModalOpen(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (!clientToDelete) return
    handleDelete(clientToDelete)
    setModalOpen(false)
    setClientToDelete(null)
  }, [clientToDelete, handleDelete])

  useEffect(() => {
    const clientsRef = ref(db, "clients")
    const unsubscribe = onValue(clientsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, Omit<ValuedClient, "id">>
        const list: ValuedClient[] = Object.entries(data).map(
          ([id, value]) => ({
            id,
            ...value,
          })
        )
        setClients(list)
      } else {
        setClients([])
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleAdd = async (newClient: Omit<ValuedClient, "id">) => {
    const newRef = push(ref(db, "clients"))
    await set(newRef, newClient)
    setShowForm(false)
  }

  const handleUpdate = async (data: Omit<ValuedClient, "id">, id?: string) => {
    if (!id) return
    await update(ref(db, `clients/${id}`), data)
    setEditingClient(null)
    setShowForm(false)
  }

  const handleEditClick = (client: ValuedClient) => {
    setEditingClient(client)
    setShowForm(true)
  }

  const handleAddClick = () => {
    setEditingClient(null)
    setShowForm(true)
  }

  return (
    <div className="p-6">
      <div className="flex flex-col lg-custom:flex-row justify-between lg-custom:items-center flex-wrap mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className=" text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Valued Clients
        </h1>
        {role === "admin" && (
          <button
            className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors
              ring-2 ring-blue-600  ring-offset-2     ring-offset-white dark:ring-offset-gray-900
                  disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleAddClick}
          >
            + Add Valued Client
          </button>
        )}
      </div>

      {showForm && (
        <ValuedClientsForm
          onSubmit={editingClient ? handleUpdate : handleAdd}
          initialData={editingClient}
          onCancel={() => {
            setEditingClient(null)
            setShowForm(false)
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4  huge:max-w-[1390px] huge:mx-auto">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <ValuedClientCard key={idx} loading />
            ))
          : clients.map((client) => (
              <ValuedClientCard
                key={client.id}
                client={client}
                onEdit={() => handleEditClick(client)}
                onDelete={() => handleDeleteClick(client.id)}
              />
            ))}
      </div>
      <Modal
        title="Delete Client"
        message="Delete this client? This action cannot be undone."
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        showConfirm
      />
    </div>
  )
}

export default ValuedClients
