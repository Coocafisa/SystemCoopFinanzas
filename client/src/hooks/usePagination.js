import { useMemo, useState, useCallback } from "react";

const usePagination = (data, itemsPerPage, maxVisiblePages) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.length / itemsPerPage)), [data.length, itemsPerPage]);

  const paginatedData = useMemo(() => data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [data, currentPage, itemsPerPage]);

  const getPageRange = useMemo(() => {
    if (totalPages === 0) return [];
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, maxVisiblePages]);

  const handlePrevGroup = useCallback(() => setCurrentPage(prev => Math.max(1, prev - maxVisiblePages)), [maxVisiblePages]);
  const handleNextGroup = useCallback(() => setCurrentPage(prev => Math.min(totalPages, prev + maxVisiblePages)), [maxVisiblePages, totalPages]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    getPageRange,
    handlePrevGroup,
    handleNextGroup,
    setCurrentPage,
  };
};

export default usePagination;
