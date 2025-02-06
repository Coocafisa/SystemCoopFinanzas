"use client";
import React, { useState, useEffect } from "react";
import "@styles/table.css";
import Search from "./search";
import { Edit, TrashIcon } from "lucide-react";
import { EditRecord } from "./elements";

const ResultTable = ({ data, keysToSearch, title, headers, fields, isAction, rol, editTitle}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [originalData, setOriginalData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState("");
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

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setIsEditing(true);
  }

  const closeModal = () => {
    setIsEditing(false);
    setCurrentRecord(null);
  }

  return (
    <>
    {isEditing && currentRecord && <EditRecord data={currentRecord} role={rol}
    state={isEditing} closeModal={closeModal} editTitle={editTitle}/>}
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
                { isAction && 
                <td className="actions">
                <div className="icon-container">
                  <Edit className="edit-icon" onClick={() => handleEditClick(item)}/>
                  <span className="tooltip">Editar</span>
                </div>
                <div className="icon-container">
                  <TrashIcon className="delete-icon"/>
                  <span className="tooltip">Eliminar</span>
                </div>
                </td> }
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
    </>
  );
};

export default ResultTable;