"use client";
import { useEffect, useState } from "react";
import { logout } from "@/api/requestServices/logout";
import { getSession } from "@/api/requestServices/sessionService";
import AlertPopup from "../common/alert";
import "@public/styles/alertInativity.css";
import { calculateCountdown } from "../utils/timerUtils";

export default function InactivityHandler() {
  const [sessionState, setSessionState] = useState("active");
  const [timer, setTimer] = useState({ minutes: "", seconds: "" });

  const expirationTime = async () => {
    try {
      const sessionData = await getSession();
      console.log("Tiempo de session: ", sessionData?.timeRemaining)
      if (sessionData?.timeRemaining ) {
        const { minutes, seconds } = sessionData.timeRemaining;
        setTimer({
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      } else {
        setTimer({ minutes: "00", seconds: "00" });
      }
    } catch (error) {
      setTimer({ minutes: "00", seconds: "00" });
    }
  };

  useEffect(() => {
    expirationTime();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer.minutes !== "00" || timer.seconds !== "00") {
        clearInterval(intervalId);
      } else if (timer.minutes === "01" && timer.seconds === "00") {
        return setSessionState("inactive");
      } else if (timer.minutes === "00" && timer.seconds === "00") {
        return setSessionState("expired");
      } else {
        return setTimer(calculateCountdown(timer.minutes, timer.seconds));
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer, sessionState]);

  const handleLogout = async (event) => {
    event.preventDefault();
    setSessionState(false);
    await logout(event);
  };

  return (
    <>
    { sessionState === "inactive" && (
      <div className="blocking-layer">
        <AlertPopup 
          message="Llevas mucho tiempo inactivo. ¿Deseas continuar navegando en la aplicación?"
          type="alertMessage"
          >
          <div className="alert_text">
            <p>La sesión expirará en:</p>
            </div>
            <div className="timer-container" aria-live="polite">
              <div className="time-box" role="timer">
                <span id="minutes">{timer.minutes}</span>
                <span className="label">Minutos</span>
              </div>
              <div className="time-box" role="timer">
                <span id="seconds">{timer.seconds}</span>
                <span className="label">Segundos</span>
              </div>
            </div>
            <div className="btn_alert">
              <button onClick={handleLogout}>No</button>
              <button onClick={() => setSessionState("active")}>Sí</button>
            </div>
          </AlertPopup>
      </div>
    )}
    { sessionState === "expired" && (
      <div className="blocking-layer">
        <AlertPopup
          message="Has tardado mucho. Vuelve a iniciar sesión para continuar navegando."
          >
          <button onClick={handleLogout}>Aceptar</button>
          </AlertPopup>
      </div>
      )}
    </>
  );
}