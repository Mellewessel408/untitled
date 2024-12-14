import {useNavigate} from 'react-router-dom';
import {AccountProvider} from "./Login/AccountProvider.jsx";

function HoofdschermZakelijk() {
    const navigate = useNavigate();

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
            // Verstuur het POST-verzoek naar de backend en wacht op het antwoord
            const response = await fetch('https://localhost:44318/api/Bedrijf/VerwijderBedrijf?id=' + AccountProvider.currentAccountId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            // Controleer of het verzoek succesvol was
            if (response.ok) {
                console.log('Bedrijf succesvol verwijderd');
                alert('Bedrijf succesvol verwijderd!');
                navigate('/InlogPagina');
            } else {
                // Haal de foutmelding op en toon deze
                const errorMessage = await response.text();
                alert(`Fout: ${errorMessage}`);
            }
        } catch (error) {
            // Foutafhandeling
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het verwijderen van het bedrijf! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };



    return (
        <div>
            <h1>Welkom</h1>
            <h2>Wat wil je vandaag doen</h2>
            <button onClick={VoertuigenOverzicht}></button>
            <button onClick={MedewerkersBeheren}></button>
            <button onClick={AbbonementsBeheer}></button>
            <button onClick={VerhuurActiviteiten}></button>
            <button onClick={BedrijfVerwijderen}></button>
        </div>
    );

}
export default HoofdschermZakelijk;