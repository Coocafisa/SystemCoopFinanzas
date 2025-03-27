"use client";
import React, { useState, useEffect } from "react";
import "@styles/table.css";
import Search from "./search";
import { Edit, TrashIcon, ShieldCheck } from "lucide-react";
import EditRecord from "./edit_record";
import AlertPopup from "./alert";
import { deleteRegister } from "@/api/requestServices/generalServices";
import { AddRecordPermits } from "../../app/home/user/managment-permits";
import RegisterUser from "@/app/home/user/registerUser";
import { usePathname } from "next/navigation";
import RegisterEntity from "@/app/home/user/entities/registerEntitie";
import usePagination from "@/hooks/usePagination";
import useModal from "@/hooks/useModal";
import getRolePermissions from "../middleware/permits-actions";

const ResultTable = ({ data = [], resfreshData, keysToSearch, title, headers = [], fields = [], isAction, rol = "None", editTitle, selectTable, aditionalData = [], children, isPermit, isNewRegister }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [addRegister, setAddRegister] = useState(false);
  const [permitsData, setPermitsData] = useState([]);
  const location = usePathname();
  const { canEdit, canDelete, canCheck, canAddRegister } = getRolePermissions(rol);

  const {
    currentPage,
    totalPages,
    paginatedData,
    getPageRange,
    handlePrevGroup,
    handleNextGroup,
    setCurrentPage,
  } = usePagination(filteredData, 10, 4);

  const {
    isOpen: isEditing,
    currentRecord: editingRecord,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const {
    isOpen: isChecking,
    currentRecord: checkingRecord,
    openModal: openCheckModal,
    closeModal: closeCheckModal,
  } = useModal();

  const {
    isOpen: isDelete,
    currentRecord: deleteRecord,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  useEffect(() => {
    if (data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);

  useEffect(() => {
    if (aditionalData.length > 0) {
      setPermitsData(aditionalData);
    }
  }, [aditionalData]);

  const handleFilter = (filtered) => {
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleEditClick = (record) => {
    openEditModal(record);
  };

  const handleCheckClick = (record, dataPermits) => {
    let permitUser = dataPermits.filter(item => item.usuario_id === record.usuario_id).map(item => ({
      ...item,
      identificacion: record.identificacion,
    }));
    if (permitUser.length === 0) {
      permitUser = [{ identificacion: record.identificacion, acceso: "", usuario_id: record.usuario_id }];
    }
    openCheckModal(permitUser);
  };

  const handleUpdatePermits = (updatedPermits) => {
    const dataUser = updatedPermits.credentials;
    const permits = updatedPermits.permits;
    setPermitsData(permits);
    handleCheckClick(dataUser, permits);
  };

  const confirmDelete = async (event) => {
    event.preventDefault();
    if (!deleteRecord?.identificacion) return;
    closeDeleteModal();
    const res = await deleteRegister(deleteRecord.identificacion, selectTable);
    if ([200, 204].includes(res.status)) {
      resfreshData();
    }
  };

  return (
    <>
      {addRegister && canAddRegister ? (
        {
          "/home/user": (
            <RegisterUser
              isOpen={addRegister}
              closeOpen={() => setAddRegister(false)}
              onAddRecord={resfreshData}
            />
          ),
          "/home/user/entities": (
            <RegisterEntity
              isOpen={addRegister}
              closeOpen={() => setAddRegister(false)}
              onAddRecord={resfreshData}
            />
          ),
        }[location] || null
      ) : null}
      {isEditing && editingRecord ? <EditRecord data={editingRecord} role={rol} state={isEditing} closeModal={closeEditModal} editTitle={editTitle} onUpdateRecord={resfreshData} /> : null}
      {isChecking && checkingRecord ? <AddRecordPermits data={checkingRecord} role={rol} state={isChecking} onUpdateData={handleUpdatePermits} closeModal={closeCheckModal} /> : null}
      {isDelete && deleteRecord && (
        <AlertPopup className={`contain ${isDelete ? 'overlay-delete' : ''}`}
                    message={`Estas seguro de eliminar a: ${deleteRecord.nombre}`} type={"info"}>
          <div className="alert-buttons">
            <button className="alert-button delete-button" onClick={confirmDelete}>Eliminar</button>
            <button className="alert-button cancel-button" onClick={closeDeleteModal}>Cancelar</button>
          </div>
        </AlertPopup>
      )}
      <div className="container">
        <div className="header">
          <div className="title-search">
            <h1>{title}</h1>
            <Search data={data} keysToSearch={keysToSearch} onFilteredData={handleFilter} />
          </div>
        </div>
        {isNewRegister && <div className="new-register">
          <span onClick={() => setAddRegister(true)}>Nuevo Registro</span>
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
                        { canEdit ? (<Edit className="edit-icon" onClick={() => handleEditClick(item)} aria-label="Editar"></Edit>) : null}
                        {isPermit && canCheck ? (<ShieldCheck className="check-icon" onClick={() => handleCheckClick(item, permitsData)} aria-label="Ver permisos" />) : null}
                        {canDelete ? (
                          <TrashIcon className="delete-icon" onClick={() => openDeleteModal(item)} aria-label="Eliminar"/>): null}
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
