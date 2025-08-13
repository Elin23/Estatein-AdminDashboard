import React, { useEffect, useState } from "react";
import FormField from "../InputField/FormField";

export interface SocialLink {
    id?: string;
    platform: string;
    url: string;
}

interface Props {
    platform: string;
    initialData?: SocialLink;
    onCancel: () => void;
    onSubmit: (data: Omit<SocialLink, "id">, id?: string) => Promise<void>;
}

export default function SocialLinkForm({ platform, initialData, onCancel, onSubmit }: Props) {
    const [url, setUrl] = useState(initialData?.url ?? "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) setUrl(initialData.url);
        else setUrl("");
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) {
            alert("Please enter a valid URL");
            return;
        }
        setLoading(true);
        try {
            await onSubmit({ platform, url: url.trim() }, initialData?.id);
            // success => form will be closed by parent (adding/editing flags)
        } catch (err) {
            console.error(err);
            alert("Save failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm p-4 mb-6 max-w-2xl"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className=" p-2.5 rounded-md bg-gray-100 flex items-center justify-center">
                        {/* small platform label */}
                        <span className="text-sm font-medium  text-purple-700 capitalize">{platform}</span>
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
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-60"
                    disabled={loading}
                >
                    {initialData ? "Update" : "Add"}
                </button>
            </div>
        </form>
    );
}
