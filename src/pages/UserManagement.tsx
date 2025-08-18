import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { cleanupSubscription, createUser, deleteUserAccount, subscribeToUsers, updateUserRole } from "../redux/slices/usersSlice";
import Modal from "../components/UI/Modal";


const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: users, loading, error } = useSelector((state: RootState) => state.users);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(subscribeToUsers());
    
    return () => {
      dispatch(cleanupSubscription());
    };
  }, [dispatch]);

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      let result: { success: boolean; message: string };
      
      if (editingUid) {
        result = await dispatch(updateUserRole({ uid: editingUid, role })).unwrap();
      } else {
        result = await dispatch(createUser({ email, password, role })).unwrap();
      }

      if (result.success) {
        setMessage(`${result.message}`);
        setEmail("");
        setPassword("");
        setRole("admin");
        setEditingUid(null);
        setShowForm(false);
      }
    } catch (error: any) {
      setMessage(`Error: ${error}`);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    try {
      const result = await dispatch(deleteUserAccount(uid)).unwrap();
      if (result.success) {
        setMessage(`${result.message}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error}`);
    }
  };

  const handleDeleteClick = useCallback((id: string) => {
    setUserToDelete(id);
    setModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!userToDelete) return;
    handleDeleteUser(userToDelete);
    setModalOpen(false);
    setUserToDelete(null);
  }, [userToDelete]);

  const handleEditUser = (user: { id: string; email: string; role: string }) => {
    setEmail(user.email);
    setRole(user.role);
    setEditingUid(user.id);
    setShowForm(true);
    setMessage("");
  };

  return (
    <div className="p-6 max-w-[1430px] mx-auto">
      <div className="flex flex-col lg-custom:flex-row justify-between lg-custom:items-center gap-5 flex-wrap mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          User Management
        </h2>

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
              ring-2 ring-blue-600  ring-offset-2     ring-offset-white dark:ring-offset-gray-900
                  disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      <div className="p-5 shadow-lg rounded-lg bg-white dark:bg-gray-800">
        {showForm && (
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
                className="w-full outline-purple65 p-2 border border-gray15 dark:border-white95 rounded"
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
              disabled={loading}
              className="w-full font-medium text-lg py-2 rounded bg-purple70 text-white hover:bg-purple60 duration-300 cursor-pointer disabled:opacity-50"
            >
              {editingUid ? "Update User" : "Create User"}
            </button>
          </form>
        )}

        {message && (
          <p className="mb-4 text-center font-semibold text-black dark:text-white95">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 text-center font-semibold text-red-500">
            Error: {error}
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
          <table className="max-[590px]:min-w-max w-full border-collapse border dark:border-white95 border-gray15 text-center">
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="text-black dark:text-white99 border dark:border-white99 border-gray15 p-3.5">
                    {user.email}
                  </td>
                  <td className="text-black dark:text-white99 border dark:border-white99 border-gray15 p-3.5">
                    {user.role}
                  </td>
                  <td className=" border dark:border-white99 border-gray15 p-3.5 space-x-2">
                    <div className="flex justify-center items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleEditUser({ id: user.id, email: user.email, role: user.role })}
                        className="px-3 py-1 bg-purple70 text-white rounded hover:bg-purple60 duration-300 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
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
        )}
      </div>
      
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