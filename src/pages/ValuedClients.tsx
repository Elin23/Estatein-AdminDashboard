import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue, push, set, update, remove } from 'firebase/database';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import ValuedClientsForm from '../components/ValuedClients/ValuedClientsForm';
import ValuedClientCard from '../components/ValuedClients/ValuedClientCard';
import type { ValuedClient } from '../types/ValuedClient';

function ValuedClients() {
  const role = useSelector((state: RootState) => state.auth.role) || '';
  const [clients, setClients] = useState<ValuedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<ValuedClient | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const clientsRef = ref(db, 'clients');
    const unsubscribe = onValue(clientsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, Omit<ValuedClient, 'id'>>;
        const list: ValuedClient[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setClients(list);
      } else {
        setClients([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (newClient: Omit<ValuedClient, 'id'>) => {
    const newRef = push(ref(db, 'clients'));
    await set(newRef, newClient);
    setShowForm(false);
  };

  const handleUpdate = async (data: Omit<ValuedClient, 'id'>, id?: string) => {
    if (!id) return;
    await update(ref(db, `clients/${id}`), data);
    setEditingClient(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await remove(ref(db, `clients/${id}`));
  };

  const handleEditClick = (client: ValuedClient) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center flex-wrap mb-4 huge:max-w-[1390px] huge:mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Valued Clients</h1>
        {role === 'admin' && (
          <button
            className="bg-purple60 hover:bg-purple65  text-white px-4 py-2 rounded"
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
            setEditingClient(null);
            setShowForm(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4  huge:max-w-[1390px] huge:mx-auto">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => <ValuedClientCard key={idx} loading />)
          : clients.map((client) => (
              <ValuedClientCard
                key={client.id}
                client={client}
                onEdit={() => handleEditClick(client)}
                onDelete={() => handleDelete(client.id)}
              />
            ))}
      </div>
    </div>
  );
}

export default ValuedClients;
