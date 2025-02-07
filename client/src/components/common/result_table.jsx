"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import "@styles/table.css";
import Search from "./search";
import { Edit, TrashIcon } from "lucide-react";
import { EditRecord } from "./elements";
import AlertPopup from "./alert";
import { deleteRegister } from "@/api/requestServices/generalServices";

const ResultTable = ({ data = [], keysToSearch, title, headers = [], fields = [], isAction, rol, editTitle, selectTable}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setDelete ] = useState(false);
  const [currentRecord, setCurrentRecord] = useState("");
  const itemsPerPage = 10;

  const totalPages = useMemo(() => {
    return filteredData.length > 0 ? Math.ceil(filteredData.length / itemsPerPage) : 1;
  }, [filteredData]);
  const maxVisiblePages = 4;

  const paginatedData = useMemo(() => {
    return filteredData.length > 0
      ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : [];
  }, [filteredData, currentPage, itemsPerPage]);

  const getPageRange = useMemo(() => {
    if (totalPages === 0) return [];
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setFilteredData(data || []);
  }, [data]);

  const handleFilter = (filtered) => {
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePrevGroup = useCallback(() => {
    const newPage = Math.max(1, currentPage - maxVisiblePages);
    setCurrentPage(newPage);
  }, [maxVisiblePages]);

  const handleNextGroup = useCallback(() => {
    const newPage = Math.min(totalPages, currentPage + maxVisiblePages);
    setCurrentPage(newPage);
  }, [maxVisiblePages ,totalPages]);

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setIsEditing(true);
  }

  const closeModal = () => {
    setIsEditing(false);
    setCurrentRecord(null);
  }

  const handleDelete = async (recordDelete) => {
    setDelete(true);
    setCurrentRecord(recordDelete);
  }

  const confirmDelete = async (event) => {
    event.preventDefault();
    const res = await deleteRegister(event, currentRecord.identificacion, selectTable);
    if (res.status === 200 || res.status === 204) {
      setDelete(false);
      setCurrentRecord(null);
    }
  };
  return (
    <>
    {isEditing && currentRecord && <EditRecord data={currentRecord} role={rol}
    state={isEditing} closeModal={closeModal} editTitle={editTitle}/>}
    <div className="container">
      <div className="header">
        <div className="title-search">
          <h1>{title}</h1>
          <Search
            data={data}
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
                { rol === "Administrador" && <div className="icon-container">
                  <TrashIcon className="delete-icon" onClick={() => handleDelete(item)}/>
                  <span className="tooltip">Eliminar</span>
                  {isDelete && (<AlertPopup
                  message={`Estas seguro de eliminar a: ${currentRecord.nombre}`} type={"warning"}>
                    <button className="delete-button" onClick={confirmDelete}>Eliminar</button>
                    <button className="cancel-button" onClick={() => {setDelete(false), setCurrentRecord(null)}}>
                      Cancelar</button>
                    </AlertPopup>)}
                </div>}
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
        {getPageRange.map((page) => (
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