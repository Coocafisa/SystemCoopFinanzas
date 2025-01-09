"use client";
import PropTypes from "prop-types";
import { useState } from "react";
import "@public/styles/menu.css";
import { logout } from "@/api/auth/authService";
import { Loader } from "@/components/common/preloader";

export default function Menu({ menuOptions }) {
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await logout(event, setAlert, setType, setLoading);
  };

  return (
    <>
    {loading && <Loader alert={alert} type={type}/>}
    <div className="menu">
        <nav className='menu-container'>
          <ul className="menu-list">
            {menuOptions.map((option) => (
              <li key={option.id} className="menu-item">
                <a href={option.link} className="menu-link">
                  <i className={`menu-icon ${option.icon}`}></i>
                  <span className="menu-label">{option.label}</span>
                </a>
              </li>
            ))}
             <li className="menu-item">
              <form onSubmit={handleSubmit}>
                <button type="submit" className="logout-button">Cerrar Sesión</button>
              </form>
            </li>
          </ul>
        </nav>
    </div>
    </>
  );
}

Menu.propTypes = {
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
};
