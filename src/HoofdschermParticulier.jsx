import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HoofdschermParticulier.css';
import logo from '../src/assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "./Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken

function HoofdschermParticulier() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });

    const AutoHuren = () => {
        navigate('/VoertuigenSelectie');
    };

    const MijnReservering = () => {
        // Voeg actie toe voor MijnReservering als dat nodig is
    };

    const MijnProfiel = () => {
        navigate('/ProfielParticulier');
    };

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };

    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>
            <h1>Welkom</h1>
            <h2>Wat wil je vandaag doen?</h2>
            <button onClick={AutoHuren}>Auto huren</button>
            <button onClick={MijnReservering}>Mijn reserveringen</button>
            <button onClick={MijnProfiel}>Mijn profiel</button>
            <button className="logout-button" onClick={LogUit}>Log uit</button>
        </div>
    );
}

export default HoofdschermParticulier;
