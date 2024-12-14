import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistreerBedrijf.css';
import React from 'react';
import axios from "axios";
import logo from '../assets/CarAndAll Logo.webp';

function RegistreerBedrijf() {
    const navigate = useNavigate();

    const Inloggen = () => {
        navigate("./InlogPagina");
    };

    const Registreer = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const wachtwoord = formData.get('wachtwoord');
        /*const herhaalWachtwoord = formData.get('herhaalWachtwoord');
        */const bedrijfsnaam = formData.get('bedrijfsnaam');
        const kvkNummer = formData.get('kvkNummer');
        const postcode = formData.get('postcode');
        const huisnummer = formData.get('huisnummer');
        const maxMedewerkers = formData.get('maxMedewerkers');
        const maxVoertuigen = formData.get('maxVoertuigen');


        // Controleer of de wachtwoorden overeenkomen
        /*if (wachtwoord !== herhaalWachtwoord) {
            alert('Wachtwoorden komen niet overeen. Probeer het opnieuw.');
            return;
        }*/

        // Verzamel de data in een object om te verzenden
        const BedrijfsData = {
            kvkNummer: kvkNummer,
            bedrijfsnaam: bedrijfsnaam,
            postcode: postcode,
            huisnummer: huisnummer,
            maxMedewerkers: maxMedewerkers,
            maxVoertuigen: maxVoertuigen
        };

        const AccountData = {
            email: email,
            wachtwoord: wachtwoord
        }
        const requestBody = {
            Bedrijf: BedrijfsData,
            Beheerder: AccountData,
        };

        try {
            // Verstuur het POST-verzoek naar de backend
            const response = await fetch('https://localhost:44318/api/Bedrijf/MaakBedrijf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            // Als de request succesvol is
            if (response.ok) {
                // Als de request succesvol is
                console.log('Account succesvol aangemaakt');
                alert('Account succesvol aangemaakt!');
                navigate('HoofdschermZakelijk');
            } else {
                // Als de request niet succesvol is (bijvoorbeeld BadRequest)
                const errorMessage = await response.text(); // Krijg de tekst van de foutmelding
                alert(`Fout: ${errorMessage}`);
            }
        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
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
                    <label htmlFor="Bedrijfsnaam">Bedrijfsnaam:</label>
                    <input type="bedrijfsnaam" id="bedrijfsnaam" name="bedrijfsnaam" required
                           placeholder="Vul je bedrijfsnaam in..."/>
                </div>

                <div>
                    <label htmlFor="email">Beheerder Emailadres:</label>
                    <input type="email" id="email" name="email" required placeholder="Vul je emailadres in..."/>
                </div>

                <div>
                    <label htmlFor="wachtwoord">Wachtwoord:</label>
                    <input type="password" id="wachtwoord" name="wachtwoord" required
                           placeholder="(minimaal 8 karakters)" minLength="8"/>
                </div>

                {/*<div>
                    <label htmlFor="herhaalWachtwoord">Herhaal wachtwoord:</label>
                    <input type="password" id="herhaalWachtwoord" name="herhaalWachtwoord" required
                           placeholder="Vul je wachtwoord in..." minLength="8"/>
                </div>*/}

                <div>
                    <label htmlFor="kvkNummer">KVK-nummer:</label>
                    <input type="text" id="kvkNummer" name="kvkNummer" required
                           placeholder="Vul je KVK-nummer in..."/>
                </div>

                <div>
                    <label htmlFor="postcode">Postcode:</label>
                    <input type="text" id="postcode" name="postcode" required
                           placeholder="Vul je postcode in..."/>
                </div>

                <div>
                    <label htmlFor="huisnummer">Huisnummer:</label>
                    <input type="text" id="huisnummer" name="huisnummer" required
                           placeholder="Vul je huisnummer in..."/>
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
            </form>
        </div>
    );
}

export default RegistreerBedrijf;
