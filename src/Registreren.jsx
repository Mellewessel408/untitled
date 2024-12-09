import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InlogPagina.css';
import './InlogPagina.jsx';
import React from 'react';
import axios from "axios";
function Registreren() {
    const navigate = useNavigate();

    const Inloggen = () => {
        navigate("./InlogPagina")
    }
    const Registreer = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const wachtwoord = formData.get('wachtwoord');
        const herhaalWachtwoord = formData.get('herhaalWachtwoord');
        const postcode = formData.get('postcode');
        const huisnummer = formData.get('huisnummer');
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
            string: postcode,
            huisnummer: huisnummer,
            telefoonnummer: telefoonnummer
        };

        try {
            // Verstuur het POST verzoek naar de backend
            const response = await axios.post('http://localhost:5153/api/accountparticulier/maakaccount', data);

            // Als de request succesvol is
            console.log('Account succesvol aangemaakt:', response.data);
            alert('Account succesvol aangemaakt!');
        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error);
            alert('Er is iets misgegaan bij het aanmaken van het account!');
        }
        ;
    }

    return (
        <div className="container">
            <h1>Registreren</h1>

            <form onSubmit={Registreer}>
                <label htmlFor="email">Emailadres:</label>
                <input type="email" id="email" name="email" required placeholder="Vul je emailadres in..."/>

                <label htmlFor="wachtwoord">Wachtwoord: <br/>(minimaal 8 karakters) </label>
                <input type="password" id="wachtwoord" name="wachtwoord" required placeholder="Vul je wachtwoord in..."
                       minLength="8"/>

                <label htmlFor="herhaalWachtwoord">Herhaal wachtwoord:</label>
                <input type="password" id="herhaalWachtwoord" name="herhaalWachtwoord" required
                       placeholder="Vul je wachtwoord in..." minLength="8"/>

                <label htmlFor="Postcode">Postcocde:</label>
                <input type="text" id="postcode" name="postcode" pattern="[0-9]{4}\s?[A-Z]{2}" required placeholder="1111AA"/>

                <label htmlFor="huisnummer">Huisnummer:</label>
                <input type="text" id="huisnummer" name="huisnummer" required placeholder="Vul je Huisnummer in..."/>

                <label htmlFor="telefoonnummer">Telefoonnummer:</label>
                <input type="tel" id="telefoonnummer" name="telefoonnummer" required
                       placeholder="Vul je Telefoonnummer in..."/>
                <button type="submit" >Registreer</button>

            </form>
            <button onClick={Inloggen}>Inloggen</button>


        </div>
    );
}

export default Registreren;