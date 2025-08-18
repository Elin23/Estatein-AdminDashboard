import { useState, useEffect, useRef } from 'react';
import type { TeamMember } from '../../types/index';
import FormField from '../InputField/FormField';
import GeneralBtn from '../buttons/GeneralBtn';

interface Props {
  initialData?: TeamMember | null;
  onCancel: () => void;
  onSubmit: (data: Omit<TeamMember, 'id'>, id?: string) => Promise<void>;
}

export default function TeamForm({ initialData, onCancel, onSubmit }: Props) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [role, setRole] = useState(initialData?.role ?? '');
  const [clientImage, setClientImage] = useState(initialData?.clientImage ?? '');
  const [twitterLink, setTwitterLink] = useState(initialData?.twitterLink ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fromRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
      setClientImage(initialData.clientImage);
      setTwitterLink(initialData.twitterLink ?? '');
      setEmail(initialData.email ?? '');

    } else {
      setName('');
      setRole('');
      setClientImage('');
      setTwitterLink('');
      setEmail('');

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
        { name: name.trim(), role: role.trim(), clientImage, twitterLink: twitterLink.trim(), email: email.trim() },
        initialData?.id
      );
      if (!initialData) {
        setName('');
        setRole('');
        setClientImage('');
        setTwitterLink('');
        setEmail('');

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
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
      ref={fromRef}
    >
      <FormField
        label="Name"
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <FormField
        label="Role"
        name="role"
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />

      <FormField
        label="Twitter Link"
        name="twitterLink"
        type="url"
        value={twitterLink}
        onChange={(e) => setTwitterLink(e.target.value)}
      />

    <FormField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <FormField
        label="Photo"
        name="photo"
        file
        accept="image/*"
        onChange={(e) => handleFile(e as React.ChangeEvent<HTMLInputElement>)}
      />
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
        <GeneralBtn
        btnContent={initialData ? 'Update' : 'Add'}
        btnType={initialData ? 'update' : 'add'}
        actionToDo={()=>fromRef.current?.requestSubmit()}
        disabled={loading || uploading}
        />
      </div>
    </form>
  );
}

