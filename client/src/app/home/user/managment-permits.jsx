import "@styles/elements.css";
import { useState, useEffect } from "react";
import { Message } from "../../../components/utils/helpers";
import {
  deletePermits,
  updateRegister,
} from "@/api/requestServices/generalServices";
import {
  selectOptions,
  rolePermissions,
  selectFields,
  renamedLabels,
} from "@/components/utils/validationData";
import { addPermit } from "@/api/requestAdmin/servicesAdmin";
import ModalContent from "../../../components/common/modal-content";
import useForm from "@/hooks/useForm";
import { EditIcon, Trash2Icon } from "lucide-react";
import AlertPopup from "../../../components/common/alert";
import { queryPermits } from "@/api/requestUsers/queryUsers";

export function AddRecordPermits({
  data,
  role,
  state,
  onUpdateData,
  closeModal,
}) {
  const { formValues, message, handleChange, isValid, setFormValues } = useForm(
    []
  );
  const [newRegister, setNewRegister] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [currentRecord, setCurrentRecord] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [updatedValues, setUpdatedValues] = useState([]);

  const getFields = (fields) => {
    if (fields.length === 0) return [];
    return fields.map((item) => {
      let filteredItem = {
        identificacion: item.identificacion,
        acceso: item.permits_id || "",
        estado: item.estado,
        fech_auth: item.fech_auth,
        consec_permit: item.consec_permit,
      };
      return Object.fromEntries(
        Object.entries(filteredItem).filter(
          ([key, value]) =>
            key !== "consec_permit" && value !== null && value !== undefined
        )
      );
    });
  };

  useEffect(() => {
    setFormValues(getFields(data));
    setUpdatedValues(getFields(data));
    setIsEdited(new Array(data.length).fill(false));
  }, [data, setFormValues]);

  const handleChangeWithEdit = (e, index) => {
    const newValue = e.target.value;
    const originalValue = getFields(data)[index][e.target.name];
    handleChange(e, index);
    setUpdatedValues((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [e.target.name]: newValue };
      return updated;
    });
    setIsEdited((prev) => {
      const updated = [...prev];
      updated[index] = String(newValue) !== String(originalValue);
      return updated;
    });
  };

  const isEmptyObject = (obj) =>
    Object.values(obj).every(
      (value) => value === "" || value === null || value === undefined
    );

  const isFormDataEmpty =
    formValues.length === 0 ||
    formValues[0].acceso === "" ||
    formValues.every(isEmptyObject);

 async function updatedPermits() {
    const updatedData = await queryPermits();
      const newData = {
        credentials: {
          usuario_id: data[0].usuario_id,
          identificacion: data[0].identificacion,
        },
        permits: updatedData
    };
    onUpdateData(newData);      
  }
  const handleUpdateSave = async (index) => {
    const record = updatedValues[index];
    const originalRecord = getFields(data)[index];
    const updatedData = {}; 

    Object.keys(record).forEach((key) => {
      if (record[key] !== originalRecord[key]) {
        updatedData[key] = record[key];
      }
    });

    if (Object.keys(updatedData).length > 0) {
      const res = await updateRegister(updatedData, data[index].consec_permit);
      if (res.status === 200) {
        await updatedPermits();
        setIsEdited((prev) => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }
    }
  };

  const handleAddPermits = async () => {
    setNewRegister(true);
    const newData = [{ identificacion: data[0].identificacion, acceso: "" }];
    setFormValues(newData);
    setUpdatedValues(newData);
  };

  const SaveAddPermits = async () => {
    const updateFields = updatedValues[0];
    const newData = {
      acceso: updateFields.acceso,
      identificacion: updateFields.identificacion,
    };
    const res = await addPermit(newData);
    if (res.status === 200) {
      await updatedPermits();
      setNewRegister(false);
    }
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    if (newRegister) {
      setNewRegister(false);
    } else {
      closeModal();
    }
    setFormValues(getFields(data));
    setUpdatedValues(getFields(data));
  };

  const getAccessType = (accessNumber) => {
    const accessTypes = {
      1: "Administrador",
      2: "Supervisor",
      3: "Estandar",
    };
    return accessTypes[accessNumber] || "Desconocido";
  };

  const handleDelete = async (record) => {
    setCurrentRecord(data[record]);
    setDelete(true);
  };

  const confirmDelete = async () => {
    if (currentRecord) {
      const res = await deletePermits(currentRecord.consec_permit);
      if ([200, 204].includes(res.status)) {
        updatedPermits();
        setDelete(false);
        setCurrentRecord(null);
      }
    }
  };

  const cancelDelete = () => {
    setDelete(false);
    setCurrentRecord(null);
  };

  return (
    <ModalContent
      modalTitle={"Gestion, Permisos de Usuario"}
      state={state}
      closeModal={closeModal}
    >
      <div
        className={`permits-container ${
          !isFormDataEmpty && !newRegister ? "has-permits" : ""
        }`}
      >
        {isDelete && (
          <AlertPopup
            className={`contain ${isDelete ? "overlay-delete" : ""}`}
            message={`Estas seguro de eliminar el permiso de: ${getAccessType(
              currentRecord.permits_id
            )}`}
            type={"info"}
          >
            <div className="alert-buttons">
              <button
                className="alert-button delete-button"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
              <button
                className="alert-button cancel-button"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
            </div>
          </AlertPopup>
        )}
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
                      value={updatedValues[index][field] || ""}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        const parsedValue = isNaN(selectedValue) ? selectedValue : Number(selectedValue);
                        handleChangeWithEdit({ target: { name: field, value: parsedValue } }, index);
                      }}
                      disabled={
                        rolePermissions[role] &&
                        rolePermissions[role].includes(field)
                      }
                      className="input-field"
                    >
                      {selectOptions[field]?.map((option) => (
                        <option key={option.value} value={option.value || ""}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={updatedValues[index][field] || ""}
                      onChange={(e) => handleChangeWithEdit(e, index)}
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
              <div className="action-buttons">
                {!newRegister ? (
                  <>
                    <Trash2Icon
                      className="delete-icon"
                      onClick={() => handleDelete(index)}
                    />
                    <EditIcon
                      className={`edit-button ${
                        isEdited[index] ? "" : "disabled"
                      }`}
                      onClick={() => isEdited[index] && handleUpdateSave(index)}
                    />
                  </>
                ) : null}
              </div>
            </div>
          ))
        )}
        <div className="modal-footer">
          {!newRegister ? (
            <button className="btn-crear" onClick={handleAddPermits}>
              Crear
            </button>
          ) : (
            <button
              className="save-button"
              disabled={!isValid}
              onClick={SaveAddPermits}
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
