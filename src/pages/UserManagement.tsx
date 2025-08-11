import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  update,
} from "firebase/database";

const UserManagement = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<{ uid: string; email: string; role: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUid, setEditingUid] = useState<string | null>(null);

  const auth = getAuth();
  const db = getDatabase();

  // جلب قائمة المستخدمين من Realtime Database
  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.entries(data).map(([uid, val]: any) => ({
          uid,
          email: val.email,
          role: val.role,
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, [db]);

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editingUid) {
        // تعديل role فقط
        await update(ref(db, `users/${editingUid}`), { role });
        setMessage("✅ User updated successfully!");
        setEditingUid(null);
      } else {
        // إنشاء مستخدم جديد في Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;
        // إضافة بيانات المستخدم إلى Realtime Database
        await set(ref(db, `users/${uid}`), {
          email,
          role,
        });
        setMessage("✅ User created successfully!");
      }

      // إعادة تعيين الحقول
      setEmail("");
      setPassword("");
      setRole("admin");
      setShowForm(false);
    } catch (error: any) {
      console.error(error);
      setMessage("❌ Error: " + error.message);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    try {
      // حذف المستخدم من Realtime Database
      await remove(ref(db, `users/${uid}`));
      // ملاحظة: حذف المستخدم من Firebase Auth يحتاج صلاحيات إدارية من السيرفر (firebase admin sdk)
      setMessage("✅ User deleted from database!");
    } catch (error: any) {
      console.error(error);
      setMessage("❌ Error deleting user: " + error.message);
    }
  };

  const handleEditUser = (user: { uid: string; email: string; role: string }) => {
    setEmail(user.email);
    setRole(user.role);
    setEditingUid(user.uid);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingUid(null);
          setEmail("");
          setPassword("");
          setRole("admin");
          setMessage("");
        }}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "Add User"}
      </button>

      {showForm && (
        <form
          onSubmit={handleCreateOrUpdateUser}
          className="mb-6 space-y-4 border p-4 rounded"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={!!editingUid} // منع تعديل الايميل عند التعديل
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {!editingUid && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          )}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="support">Support</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {editingUid ? "Update User" : "Create User"}
          </button>
        </form>
      )}

      {message && (
        <p className="mb-4 text-center font-semibold text-green-700">{message}</p>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No users found.
              </td>
            </tr>
          )}
          {users.map(({ uid, email, role }) => (
            <tr key={uid}>
              <td className="border border-gray-300 p-2">{email}</td>
              <td className="border border-gray-300 p-2">{role}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                <button
                  onClick={() => handleEditUser({ uid, email, role })}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(uid)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
