import { useState, useEffect, useCallback, useRef } from "react"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  update,
} from "firebase/database"
import Modal from "../components/UI/Modal"
import TablePortal from "../components/TablePortal"

const UserManagement = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [message, setMessage] = useState("")
  const [users, setUsers] = useState<
    { uid: string; email: string; role: string }[]
  >([])
  const [showForm, setShowForm] = useState(false)
  const [editingUid, setEditingUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const auth = getAuth()
  const db = getDatabase()
  const tableAnchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const usersRef = ref(db, "users")
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const userList = Object.entries(data).map(([uid, val]: any) => ({
          uid,
          email: val.email,
          role: val.role,
        }))
        setUsers(userList)
      } else {
        setUsers([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [db])

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    try {
      if (editingUid) {
        await update(ref(db, `users/${editingUid}`), { role })
        setMessage("✅ User updated successfully!")
        setEditingUid(null)
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        const uid = userCredential.user.uid
        await set(ref(db, `users/${uid}`), {
          email,
          role,
        })
        setMessage("✅ User created successfully!")
      }

      setEmail("")
      setPassword("")
      setRole("admin")
      setShowForm(false)
    } catch (error: any) {
      console.error(error)
      setMessage("❌ Error: " + error.message)
    }
  }

  const handleDeleteUser = async (uid: string) => {
    try {
      await remove(ref(db, `users/${uid}`))
      setMessage("✅ User deleted from database!")
    } catch (error: any) {
      console.error(error)
      setMessage("❌ Error deleting user: " + error.message)
    }
  }

  const handleDeleteClick = useCallback((id: string) => {
    setUserToDelete(id)
    setModalOpen(true)
  }, [])

  const confirmDelete = useCallback(() => {
    if (!userToDelete) return
    handleDeleteUser(userToDelete)
    setModalOpen(false)
    setUserToDelete(null)
  }, [userToDelete, handleDeleteUser])

  const handleEditUser = (user: {
    uid: string
    email: string
    role: string
  }) => {
    setEmail(user.email)
    setRole(user.role)
    setEditingUid(user.uid)
    setShowForm(true)
  }

  return (
    <div className="p-6 max-w-[1430px] mx-auto">
      <div className="flex flex-col lg-custom:flex-row justify-between lg-custom:items-center gap-5 flex-wrap mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          User Management
        </h2>

        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingUid(null)
            setEmail("")
            setPassword("")
            setRole("admin")
            setMessage("")
          }}
          className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors
              ring-2 ring-blue-600  ring-offset-2     ring-offset-white dark:ring-offset-gray-900
                  disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleCreateOrUpdateUser}
          className="mb-6 space-y-4 p-4 rounded border border-gray15 dark:border-white95"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={!!editingUid}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-purple65 p-2 text-black dark:text-white95 rounded border border-gray15 dark:border-white95"
            required
          />

          {!editingUid && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-purple65 p-2 border text-black dark:text-white95 border-gray15 dark:border-white95 rounded"
              required
            />
          )}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full outline-purple65 p-2 dark:bg-gray-800 text-black dark:text-white95 border border-gray15 dark:border-white95 rounded"
          >
            <option value="admin">Admin</option>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
          </select>

          <button
            type="submit"
            className="w-full font-medium text-lg py-2 rounded bg-purple70 text-white hover:bg-purple60 duration-300 cursor-pointer"
          >
            {editingUid ? "Update User" : "Create User"}
          </button>
        </form>
      ) : (
        <>
          {message && (
            <p className="mb-4 text-center font-semibold text-black dark:text-white95">
              {message}
            </p>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div ref={tableAnchorRef} className="w-full" />

              <TablePortal anchorRef={tableAnchorRef}>
                <div className="table-scroll-wrapper overflow-x-auto w-full border dark:border-white95 border-gray15 rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <table className="w-full min-w-[640px] divide-y divide-gray-200 dark:divide-gray-600">
                    <colgroup>
                      <col style={{ width: "40%" }} />
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "30%" }} />
                    </colgroup>

                    <thead>
                      <tr className="bg-white95 dark:bg-gray-900">
                        <th className="text-xl text-black dark:text-white border dark:border-white95 border-gray15 p-3.5">
                          Email
                        </th>
                        <th className="text-xl text-black dark:text-white border dark:border-white95 border-gray15 p-3.5">
                          Role
                        </th>
                        <th className="text-xl text-black dark:text-white border dark:border-white95 border-gray15 p-3.5">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-2xl text-black dark:text-white95 text-center p-4"
                          >
                            No users found.
                          </td>
                        </tr>
                      )}
                      {users.map(({ uid, email, role }) => (
                        <tr
                          key={uid}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="text-black dark:text-white99 border dark:border-white99 border-gray15 p-3.5">
                            {email}
                          </td>
                          <td className="text-black dark:text-white99 border dark:border-white99 border-gray15 p-3.5">
                            {role}
                          </td>
                          <td className="border dark:border-white99 border-gray15 p-3.5">
                            <div className="flex justify-center items-center gap-1.5 flex-wrap">
                              <button
                                onClick={() =>
                                  handleEditUser({ uid, email, role })
                                }
                                className="px-3 py-1 bg-purple70 text-white rounded hover:bg-purple60 duration-300 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(uid)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 duration-300 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TablePortal>
            </>
          )}
        </>
      )}

      <Modal
        title="Delete User"
        message="Delete this user? This action cannot be undone."
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

export default UserManagement
