'use client';
import "@styles/error.css"

export default function Error({ error, reset }) {
  return (
    <div className="notification-message">
  <h2>
    Estamos experimentando una interrupción temporal en el servicio. 
    <br/> Nuestro equipo está trabajando diligentemente para restaurarlo a la brevedad posible. 
    <br/> Agradecemos tu comprensión y paciencia durante este inconveniente.
  </h2>
</div>
  );
}