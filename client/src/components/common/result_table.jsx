"use client";
import React, { useState, useEffect } from "react";
import "@styles/table.css";
import Search from "./search";

const ResultTable = ({ data, keysToSearch, title, headers, fields}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [originalData, setOriginalData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const maxVisiblePages = 4;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageRange = () => {
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  useEffect(() => {
    setOriginalData(data);
    setFilteredData(data);
    setTimeout(() => {
    }, 2000);
  }, [data]);

  const handleFilter = (filtered) => {
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePrevGroup = () => {
    const newPage = Math.max(1, currentPage - maxVisiblePages);
    setCurrentPage(newPage);
  };

  const handleNextGroup = () => {
    const newPage = Math.min(totalPages, currentPage + maxVisiblePages);
    setCurrentPage(newPage);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title-search">
          <h1>{title}</h1>
          <Search
            data={originalData}
            keysToSearch={keysToSearch}
            onFilteredData={handleFilter}
          />
        </div>
      </div>
     {filteredData.length === 0 ? (
        <div className="loading-message">No se encontraron registros...</div>
      ) : (
        <table className="responsive-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {fields.map((field, colIndex) => (
                  <td key={colIndex} data-label={headers[colIndex]}>
                    {field === "num" ? rowIndex + 1 : item[field] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={handlePrevGroup}
        >
        </button>
        {getPageRange().map((page) => (
          <button
            key={page}
            className={page === currentPage ? "active" : ""}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={handleNextGroup}
        >
        </button>
      </div>
    </div>
  );
};

export default ResultTable;