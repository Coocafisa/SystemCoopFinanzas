import { useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState([]);

  const openModal = (record) => {
    setCurrentRecord(record);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentRecord(null);
  };

  return {
    isOpen,
    currentRecord,
    openModal,
    closeModal,
  };
};

export default useModal;
