import { useState } from "react";
import Locations from "./Locations";
import SocialLinks from "./SocialLinks";


type TabKey = "locations" | "social";

export default function CompanyInfo() {
  const [active, setActive] = useState<TabKey>("locations");

  const baseBtn =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-400";
  const activeBtn = "bg-purple-600 text-white shadow";
  const idleBtn =
    "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black dark:bg-gray-800 dark:text-gray-200";

  return (
    <div className="w-full p-6  huge:max-w-[1390px] huge:mx-auto ">
      <div
        role="tablist"
        aria-label="Sections"
        className="flex  items-center gap-2  w-full mb-4 "
      >
        <button
          id="tab-locations-trigger"
          role="tab"
          aria-selected={active === "locations"}
          aria-controls="tab-locations"
          className={`${baseBtn} ${active === "locations" ? activeBtn : idleBtn}`}
          onClick={() => setActive("locations")}
        >
          Locations
        </button>

        <button
          id="tab-social-trigger"
          role="tab"
          aria-selected={active === "social"}
          aria-controls="tab-social"
          className={`${baseBtn} ${active === "social" ? activeBtn : idleBtn}`}
          onClick={() => setActive("social")}
        >
          Social Links
        </button>
      </div>

      <div className="mt-2">
        {active === "locations" ? (
          <div
            id="tab-locations"
            role="tabpanel"
            aria-labelledby="tab-locations-trigger"
          >
            <Locations />
          </div>
        ) : (
          <div id="tab-social" role="tabpanel" aria-labelledby="tab-social-trigger">
            <SocialLinks />
          </div>
        )}
      </div>
    </div>
  );
}
