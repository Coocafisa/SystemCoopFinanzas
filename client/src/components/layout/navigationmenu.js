"use client";
import PropTypes from "prop-types";
import { useState } from "react";
import "@public/styles/menu.css";
import { logout } from "@/api/requestAuth/logout";
import { Loader } from "@/components/common/preloader";
import Link from "next/link";
import { useAlertState } from "../utils/alertState";

export default function Menu({ menuOptions }) {
  const { alert, setAlert, type, setType, loading, setLoading } = useAlertState();

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
                <Link href={option.link} className="menu-link">
                  <i className={`menu-icon ${option.icon}`}></i>
                  <span className="menu-label">{option.label}</span>
                </Link>
              </li>
            ))}
             <li className="menu-item menu-link">
                <i className="menu-icon bi bi-box-arrow-right"></i>
                <span className="menu-label logout" onClick={handleSubmit}>Cerrar Sesión</span>
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
