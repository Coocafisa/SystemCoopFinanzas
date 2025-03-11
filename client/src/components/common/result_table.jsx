"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import "@styles/table.css";
import Search from "./search";
import { Edit, TrashIcon, ShieldCheck } from "lucide-react";
import EditRecord from "./edit_record";
import AlertPopup from "./alert";
import { deleteRegister } from "@/api/requestServices/generalServices";
import { AddRecordPermits } from "./add_permits";
import RegisterUser from "@/app/home/user/registerUser";
import { usePathname } from "next/navigation";
import RegisterEntity from "@/app/home/user/entities/registerEntitie";
const ResultTable = ({ data = [], keysToSearch, title, headers = [], fields = [], isAction, rol, editTitle, selectTable, aditionalData = [], children, isPermit, isNewRegister }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [addRegister, setAddRegister] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [currentRecord, setCurrentRecord] = useState("");
  const itemsPerPage = 10;
  const location = usePathname();

  useEffect(() => {
    if (data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredData.length / itemsPerPage)), [filteredData.length, itemsPerPage]);
  const maxVisiblePages = 4;

  const paginatedData = useMemo(() =>
    filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredData, currentPage, itemsPerPage]
  );

  const getPageRange = useMemo(() => {
    if (totalPages === 0) return [];
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, maxVisiblePages]);

  const handleFilter = (filtered) => {
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePrevGroup = useCallback(() => setCurrentPage(prev => Math.max(1, prev - maxVisiblePages)), [maxVisiblePages]);
  const handleNextGroup = useCallback(() => setCurrentPage(prev => Math.min(totalPages, prev + maxVisiblePages)), [maxVisiblePages, totalPages]);

  const handleadd = () => {
    setAddRegister(true);
  }

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setIsEditing(true);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setFilteredData((prevData) =>
        prevData.map((item) =>
            item.identificacion === updatedRecord.identificacion ? updatedRecord : item
        )
    );
  };

  const handleCheckClick = (record) => {
    let permitUser = aditionalData.filter(item => item.usuario_id === record.usuario_id).map(item => ({
      identificacion: record.identificacion,
      acceso: item.permits_id,
      estado: item.estado,
      fech_auth: item.fech_auth
    }));
    if (permitUser.length === 0) {
      permitUser = [{ identificacion: record.identificacion, acceso: "" }];
    }
    setCurrentRecord(permitUser);
    setIsChecking(true);
  };

  const handleDelete = (recordDelete) => {
    setDelete(true);
    setCurrentRecord(recordDelete);
  };

  const confirmDelete = async (event) => {
    event.preventDefault();
    if (!currentRecord?.identificacion) return;
    setDelete(false);
    const res = await deleteRegister(currentRecord.identificacion, selectTable);
    if ([200, 204].includes(res.status)) {
      setFilteredData(prevData => prevData.filter(item => item.identificacion !== currentRecord.identificacion));
      setCurrentRecord("");
    }
  };

  const handleAddRecord = async (updatedData) => {
    setFilteredData(updatedData);
  };

  return (
    <>
      {addRegister ? (
        {
          "/home/user": (
            <RegisterUser
              isOpen={addRegister}
              closeOpen={() => setAddRegister(false)}
              onAddRecord={handleAddRecord}
            />
          ),
          "/home/user/entities": (
            <RegisterEntity
              isOpen={addRegister}
              closeOpen={() => setAddRegister(false)}
              onAddRecord={handleAddRecord}
            />
          ),
        }[location] || null
      ) : null}
      {isEditing && currentRecord && <EditRecord data={currentRecord} role={rol} state={isEditing} closeModal={() => { setIsEditing(false); setCurrentRecord(null); }} editTitle={editTitle} onUpdateRecord={handleUpdateRecord} />}
      {isChecking && currentRecord && <AddRecordPermits data={currentRecord} role={rol} state={isChecking} closeModal={() => { setIsChecking(false); setCurrentRecord(null); }} />}
      {isDelete && (<AlertPopup className={`contain ${isDelete ? 'overlay-delete' : ''}`}
                  message={`Estas seguro de eliminar a: ${currentRecord.nombre}`} type={"info"}>
                    <div className="alert-buttons">
                      <button className="alert-button delete-button" onClick={confirmDelete}>Eliminar</button>
                      <button className="alert-button cancel-button" onClick={() => {setDelete(false), setCurrentRecord("")}}>
                        Cancelar</button>
                    </div>
                    </AlertPopup>)}
      <div className="container">
        <div className="header">
          <div className="title-search">
            <h1>{title}</h1>
            <Search data={data} keysToSearch={keysToSearch} onFilteredData={handleFilter} />
          </div>
        </div>
        {isNewRegister && <div className="new-register">
          <span onClick={handleadd}>Nuevo Registro</span>
        </div>}
        {filteredData.length === 0 ? (
          <div className="loading-message">No hay datos disponibles...</div>
        ) : (
          <>
            <table className="responsive-table">
              <thead>
                <tr>
                  {headers.map((header, index) => <th key={index}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {fields.map((field, colIndex) => <td key={colIndex} data-label={headers[colIndex]}>{field === "num" ? rowIndex + 1 : item[field] || "N/A"}</td>)}
                    {isAction && (
                      <td className="actions">
                        <Edit className="edit-icon" onClick={() => handleEditClick(item)} aria-label="Editar">
                          <span className="tooltip">Editar</span>
                        </Edit>
                        {isPermit && <ShieldCheck className="check-icon" onClick={() => handleCheckClick(item)} aria-label="Ver permisos" />}
                        {["Administrador", "Supervisor"].includes(rol) && (
                          <TrashIcon className="delete-icon" onClick={() => handleDelete(item)} aria-label="Eliminar"/>)}
                        {children}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={handlePrevGroup}>Anterior</button>
          {getPageRange.map(page => <button key={page} className={page === currentPage ? "active" : ""} onClick={() => setCurrentPage(page)}>{page}</button>)}
          <button disabled={currentPage === totalPages} onClick={handleNextGroup}>Siguiente</button>
        </div>
      </div>
    </>
  );
};

export default ResultTable;