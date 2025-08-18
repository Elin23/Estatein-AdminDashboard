import { useEffect, useState } from "react";
import type { ValuedClient } from "../../types/ValuedClient";
import GeneralBtn from "../buttons/GeneralBtn";

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

    const handleSubmit = async () => {
    const t = title.trim();
    const s = since.trim();
    const d = domain.trim();
    const c = category.trim();
    const r = said.trim();
    const wRaw = website.trim();

    if (!t || !s || !d || !c || !r || !wRaw) {
      alert("Please fill all fields");
      return;
    }

    const w = normalizeUrl(wRaw);
    try {
      new URL(w);
    } catch {
      alert("Invalid website URL");
      return;
    }

    const payload: Omit<ValuedClient, "id"> = {
      title: t,
      since: s,
      domain: d,
      category: c,
      review: r,
      website: w,
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
      onSubmit={(e) => {
        e.preventDefault();        
        void handleSubmit();       
      }}
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
        <GeneralBtn
          btnContent="Cancel"
          btnType="cancel"
          actionToDo={onCancel}
          disabled={loading}
        />

        <GeneralBtn
          btnContent={initialData ? "Update" : "Add"}
          btnType={initialData ? "update" : "add"}
          actionToDo={handleSubmit} 
        />
      </div>
    </form>
  );
}
