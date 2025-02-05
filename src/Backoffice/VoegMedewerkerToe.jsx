import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import '.Login/Registreren.css';
import React from 'react';
import logo from '../assets/CarAndAll_Logo.webp';
//import {AccountProvider, useAccount} from "./AccountProvider.jsx";
function VoegmedewerkerToe() {
    const navigate = useNavigate();

    const VoegNieuweMedewerker = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const type = formData.get('soortmedewerker');
        const email = formData.get('email');
        const wachtwoord = formData.get('wachtwoord');
        const herhaalWachtwoord = formData.get('herhaalWachtwoord');

        if (wachtwoord !== herhaalWachtwoord) {
            alert('Wachtwoorden komen niet overeen. Probeer het opnieuw.');
            return;
        }


        const data = {
            email: email,
            wachtwoord: wachtwoord
        };


        try {

            const url = new URL(`https://localhost:44318/api/${type}/MaakAccount`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Data moet een JSON-object zijn
            });

        } catch (error) {
            console.error('Fout bij het versturen van het verzoek:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
        }
        document.getElementById('form').reset();
    }

    return (
        <div className="container">
            <div className="Centreren">
                <img className="logo" src={logo} alt="Carandall Logo"/>
            </div>
            <h1>Registreer Medewerker</h1>
            <form id="form" onSubmit={VoegNieuweMedewerker}>
                <div>
                    <label htmlFor="email">Emailadres:</label>
                    <input type="email" id="email" name="email" required placeholder="Vul het emailadres in..."/>
                </div>

                <div>
                    <label htmlFor="wachtwoord">Wachtwoord: </label>
                    <input type="password" id="wachtwoord" name="wachtwoord" required
                           placeholder="(minimaal 8 karakters)" minLength="8"/>
                </div>

                <div>
                    <label htmlFor="herhaalWachtwoord">Herhaal wachtwoord:</label>
                    <input type="password" id="herhaalWachtwoord" name="herhaalWachtwoord" required
                           placeholder="Herhaal het wachtwoord..." minLength="8"/>
                </div>
                <div>
                    <label htmlFor="SoortMedewerker">Medewerker:</label>
                    <select id="soortmedewerker" name="soortmedewerker" required>
                        <option value="Backoffice">Backoffice-Medewerker</option>
                        <option value="Frontoffice">Frontoffice-Medewerker</option>
                    </select>
                </div>

                <button type="submit">Registreer medewerker</button>
            </form>
        </div>

    );
}

export default VoegmedewerkerToe;