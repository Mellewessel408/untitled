import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HoofdschermParticulier.css';
import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken

function HoofdschermZakelijkHuurder() {
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
        navigate('MijnReserveringen');
    };

    // const MijnProfiel = () => {
    //     navigate('/ProfielParticulier');
    // };

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };

    // const AccountVerwijderen = async () => {
    //     try {
    //         // Verstuur het DELETE-verzoek naar de backend en wacht op het antwoord
    //         const response = await fetch(`https://localhost:44318/api/Particulier/VerwijderParticulier?id=${currentAccountId}`, {
    //             method: 'DELETE',
    //             headers: { 'Content-Type': 'application/json' },
    //         });
    //
    //         if (response.ok) {
    //             // Controleer of het verzoek succesvol was
    //             console.log('Account succesvol verwijderd');
    //             alert('Account succesvol verwijderd!');
    //             navigate('/InlogPagina');
    //         } else {
    //             throw new Error('Er is iets misgegaan bij het verwijderen van het account');
    //         }
    //     } catch (error) {
    //         // Foutafhandeling
    //         console.error('Er is een fout opgetreden:', error.message);
    //         alert('Er is iets misgegaan bij het verwijderen van het account! Fout details: ' + JSON.stringify(error, null, 2));
    //     }
    // };

    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>
            <h1>Welkom</h1>
            <h2>Wat wil je vandaag doen?</h2>
            <button onClick={AutoHuren}>Auto huren</button>
            <button onClick={MijnReservering}>Mijn reserveringen</button>
            {/*<button onClick={MijnProfiel}>Mijn profiel</button>*/}
            {/*<button onClick={AccountVerwijderen} style={{ backgroundColor: 'red' }}>Verwijder account</button>*/}
            <button className="logout-button" onClick={LogUit}>Log uit</button>
        </div>
    );
}

export default HoofdschermZakelijkHuurder;
