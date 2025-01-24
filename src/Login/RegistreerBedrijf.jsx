import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistreerBedrijf.css';
import React from 'react';
import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "./AccountProvider.jsx";

function RegistreerBedrijf() {
    const navigate = useNavigate();
    const { login } = useAccount();
    const [abonnement, setAbonnement] = useState("PayAsYouGo");

    const InlogPagina = () => {
        navigate("/InlogPagina");
    };

    const Registreer = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const wachtwoord = formData.get('wachtwoord');
        const bedrijfsnaam = formData.get('bedrijfsnaam');
        const domeinnaam = formData.get('Domeinnaam');
        const kvkNummer = formData.get('kvkNummer');
        const postcode = formData.get('postcode');
        const huisnummer = formData.get('huisnummer');
        const maxMedewerkers = formData.get('maxMedewerkers');
        const maxVoertuigen = formData.get('maxVoertuigen');



        // Haal het domein van het e-mailadres op
        const emailDomein = email.split('@')[1]?.toLowerCase();
        console.log(domeinnaam);
        console.log(emailDomein);
        // Controleer of de bedrijfsnaam overeenkomt met het e-maildomein
         if (domeinnaam !== emailDomein) {
             alert("Domeinnaam en E-mailadres komen niet overeen, probeer opnieuw.");
             return;
        }

        // Verzamel de data in een object om te verzenden
        const BedrijfsData = {
            kvkNummer: kvkNummer,
            domeinnaam: domeinnaam,
            bedrijfsnaam: bedrijfsnaam,
            postcode: postcode,
            huisnummer: huisnummer
        };

        const AccountData = {
            email: email,
            wachtwoord: wachtwoord
        };

        const AbonnementData = {
            abonnementType: abonnement,
            maxMedewerkers: maxMedewerkers,
            maxVoertuigen: maxVoertuigen
        };

        const requestBody = {
            Bedrijf: BedrijfsData,
            Beheerder: AccountData,
            Abonnement: AbonnementData
        };

        try {
            // Verstuur het POST-verzoek naar de backend en wacht op het antwoord
            const response = await fetch('https://localhost:44318/api/Bedrijf/MaakBedrijf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                // Als de request succesvol is
                console.log("Object terughalen voor AccountId");
                const IdResponse = await fetch('https://localhost:44318/api/ZakelijkBeheerder/KrijgSpecifiekAccountEmail?email=' + email);
                const IdData = await IdResponse.json();
                if (IdData?.accountId) {
                    login(IdData.accountId); // Account-ID instellen vanuit de response
                }
                console.log('Account succesvol aangemaakt');
                navigate('/HoofdschermZakelijkBeheerder');
            } else {
                // Als de request niet succesvol is (bijvoorbeeld BadRequest)
                const errorMessage = await response.text(); // Krijg de tekst van de foutmelding
                alert(`Fout: ${errorMessage}`);
            }
        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het registreren! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };

    return (
        <div className="container">
            <div className="Centreren">
                <img className="logo" src={logo} alt="Carandall Logo"/>
            </div>
            <h1>Registreer Bedrijf</h1>
            <form onSubmit={Registreer}>
                <div>
                    <label htmlFor="bedrijfsnaam">Bedrijfsnaam:</label>
                    <input type="text" id="bedrijfsnaam" name="bedrijfsnaam" required
                           placeholder="Vul je bedrijfsnaam in..."/>
                </div>

                <div>
                    <label htmlFor="email">Beheerder Emailadres:</label>
                    <input type="email" id="email" name="email" required placeholder="Vul je emailadres in..."/>
                </div>

                <div>
                    <label htmlFor="Domeinnaam">Domeinnaam: (bijv. gmail.com)</label>
                    <input type="text" id="Domeinnaam" name="Domeinnaam" required placeholder="Vul je domeinnaam in..."/>
                </div>

                <div>
                    <label htmlFor="wachtwoord">Wachtwoord:</label>
                    <input type="password" id="wachtwoord" name="wachtwoord" required
                           placeholder="(minimaal 8 karakters)" minLength="8"/>
                </div>

                <div>
                    <label htmlFor="kvkNummer">KVK-nummer:</label>
                    <input type="text" id="kvkNummer" name="kvkNummer" required placeholder="Vul je KVK-nummer in..."/>
                </div>

                <div>
                    <label htmlFor="postcode">Postcode:</label>
                    <input type="text" id="postcode" name="postcode" required placeholder="Vul je postcode in..."/>
                </div>

                <div>
                    <label htmlFor="huisnummer">Huisnummer:</label>
                    <input type="text" id="huisnummer" name="huisnummer" required
                           placeholder="Vul je huisnummer in..."/>
                </div>

                <div>
                    <label htmlFor="typeAbonnement">Type Abonnement:</label>
                    <select id="typeAbonnement" value={abonnement} onChange={(e) => setAbonnement(e.target.value)}>
                        <option value="PayAsYouGo">Pay-As-You-Go</option>
                        <option value="UpFront">UpFront</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="maxVoertuigen">Max voertuigen:</label>
                    <input type="text" id="maxVoertuigen" name="maxVoertuigen" required
                           placeholder="Vul je maximale voertuigen in..."/>
                </div>

                <div>
                    <label htmlFor="maxMedewerkers">Max Medewerkers:</label>
                    <input type="text" id="maxMedewerkers" name="maxMedewerkers" required
                           placeholder="Vul je maximale medewerkers in..."/>
                </div>

                <button type="submit">Registreer Bedrijf</button>
                <button onClick={InlogPagina}>inloggen</button>
            </form>
        </div>
    );
}

export default RegistreerBedrijf;
