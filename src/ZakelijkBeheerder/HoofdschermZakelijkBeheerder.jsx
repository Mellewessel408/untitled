import {useNavigate} from 'react-router-dom';
import {AccountProvider, useAccount} from "../Login/AccountProvider.jsx";
import {useEffect} from "react";

function HoofdschermZakelijkBeheerder() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId")
            navigate('/inlogpagina');
        }
    })
    const VoertuigenOverzicht = () => {

    }
    const MedewerkersBeheren = () => {

    }
    const AbbonementsBeheer = () => {

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
        <div>
            <h2>Welkom, {currentAccountId}!</h2>
            <h2>Wat wil je vandaag doen</h2>
            <button onClick={VoertuigenOverzicht}></button>
            <button onClick={MedewerkersBeheren}></button>
            <button onClick={AbbonementsBeheer}></button>
            <button onClick={VerhuurActiviteiten}></button>
            <button onClick={BedrijfVerwijderen}> Het bedrijf verwijderen </button>
        </div>
    );

}

export default HoofdschermZakelijkBeheerder;