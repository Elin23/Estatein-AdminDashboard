import { useState, useEffect } from "react";

export const usePagination = <T>(items: T[]) => {
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1280) setItemsPerPage(4);
      else if (window.innerWidth >= 1024) setItemsPerPage(3);
      else if (window.innerWidth >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerPage);  

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaginationNumbers = (): (number | string)[] => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1); 
    }
    if (currentPage <= 2) {
      return [1, 2, "...", totalPages]; 
    }
    if (currentPage >= totalPages - 1) {
      return [1, "...", totalPages - 1, totalPages]; 
    }
    return [1, "...", currentPage, "...", totalPages]; 
   };

  return {
    currentPage, 
    setCurrentPage, 
    totalPages, 
    paginatedItems, 
    itemsPerPage, 
    getPaginationNumbers, 
  };
};