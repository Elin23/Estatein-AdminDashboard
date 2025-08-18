import { useState, useEffect, useCallback, useRef } from "react";
import Modal from "../components/UI/Modal";
import TablePortal from "../components/TablePortal";
import {
  subscribeToUsers,
  createUser,
  deleteUser,
  cleanupSubscription,
  type User,
} from "../redux/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../hooks/useAppSelector";

const UserManagement = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const tableAnchorRef = useRef<HTMLDivElement | null>(null);

  const baseBtn =
    "inline-flex items-center justify-center rounded-xl px-3 md:px-4 py-1.5 md:py-2 " +
    "text-[10px] md:text-sm font-medium transition-transform duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm";
  const deleteColors =
    "text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 " +
    "focus-visible:ring-red-500 ring-1 ring-red-500/40 " +
    "hover:shadow-[0_8px_20px_rgba(220,38,38,0.35)]";
  const updateColors =
    "text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 " +
    "focus-visible:ring-indigo-500 ring-1 ring-indigo-500/40 " +
    "hover:shadow-[0_8px_20px_rgba(79,70,229,0.35)]";

  useEffect(() => {
    dispatch(subscribeToUsers());
    return () => {
      dispatch(cleanupSubscription());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setMessage(`${error}`);
    }
  }, [error]);

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Email is required");
      return;
    }

    try {
      if (editingUid) {
        await dispatch(
          createUser({
            email,
            role,
            uid: editingUid,
          })
        ).unwrap();
        setMessage("User updated successfully!");
        setEditingUid(null);
      } else {
        if (!password) {
          setMessage("Password is required for new users");
          return;
        }
        await dispatch(
          createUser({
            email,
            password,
            role,
          })
        ).unwrap();
        setMessage("User created successfully!");
      }

      setEmail("");
      setPassword("");
      setRole("admin");
      setShowForm(false);
    } catch (err: any) {
      setMessage(`Error: ${err}`);
    }
  };

  const handleDeleteClick = useCallback((uid: string) => {
    setUserToDelete(uid);
    setModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!userToDelete) return;
    dispatch(deleteUser(userToDelete));
    setMessage("User deleted successfully!");
    setModalOpen(false);
    setUserToDelete(null);
  }, [userToDelete, dispatch]);

  const handleEditUser = (user: User) => {
    setEmail(user.email);
    setRole(user.role);
    setEditingUid(user.uid);
    setShowForm(true);
    setMessage("");
  };

  return (
    <div className="p-6 max-w-[1430px] mx-auto">
      <div className="flex flex-col lg-custom:flex-row justify-between lg-custom:items-center gap-5 flex-wrap mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">User Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingUid(null);
            setEmail("");
            setPassword("");
            setRole("admin");
            setMessage("");
          }}
          className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors
            ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-offset-gray-900
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
            disabled={loading}
          >
            {loading ? "Saving..." : editingUid ? "Update User" : "Create User"}
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
                      {users.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-2xl text-black dark:text-white95 text-center p-4"
                          >
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr
                            key={user.uid}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="text-black dark:text-white99 border dark:border-white99 border-gray15 p-3.5">
                              {user.email}
                            </td>
                            <td className="text-black dark:text-white99 border dark:border-white99 border-gray15 p-3.5">
                              {user.role}
                            </td>
                            <td className="border dark:border-white99 border-gray15 p-3.5">
                              <div className="flex justify-center items-center gap-1.5 flex-wrap">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className={`${baseBtn} ${updateColors}`}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(user.uid)}
                                  className={`${baseBtn} ${deleteColors}`}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
  );
};

export default UserManagement;