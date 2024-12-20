import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './HoofdschermFrontoffice.css';
import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken

function AbonnementGoedkeuren() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });


    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };

    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>
            <h1>Abonnementen Goedkeuren</h1>



            <button className="logout-button" onClick={LogUit}>Log uit</button>
        </div>
    );
}

export default AbonnementGoedkeuren;
