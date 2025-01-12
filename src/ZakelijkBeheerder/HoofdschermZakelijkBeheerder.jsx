import {useNavigate} from 'react-router-dom';
import '../styles/HoofdschermParticulier.css';
import {AccountProvider, useAccount} from "../Login/AccountProvider.jsx";
import React, {useEffect, useState} from "react";
import VoegMedewerkerToe from "./VoegMedewerkerToe.jsx";

function HoofdschermZakelijkBeheerder() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const [accountNaam, setAccountNaam] = useState('');
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId")
            navigate('/inlogpagina');
        }
        const fetchNaam = async () => {
            await KrijgNaam();

        };
        fetchNaam();
    }, [currentAccountId, navigate]);


    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };

    const VoertuigenOverzicht = async () => {
        navigate("VoertuigOverzicht");
    };
    const KrijgNaam = async () => {
        try {
            const response = await fetch(`https://localhost:44318/api/ZakelijkBeheerder/KrijgAccountemail?accountId=${currentAccountId}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });

            if (response.ok) {
                const data = await response.text();
                console.log(data);
                setAccountNaam(data);
            } else {
                throw new Error('Er is iets misgegaan bij het ophalen van de accountnaam');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het ophalen van de accountnaam! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };
    const MedewerkersBeheren = () => {
        navigate('MedewerkersBeheren')
    }
    const AbonnementWijzigen = () => {
        navigate('AbonnementWijzigen')
    }
    const VerhuurActiviteiten = () => {

    }

    const BedrijfVerwijderen = async () => {
        try {
            // Verstuur het DELETE-verzoek naar de backend en wacht op het antwoord
            const response = await fetch(`https://localhost:44318/api/Bedrijf/VerwijderBedrijf?id=${currentAccountId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                // Controleer of het verzoek succesvol was
                console.log('Bedrijf succesvol verwijderd');
                alert('Bedrijf succesvol verwijderd!');
                navigate('/InlogPagina');
            } else {
                throw new Error('Er is iets misgegaan bij het verwijderen van het bedrijf');
            }
        } catch (error) {
            // Foutafhandeling
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het verwijderen van het bedrijf! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };




    return (
        <div className="hoofdscherm-container">
            <h2>Welkom, {accountNaam}!</h2>
            <h2>Wat wil je vandaag doen</h2>
            <button onClick={VoertuigenOverzicht}>Voertuigen overzicht</button>
            <button onClick={MedewerkersBeheren}>Medewerkers beheren</button>
            <button onClick={AbonnementWijzigen}> Wijzig Abonnement</button>
            <button onClick={VerhuurActiviteiten}>Verhuur activiteiten</button>
            <button onClick={BedrijfVerwijderen} className="fetusDeletus">Het Bedrijf Verwijderen</button>
            <button className="logout-button" onClick={LogUit}>Log uit</button>
        </div>
    );

}

export default HoofdschermZakelijkBeheerder;