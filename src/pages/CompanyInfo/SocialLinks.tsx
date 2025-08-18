import { useEffect, useMemo, useRef, useState } from "react";
import {
  subscribeToSocialLinks,
  saveSocialLink,
  deleteSocialLink,
  cleanupSubscription,
} from "../../redux/slices/socialLinksSlice";
import SocialLinkForm from "../../components/SocialMedia/SocialLinksForm";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector";
import TablePortal from "../../components/TablePortal"; 

const PLATFORMS = ["facebook", "linkedin", "twitter", "youtube", "instagram"] as const;

const PlatformBadge = ({ name }: { name: string }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-purple-700 capitalize">
    {name}
  </span>
);

export default function SocialLinks() {
  const dispatch = useAppDispatch();
  const { list: links } = useAppSelector((state) => state.socialLinks);
  const role = useAppSelector((state) => state.auth.role) || "";

  const [active, setActive] = useState<string>(PLATFORMS[0]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(subscribeToSocialLinks());
    return () => {
      dispatch(cleanupSubscription());
    };
  }, [dispatch]);

  const filtered = useMemo(
    () =>
      links
        .filter((l) => l.platform === active)
        .filter((l) => l.url.toLowerCase().includes(query.toLowerCase())),
    [links, active, query]
  );

  const handleSave = async (data: any, id?: string) => {
    await dispatch(saveSocialLink({ data, id }));
    setAdding(false);
    setEditing(null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const ok = window.confirm("Are you sure you want to delete this link?");
    if (!ok) return;
    await dispatch(deleteSocialLink(id));
  };

  const tableAnchorRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4 lg:gap-0">
          <div>
            <h1 className="text-3xl font-extrabold">Social Links</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage company social media URLs (per platform).
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex items-center border border-black dark:border-gray-600 rounded-md px-3 py-2.5 shadow-sm flex-grow sm:flex-grow-0">
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${active} links...`}
                className="outline-none text-sm bg-transparent text-gray-900 dark:text-white w-full"
              />
            </div>

            {role === "admin" && (
              <button
                onClick={() => {
                  setAdding(true);
                  setEditing(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                + Add Value
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-4">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setActive(p);
                setAdding(false);
                setEditing(null);
                setQuery("");
              }}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${
                active === p ? "bg-white text-purple-700 ring-1 ring-purple-200 shadow-sm" : "bg-transparent text-gray-600 hover:bg-white/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <PlatformBadge name={p} />
                <span className="text-sm dark:text-gray-500 text-gray-700 capitalize">{p}</span>
                <span className="ml-2 text-xs dark:text-gray-500 text-gray-700">({links.filter((l) => l.platform === p).length})</span>
              </div>
            </button>
          ))}
        </div>

        {/* Add / Edit Form */}
        {(adding || editing) && (
          <div className="mb-6 max-w-xl">
            <SocialLinkForm
              platform={active}
              initialData={editing || undefined}
              onCancel={() => {
                setAdding(false);
                setEditing(null);
              }}
              onSubmit={handleSave}
            />
          </div>
        )}

        <div ref={tableAnchorRef} className="w-full" />
        <TablePortal anchorRef={tableAnchorRef}>
          <div className="table-scroll-wrapper overflow-x-auto w-full border dark:border-gray-700 border-black rounded-lg shadow-sm bg-white">
            <table className="w-full min-w-[640px] divide-y divide-gray-200 dark:divide-gray-600">
              <colgroup>
                <col style={{ width: "56px" }} />
                <col />
                <col style={{ width: "160px" }} />
              </colgroup>

              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">URL</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No {active} links yet.</td>
                  </tr>
                ) : (
                  filtered.map((link, idx) => (
                    <tr key={link.id}>
                      <td className="px-4 py-4 whitespace-nowrap truncate text-sm text-gray-600 dark:text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-4 text-sm text-purple-700 break-words max-w-[70ch]">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline inline-block break-words">
                          {link.url}
                        </a>
                      </td>

                      {role === "admin" && (
                        <td className="px-4 py-4 text-right text-sm font-medium flex justify-end gap-2 flex-wrap min-w-[160px] actions-cell">
                          <button onClick={() => { setEditing(link); setAdding(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700 whitespace-nowrap">Edit</button>
                          <button onClick={() => handleDelete(link.id)} className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 whitespace-nowrap">Delete</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TablePortal>
      </div>
    </div>
  );
}
