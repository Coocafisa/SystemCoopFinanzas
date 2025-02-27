"use client";
import React, { useState, useEffect } from 'react';
import "@styles/table.css";
import Search from './search';

const TableInvoices = ({ data, keysToSearch, fields, title, headers, expandedData}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const maxVisiblePages = 4;
  
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setOriginalData(Array.isArray(data) ? data : []);
    setFilteredData(Array.isArray(data) ? data : []);
  }, [data]); 

  const getPageRange = () => {
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleFilter = (filtered) => {
    setFilteredData(filtered);
    setCurrentPage(1); 
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
        <div className='title-search'>
        <h1>{title}</h1>
        <Search data={originalData} keysToSearch={keysToSearch} onFilteredData={handleFilter} />
        <div className="header-details">
        </div>
        </div>
      </div>
      {filteredData.length === 0 ? (
            <div className="loading-message">No se encontraron registros disponibles...</div>
          ) : (
            <table className="responsive-table">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr>
                    {fields.map((field, colIndex) => (
                      <td key={colIndex} data-label={headers[colIndex]}>
                        {field === "num" ? rowIndex + 1 : item[field] || "N/A"}
                      </td>
                    ))}
                    <td>
                      <button onClick={() => toggleRow(rowIndex)}>
                        {expandedRows[rowIndex] ? 'Ocultar' : 'Ver más'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[rowIndex] && (
                    <tr className="expanded-row">
                      <td colSpan={headers.length + 1}>
                        <div>
                          {expandedData.map((dataItem, idx) => (
                            <div key={idx}>
                              <strong className='text-oculto'>{dataItem.label}:</strong> {dataItem.value}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          )}
          <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={handlePrevGroup}
        >
          &laquo;
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
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default TableInvoices;