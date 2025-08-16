import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../redux/store"
import {
  subscribeToTestimonials,
  toggleTestimonialShow,
  bulkUpdateTestimonialsShow,
} from "../redux/slices/testimonialsSlice";
 import TestimonialCard from "../components/TestimonialsCard"
 import Pagination from "../components/UI/Pagination"



const Testimonials = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: testimonials, loading } = useSelector(
    (state: RootState) => state.testimonials
  );
  const role = useSelector((state: RootState) => state.auth.role) || "";

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState<"all" | "true" | "false">("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    dispatch(subscribeToTestimonials());
  }, [dispatch]);

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesShow =
        showFilter === "all" ? true : showFilter === "true" ? t.show : !t.show;
      return matchesSearch && matchesShow;
    });
  }, [testimonials, search, showFilter]);

  const handleToggleShow = (id: string, newValue: boolean) => {
    dispatch(toggleTestimonialShow({ id, newValue }));
  };

  const handleBulkUpdate = (newValue: boolean) => {
    dispatch(bulkUpdateTestimonialsShow({ ids: selectedItems, newValue }));
    setSelectedItems([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 max-w-[1430px] mx-auto ">
      <div className="flex flex-col  lg-custom:flex-row justify-between lg-custom:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Testimonials
        </h1>
        <div className="flex flex-col lg-custom:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          />
          <select
            value={showFilter}
            onChange={(e) => setShowFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All</option>
            <option value="true">Visible</option>
            <option value="false">Hidden</option>
          </select>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleBulkUpdate(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Show Selected
          </button>
          <button
            onClick={() => handleBulkUpdate(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Hide Selected
          </button>
        </div>
      )}
      <Pagination
        items={filteredTestimonials}
        renderItem={(item) => (
          <div key={item.id} className="relative">
            {role === "admin" && (
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="absolute  top-3 left-3 w-6 h-6 cursor-pointer border-2 border-gray-400  rounded-full dark:border-gray-600"
              />
            )}
            <TestimonialCard
              testimonial={item}
              onToggleShow={handleToggleShow}
            />
          </div>
        )}
        loading={loading}
      />

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No testimonials found.
          </p>
        </div>
      )}
    </div>
  );
};

export default Testimonials
