import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HoofdschermParticulier.css';
import logo from '../assets/CarAndAll_Logo.webp';
import { useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken

//Nieuw
function HoofdschermParticulier() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const [accountNaam, setAccountNaam] = useState('');

    useEffect(() => {
        if (currentAccountId < 1) {
            alert("U bent niet correct ingelogd. U wordt teruggestuurd naar de inlogpagina");
            navigate('/inlogpagina');
        }
        KrijgNaam();
    }, [currentAccountId, navigate]);

    const AutoHuren = () => {
        navigate('/VoertuigenSelectie');
    };

    const MijnReservering = () => {
        navigate('MijnReserveringen');
    };

    const MijnProfiel = () => {
        navigate('/ProfielPagina');
    };

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };

    const AccountVerwijderen = async () => {
        try {
            const response = await fetch(`https://localhost:44318/api/Particulier/VerwijderParticulier?id=${currentAccountId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                console.log('Account succesvol verwijderd');
                alert('Account succesvol verwijderd!');
                navigate('/InlogPagina');
            } else {
                throw new Error('Er is iets misgegaan bij het verwijderen van het account');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het verwijderen van het account! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };

    const KrijgNaam = async () => {
        try {
            const response = await fetch(`https://localhost:44318/api/ZakelijkBeheerder/KrijgSpecifiekAccount?id=${currentAccountId}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setAccountNaam(data.naam);
            } else {
                throw new Error('Er is iets misgegaan bij het ophalen van de accountnaam');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het ophalen van de accountnaam! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };

    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>
            <h1>Welkom {accountNaam}</h1>
            <h2>Wat wil je vandaag doen?</h2>
            <button onClick={AutoHuren}>Auto huren</button>
            <button onClick={MijnReservering}>Mijn reserveringen</button>
            <button onClick={MijnProfiel}>Mijn profiel</button>
            <button onClick={AccountVerwijderen} className="fetusDeletus">Verwijder account</button>
            <button className="logout-button" onClick={LogUit}>Log uit</button>
        </div>
    );
}

export default HoofdschermParticulier;
