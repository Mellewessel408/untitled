import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistreerBedrijf.css';
import React from 'react';
import axios from "axios";
import logo from '../assets/CarAndAll_Logo.webp';

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
        const herhaalWachtwoord = formData.get('herhaalWachtwoord');
        const bedrijfsnaam = formData.get('bedrijfsnaam');
        const kvkNummer = formData.get('kvkNummer');
        const btwNummer = formData.get('btwNummer');
        const telefoonnummer = formData.get('telefoonnummer');

        // Controleer of de wachtwoorden overeenkomen
        if (wachtwoord !== herhaalWachtwoord) {
            alert('Wachtwoorden komen niet overeen. Probeer het opnieuw.');
            return;
        }

        // Verzamel de data in een object om te verzenden
        const data = {
            email: email,
            password: wachtwoord,
            bedrijfsnaam: bedrijfsnaam,
            kvkNummer: kvkNummer,
            btwNummer: btwNummer,
            telefoonnummer: telefoonnummer,
        };

        try {
            // Verstuur het POST verzoek naar de backend
            const response = await axios.post('http://localhost:5257/api/bedrijf/maakbedrijf', data);

            // Als de request succesvol is
            console.log('Bedrijf succesvol aangemaakt:', response.data);
            alert('Bedrijf succesvol geregistreerd!');
            navigate('/dashboard'); // Navigeren naar een andere pagina
        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error);
            alert('Er is iets misgegaan bij het registreren van het bedrijf!');
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
                    <label htmlFor="email">Emailadres:</label>
                    <input type="email" id="email" name="email" required placeholder="Vul je emailadres in..."/>
                </div>

                <div>
                    <label htmlFor="wachtwoord">Wachtwoord:</label>
                    <input type="password" id="wachtwoord" name="wachtwoord" required
                           placeholder="(minimaal 8 karakters)" minLength="8"/>
                </div>

                <div>
                    <label htmlFor="herhaalWachtwoord">Herhaal wachtwoord:</label>
                    <input type="password" id="herhaalWachtwoord" name="herhaalWachtwoord" required
                           placeholder="Vul je wachtwoord in..." minLength="8"/>
                </div>

                <div>
                    <label htmlFor="bedrijfsnaam">Bedrijfsnaam:</label>
                    <input type="text" id="bedrijfsnaam" name="bedrijfsnaam" required
                           placeholder="Vul je bedrijfsnaam in..."/>
                </div>

                <div>
                    <label htmlFor="kvkNummer">KVK-nummer:</label>
                    <input type="text" id="kvkNummer" name="kvkNummer" required
                           placeholder="Vul je KVK-nummer in..."/>
                </div>

                <div>
                    <label htmlFor="btwNummer">BTW-nummer:</label>
                    <input type="text" id="btwNummer" name="btwNummer" required
                           placeholder="Vul je BTW-nummer in..."/>
                </div>

                <div>
                    <label htmlFor="telefoonnummer">Telefoonnummer:</label>
                    <input type="tel" id="telefoonnummer" name="telefoonnummer" required
                           placeholder="Vul je telefoonnummer in..."/>
                </div>

                <button type="submit">Registreer Bedrijf</button>
            </form>
        </div>
    );
}

export default RegistreerBedrijf;
