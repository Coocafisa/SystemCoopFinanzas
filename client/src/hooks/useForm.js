import { useState, useEffect } from "react";
import { ValidateInput } from "@/components/utils/helpers";

export default function useForm(initialValues) {
  const [formValues, setFormValues] = useState(initialValues);
  const [message, setMessage] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(Object.entries(formValues).every(([key, value]) => value !== "" && !message[key]));
  }, [formValues, message]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    if (Array.isArray(formValues)) {
      setFormValues((prev) => {
        const updatedFormValues = [...prev];
        updatedFormValues[index] = { ...updatedFormValues[index], [name]: value };
        ValidateInput(event, setMessage, updatedFormValues[index]);
        return updatedFormValues;
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
      ValidateInput(event, setMessage, formValues);
    }
  };

  return {
    formValues,
    message,
    handleChange,
    isValid,
    setFormValues,
  };
}
