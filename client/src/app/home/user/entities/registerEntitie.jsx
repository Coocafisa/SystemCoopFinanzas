"use client";
import { addEntity } from "@/api/requestAdmin/registerService";
import { queryEntities } from "@/api/requestUsers/queryUsers";
import ModalContent from "@/components/common/modal-content";
import useForm from "@/hooks/useForm";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function RegisterEntity({ isOpen, closeOpen, onAddRecord }) {
  const { formValues, message, handleChange, isValid } = useForm({
    nit: "",
    nombre: "",
    correo: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await addEntity(formValues);
    if (result.status === 200) {
      const updatedData = await queryEntities();
      onAddRecord(updatedData);
      closeOpen();
    }
  };

  return (
    <ModalContent modalTitle={"Registro de Entidades"} state={isOpen} closeModal={closeOpen}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="card">
          <label htmlFor="nit">Identificación:</label>
          <input
            type="number"
            name="nit"
            id="identificacion"
            value={formValues.nit}
            onChange={handleChange}
            aria-required="true"
            className="input-field"
          />
          <ErrorMessage message={message.nit} />
        </div>
        <div className="card">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={formValues.nombre}
            onChange={handleChange}
            aria-required="true"
            className="input-field"
          />
          <ErrorMessage message={message.nombre} />
        </div>
        <div className="card">
          <label htmlFor="correo">Correo:</label>
          <input
            type="text"
            name="correo"
            id="correo"
            value={formValues.correo}
            onChange={handleChange}
            aria-required="true"
            className="input-field"
          />
          <ErrorMessage message={message.correo} />
        </div>

        <div className="btn_butones">
          <button type="button" className="cancel-button" onClick={() => closeOpen(false)}>
            Cancelar
          </button>
          <button type="submit" className="btn_registrar" disabled={!isValid}>
            Registrar
          </button>
        </div>
      </form>
    </ModalContent>
  );
}