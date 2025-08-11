import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, set, remove } from 'firebase/database';

interface User {
  email: string;
  role: 'admin' | 'support_manager' | 'user';
  id: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'support_manager' | 'user'>('user');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const usersList: User[] = Object.entries(data).map(([key, val]) => ({
        id: key,
        ...(val as Omit<User, 'id'>),
      }));
      setUsers(usersList);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required');
      return;
    }

    if (editId) {
      set(ref(db, `users/${editId}`), { email, role })
        .then(() => {
          resetForm();
        })
        .catch(e => setError(e.message));
    } else {
      const newId = Date.now().toString();
      set(ref(db, `users/${newId}`), { email, role })
        .then(() => {
          resetForm();
        })
        .catch(e => setError(e.message));
    }
  };

  const resetForm = () => {
    setEmail('');
    setRole('user');
    setEditId(null);
  };

  const handleEdit = (user: User) => {
    setEmail(user.email);
    setRole(user.role);
    setEditId(user.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف المستخدم؟')) {
      remove(ref(db, `users/${id}`)).catch(e => setError(e.message));
    }
  };

  return (
    <div className="p-6 bg-white99 dark:bg-gray10 min-h-screen font-urbanist text-gray08 dark:text-white90">
      <h1 className="text-3xl mb-6 font-bold">User Management</h1>

      <form onSubmit={handleSubmit} className="mb-6 max-w-md space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray15 dark:border-gray30 dark:text-white90"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block mb-1 font-semibold">Role</label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray15 dark:border-gray30 dark:text-white90"
          >
            <option value="user">User</option>
            <option value="support_manager">Support Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-purple70 hover:bg-purple65 text-white py-2 px-4 rounded transition"
          >
            {editId ? 'Update User' : 'Add User'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="py-2 px-4 border border-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple97 dark:bg-gray15">
              <th className="p-3 border border-gray-300">Email</th>
              <th className="p-3 border border-gray-300">Role</th>
              <th className="p-3 border border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-3">No users found</td>
              </tr>
            )}
            {users.map(user => (
              <tr key={user.id} className="even:bg-white99 odd:bg-purple99 dark:even:bg-gray10 dark:odd:bg-gray15">
                <td className="p-3 border border-gray-300">{user.email}</td>
                <td className="p-3 border border-gray-300">{user.role}</td>
                <td className="p-3 border border-gray-300 text-center space-x-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-purple70 hover:text-purple65"
                    aria-label="Edit user"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Delete user"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
