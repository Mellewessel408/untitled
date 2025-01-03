import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './HoofdschermFrontoffice.css';
import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken

function HoofdschermBackoffice() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });

    const BedrijfsAbonnement = () => {
        navigate('/BedrijfsabbonomentenGoedkeuren');
    };
    const VerhuurAanvraag = () => {
        navigate('VerhuurAanvragen');
    }
    const SchademeldingenBekijken = () => {
        navigate('Schademeldingen');
    }

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };

    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>
            <h1>Welkom</h1>
            <h2>Wat wil je vandaag doen?</h2>
            <button onClick={BedrijfsAbonnement}>BedrijfsAbonnementen</button>
            <button onClick={VerhuurAanvraag}>VerhuurAanvragen</button>
            <button onClick={SchademeldingenBekijken}>Schademeldingen</button>
            <button className="logout-button" onClick={LogUit}>Log uit</button>
        </div>
    );
}

export default HoofdschermBackoffice;
