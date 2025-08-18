import { useState } from "react";
import Values from "./Values";
import Achievements from "./Achievements";


type TabKey = "achievements" | "values";

export default function AchievementsAndValues() {
  const [active, setActive] = useState<TabKey>("achievements");

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
          id="tab-achievements-trigger"
          role="tab"
          aria-selected={active === "achievements"}
          aria-controls="tab-achievements"
          className={`${baseBtn} ${active === "achievements" ? activeBtn : idleBtn}`}
          onClick={() => setActive("achievements")}
        >
          Achievements
        </button>

        <button
          id="tab-values-trigger"
          role="tab"
          aria-selected={active === "values"}
          aria-controls="tab-values"
          className={`${baseBtn} ${active === "values" ? activeBtn : idleBtn}`}
          onClick={() => setActive("values")}
        >
          Values 
        </button>
      </div>

      <div className="mt-2">
        {active === "achievements" ? (
          <div
            id="tab-achievements"
            role="tabpanel"
            aria-labelledby="tab-achievements-trigger"
          >
            <Achievements />
          </div>
        ) : (
          <div id="tab-values" role="tabpanel" aria-labelledby="tab-values-trigger">
            <Values />
          </div>
        )}
      </div>
    </div>
  );
}
