import  { useEffect, useState } from "react"
import FormField from "../InputField/FormField"
import GeneralBtn from "../buttons/GeneralBtn"

export interface SocialLink {
  id?: string
  platform: string
  url: string
}

interface Props {
  platform: string
  initialData?: SocialLink
  onCancel: () => void
  onSubmit: (data: Omit<SocialLink, "id">, id?: string) => Promise<void>
}

export default function SocialLinkForm({
  platform,
  initialData,
  onCancel,
  onSubmit,
}: Props) {
  const [url, setUrl] = useState(initialData?.url ?? "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) setUrl(initialData.url)
    else setUrl("")
  }, [initialData])

  const handleSubmit = async () => {
    const raw = url.trim();
    if (!raw) {
      alert("Please enter a URL");
      return;
    }

    const normalized = normalizeUrl(raw);

    function normalizeUrl(url: string): string {
      if (!/^https?:\/\//i.test(url)) {
        return "https://" + url;
      }
      return url;
    }
    try {
      new URL(normalized);
    } catch {
      alert("Invalid URL");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ platform, url: normalized }, initialData?.id);
      if (!initialData) setUrl("");
    } catch (e) {
      console.error(e);
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
      className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm p-4 mb-6 max-w-2xl"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className=" p-2.5 rounded-md bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-medium  text-purple-700 capitalize">
              {platform}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {initialData ? "Edit link" : "Add link"}
          </h3>
        </div>
      </div>

      <label className="block text-sm text-gray-600 mb-1">URL</label>
      <FormField
        label={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
        name={platform}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={`https://www.${platform}.com/your-page`}
        required
      />

      <div className="flex justify-end gap-2">
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
  )
}
