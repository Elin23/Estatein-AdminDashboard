import { useEffect, useState } from "react";
import type { ValuedClient } from "../../types/ValuedClient";

type SubmitFn = (data: Omit<ValuedClient, "id">, id?: string) => Promise<void>;

interface ValuedClientsFormProps {
  initialData?: ValuedClient | null;
  onCancel: () => void;
  onSubmit: SubmitFn;
}

export default function ValuedClientsForm({
  initialData = null,
  onCancel,
  onSubmit,
}: ValuedClientsFormProps) {
  const [title, setTitle] = useState("");
  const [since, setSince] = useState("");
  const [domain, setDomain] = useState("");
  const [category, setCategory] = useState("");
  const [said, setSaid] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setSince(initialData.since ?? "");
      setDomain(initialData.domain ?? "");
      setCategory(initialData.category ?? "");
      setSaid(initialData.review ?? "");
      setWebsite(initialData.website ?? "");
    } else {
      setTitle("");
      setSince("");
      setDomain("");
      setCategory("");
      setSaid("");
      setWebsite("");
    }
  }, [initialData]);

  const normalizeUrl = (url: string) => {
    const u = url.trim();
    if (!u) return "";
    return /^https?:\/\//i.test(u) ? u : `https://${u}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !since.trim() || !domain.trim() || !category.trim() || !said.trim() || !website.trim()) {
      alert("Please fill all fields");
      return;
    }
    const payload: Omit<ValuedClient, "id"> = {
      title: title.trim(),
      since: since.trim(),
      domain: domain.trim(),
      category: category.trim(),
      review: said.trim(),
      website: normalizeUrl(website),
    };
    setLoading(true);
    try {
      await onSubmit(payload, initialData?.id);
      if (!initialData) {
        setTitle("");
        setSince("");
        setDomain("");
        setCategory("");
        setSaid("");
        setWebsite("");
      }
    } catch {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow huge:max-w-[1390px] huge:mx-auto"
    >
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">Title</label>
        <input
          type="text"
          placeholder="e.g., ABC Corporation"
          className="w-full px-3 py-2 border border-black dark:border-white rounded text-black dark:text-white bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">Since</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="e.g., 2019"
          className="w-full px-3 py-2 border border-black dark:border-white rounded text-black dark:text-white bg-transparent"
          value={since}
          onChange={(e) => setSince(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">Domain</label>
        <input
          type="text"
          placeholder="e.g., Commercial Real Estate"
          className="w-full px-3 py-2 border border-black dark:border-white rounded text-black dark:text-white bg-transparent"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">Category</label>
        <input
          type="text"
          placeholder="e.g., Luxury Home Development"
          className="w-full px-3 py-2 border border-black dark:border-white rounded text-black dark:text-white bg-transparent"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">What They Said</label>
        <textarea
          placeholder="Client's testimonial..."
          className="w-full px-3 py-2 border border-black dark:border-white rounded text-black dark:text-white bg-transparent"
          value={said}
          onChange={(e) => setSaid(e.target.value)}
          required
          rows={4}
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1 text-black dark:text-white">Website URL</label>
        <input
          type="url"
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-black dark:border-white rounded text-black dark:text-white bg-transparent"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple60 text-white rounded hover:bg-purple70 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {initialData ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
