import "@styles/elements.css";
import { useState, useEffect } from "react";
import { Message } from "../utils/helpers";
import { updateRegister } from "@/api/requestServices/generalServices";
import {
  selectOptions,
  rolePermissions,
  selectFields,
  renamedLabels,
} from "@/components/utils/validationData";
import { addPermit } from "@/api/requestAdmin/servicesAdmin";
import ModalContent from "./modal-content";
import { isEqual } from "lodash";
import useForm from "@/hooks/useForm";

export function AddRecordPermits({ data, role, state, closeModal }) {
  const { formValues, message, handleChange, isValid, setFormValues } = useForm([]);
  const [newRegister, setNewRegister] = useState(false);
  const [isDelete, setDelete] = useState(false);

  useEffect(() => {
    setFormValues(Array.isArray(data) ? data : []);
  }, [data, setFormValues]);

  const isEmptyObject = (obj) =>
    Object.values(obj).every(
      (value) => value === "" || value === null || value === undefined
    );
  const isFormDataEmpty =
    formValues.length === 0 ||
    formValues[0].acceso === "" ||
    formValues.every(isEmptyObject);

  const updateFields = formValues.map((item, index) =>
    data[index]
      ? Object.keys(item).reduce((acc, key) => {
          const isSelect = selectFields.includes(key);
          const isDefaultValue = item[key] === "" || item[key] === "Select";
  
          if (!isEqual(String(item[key]), String(data[index]?.[key] || "")) && !(isSelect && isDefaultValue)) {
            acc[key] = item[key];
          }
          return acc;
        }, {})
      : {}
  );

  const handleSave = async () => {
    let res;
    if (newRegister) {
      const data = {
        acceso: updateFields[0].acceso,
        identificacion: formValues[0].identificacion,
      };
      res = await addPermit(data);
    } else {
      const data = {
        acceso: updateFields[0].acceso,
        estado: updateFields[0].estado,
      };
      res = await updateRegister(data, formValues[0]?.identificacion);
    }

    if (res.status === 200) {
      closeModal();
    }
  };

  const handleAddPermits = async () => {
    setNewRegister(true);
    const data = [
      { identificacion: formValues[0].identificacion, acceso: "" },
    ];
    setFormValues(data);
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    if (newRegister) {
      setNewRegister(false);
    } else {
      closeModal();
    }
    setFormValues(data)
  };

  return (
    <ModalContent
      modalTitle={"Gestion Permisos de Usuario"}
      state={state}
      closeModal={closeModal}
    >
      <div className={`permits-container ${!isFormDataEmpty && !newRegister ? 'has-permits' : ''}`}>
        {isDelete && (<AlertPopup className={`contain ${isDelete ? 'overlay-delete' : ''}`}
                          message={`Estas seguro de eliminar a: ${currentRecord.nombre}`} type={"info"}>
                            <div className="alert-buttons">
                              <button className="alert-button delete-button" onClick={confirmDelete}>Eliminar</button>
                              <button className="alert-button cancel-button" onClick={() => {setDelete(false), setCurrentRecord("")}}>
                                Cancelar</button>
                            </div>
                            </AlertPopup>)}
        {isFormDataEmpty && !newRegister ? (
          <div className="card">No hay registros</div>
        ) : (
          formValues.map((item, index) => (
            <div className="card" key={index}>
              {Object.keys(item).map((field) => (
                <div key={field} className="list-item">
                  <span className="label">
                    {renamedLabels[field] ||
                      field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  {selectFields.includes(field) ? (
                    <select
                      name={field}
                      value={item[field] || ""}
                      onChange={(e) => handleChange(e, index)}
                      disabled={
                        rolePermissions[role] &&
                        rolePermissions[role].includes(field)
                      }
                      className="input-field"
                    >
                      {selectOptions[field]?.map((option) => (
                        <option
                          key={option.value}
                          value={option.value || ""}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={item[field] || ""}
                      onChange={(e) => handleChange(e, index)}
                      disabled={
                        (rolePermissions[role] &&
                          rolePermissions[role].includes(field)) ||
                        "identificacion"
                      }
                      className="input-field"
                    />
                  )}
                  <Message text={message[field]} type="error-message" />
                </div>
              ))}
            </div>
          ))
        )}
        <div className="modal-footer">
          {!newRegister ? (
            <>
              <button className="btn-crear" onClick={handleAddPermits}>
                Crear
              </button>
              {!isFormDataEmpty && (
                <button
                  className="btn-edit"
                  disabled={
                    formValues.length === 0 ||
                    updateFields.every(
                      (fields) => Object.keys(fields).length === 0
                    ) ||
                    !isValid
                  }
                  onClick={handleSave}
                >
                  Editar
                </button>
              )}
            </>
          ) : (
            <button
              className="save-button"
              disabled={
                formValues.length === 0 ||
                updateFields.every(
                  (fields) => Object.keys(fields).length === 0
                ) ||
                !isValid
              }
              onClick={handleSave}
            >
              Guardar
            </button>
          )}
          <button className="cancel-button" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </ModalContent>
  );
}