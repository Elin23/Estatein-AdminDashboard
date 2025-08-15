import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import {
  setCurrentPage,
  setItemsPerPage,
} from "../redux/slices/paginationSlice";


export const usePagination = <T>(items: T[]) => {
  const dispatch = useDispatch();
  const { currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.pagination
  );

  const prevLength = useRef(items.length);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1280) dispatch(setItemsPerPage(4));
      else if (window.innerWidth >= 1024) dispatch(setItemsPerPage(3));
      else if (window.innerWidth >= 768) dispatch(setItemsPerPage(2));
      else dispatch(setItemsPerPage(1));
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      dispatch(setCurrentPage(1));
    }
    else if (items.length !== prevLength.current) {
      dispatch(setCurrentPage(1));
    }
    prevLength.current = items.length;
  }, [items.length, totalPages, currentPage, dispatch]);

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaginationNumbers = (): (number | string)[] => {
    if (totalPages <= 4)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, "...", totalPages];
    if (currentPage >= totalPages - 1)
      return [1, "...", totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  return {
    currentPage,
    setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
    totalPages,
    paginatedItems,
    itemsPerPage,
    getPaginationNumbers,
  };
};
