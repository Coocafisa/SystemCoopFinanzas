"use client";
import React from "react";
import PropTypes from "prop-types";
import "@styles/modalContent.css";
import { X } from "lucide-react";

const ModalContent = ({ modalTitle, state, closeModal, children }) => {
  return (
    <div className={`modal-overlay ${state ? 'active' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button className="close-button" onClick={closeModal}>
            <X />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

ModalContent.propTypes = {
  modalTitle: PropTypes.string.isRequired,
  state: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ModalContent;
