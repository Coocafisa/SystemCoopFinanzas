import React, { useState, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "@styles/programhour.css";
import { timerEmails } from "@/api/requestAdmin/querysAdmin";
import { programmatEmails, resendEmails } from "@/api/requestAdmin/servicesAdmin";

const HoraForm = ({ btnEmails, ofAction }) => {
  const [hora, setHora] = useState("00");
  const [minuto, setMinuto] = useState("00");
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [disabled, setDisabled] = useState(false);
  const [newHour, setNewHour] = useState({ hora: "00", minuto: "00" });

  useEffect(() => {
    const getTime = async () => {
      const data = await timerEmails();
      setHora(data.hour);
      setMinuto(data.minute);
    };
    getTime();
  }, []);

  useEffect(() => {
    flatpickr("#hora-input", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i K",
      time_24hr: true,
      minuteIncrement: 5,
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        const newHour = String(date.getHours()).padStart(2, "0");
        const newMinute = String(date.getMinutes()).padStart(2, "0");
        setNewHour({ hora: newHour, minuto: newMinute });
      },
    });
  }, []);

  useEffect(() => {
    if (newHour.hora !== String(hora) || newHour.minuto !== String(minuto)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [newHour]);

useEffect(() => {
    const intervalTime = setInterval(() => {
      if (hora && minuto) {
        calculateCountdown(hora, minuto); 
      }
    }, 1000);

    return () => clearInterval(intervalTime);
  }, [hora, minuto]);

  const calculateCountdown = (hour, minute) => {
    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(hour || 0, minute || 0, 0, 0);

    if (now > targetTime) targetTime.setDate(targetTime.getDate() + 1);
    const countdown = targetTime - now;

    const hours = String(Math.floor((countdown / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((countdown / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((countdown / 1000) % 60)).padStart(2, "0");

    setTimer({ hours, minutes, seconds });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await programmatEmails(newHour.hora, newHour.minuto);
    if (result.status === 200) {
      setHora(newHour.hora);
      setMinuto(newHour.minuto);
      setDisabled(false);
    }
    calculateCountdown(newHour.hora, newHour.minuto);
  };

  const toggleFormVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleResend = async (event) => {
    event.preventDefault();
    await resendEmails();
  }

  const period = hora >= 12 ? "PM" : "AM";
const formattedHour = hora > 12 ? String(hora - 12).padStart(2, "0") : String(hora).padStart(2, "0");
const horaEnvio = `Hora Programada: ${formattedHour}:${minuto} ${period}`;

  return (
    <div>
      <div className="icon-container-clock" onClick={toggleFormVisibility}>
        <i className="bi bi-hourglass-top cursor-pointer"></i>
      </div>
      <div className={`form-container ${isVisible ? "show" : ""}`}>
        <div className="icon-container-close">
        <i className="bi bi-x-lg" onClick={toggleFormVisibility}></i> 
        </div> 
        <h2>Programar Correos</h2>
        <h4 className="next-send">{horaEnvio} </h4>
        <h3 className="next-send"> Tiempo para el envío: </h3>
        <div className="timer-container">
          <div className="time-box">
            <span id="hours">{timer.hours}</span>
            <span className="label">Horas</span>
          </div>
          <div className="time-box">
            <span id="minutes">{timer.minutes}</span>
            <span className="label">Minutos</span>
          </div>
          <div className="time-box">
            <span id="seconds">{timer.seconds}</span>
            <span className="label">Segundos</span>
          </div>
        </div>
        <form>
          <div className="form-group">
            <label htmlFor="hora-input">Hora:</label>
            <input
              type="text"
              id="hora-input"
              className="time-input"
              placeholder="Selecciona la hora"
            />
          </div>
        </form>
        <div className="group-btn-emails-clock">
          <button type="submit" className="btn-submit" disabled={!disabled} onClick={handleSubmit}>Guardar</button>
          { btnEmails ? <button className="btn-resend" disabled={!ofAction} onClick={handleResend}> Enviar Emails </button> : null }
          </div>
      </div>
    </div>
  );
};

export default HoraForm;