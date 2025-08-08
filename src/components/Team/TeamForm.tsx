import { useState, useEffect } from 'react';
import { TeamMember } from '../../types/index';

interface Props {
  initialData?: TeamMember;
  onCancel: () => void;
  onSubmit: (data: Omit<TeamMember, 'id'>, id?: string) => Promise<void>;
}

export default function TeamForm({ initialData, onCancel, onSubmit }: Props) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [role, setRole] = useState(initialData?.role ?? '');
  const [clientImage, setClientImage] = useState(initialData?.clientImage ?? '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
      setClientImage(initialData.clientImage);
    } else {
      setName('');
      setRole('');
      setClientImage('');
    }
  }, [initialData]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(
      'https://api.imgbb.com/1/upload?key=edeee7c6c2851a590946b20e9ce00b5d',
      { method: 'POST', body: form }
    );
    const json = await res.json();
    setUploading(false);
    if (json.success) return json.data.display_url as string;
    throw new Error('Upload failed');
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setClientImage(url);
    } catch {
      alert('Image upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !clientImage) {
      return alert('Please fill name, role and upload an image');
    }
    setLoading(true);
    try {
      await onSubmit(
        { name: name.trim(), role: role.trim(), clientImage },
        initialData?.id
      );
      if (!initialData) {
        setName('');
        setRole('');
        setClientImage('');
      }
    } catch {
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow"
    >
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Name
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border  dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Role
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border  dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full px-3 py-2 border  dark:border-gray-600 rounded bg-white dark:bg-gray-700"
        />
      </div>

      {uploading && <p className="text-sm text-gray-500">Uploading image…</p>}
      {clientImage && (
        <img
          src={clientImage}
          alt="Uploaded preview"
          className="w-24 h-24 object-cover rounded mb-2"
        />
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={loading || uploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || uploading}
        >
          {initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
