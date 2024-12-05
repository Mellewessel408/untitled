import { useState } from 'react';
import { postData } from './apiService'; // Zorg ervoor dat deze correct werkt
import { useNavigate } from 'react-router-dom';
import './InlogPagina.css';
import React from 'react';

function RegistreerBedrijf() {
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const Registreer = (event) => {
        event.preventDefault();

        // Formuliergegevens ophalen met FormData
        const formData = new FormData(event.target);
        const formDataObject = {
            email: formData.get('email'),
            wachtwoord: formData.get('wachtwoord'),
            herhaalWachtwoord: formData.get('herhaalWachtwoord'),
            postcode: formData.get('postcode'),
            huisnummer: formData.get('huisnummer'),
            telefoonnummer: formData.get('telefoonnummer')
        };

        // Verstuur de formuliergegevens naar de backend
        postData('/api/registreer', formDataObject) // Zorg dat de juiste API endpoint wordt gebruikt
            .then(response => {
                setResponseMessage('Registratie gelukt!');
                navigate('/dashboard'); // Navigeren naar een andere pagina na succesvolle registratie
            })
            .catch(error => {
                console.error(error);
                setResponseMessage('Fout bij verzenden van gegevens. Probeer opnieuw.');
            });
    };

    return (
        <div className="container">
            <h1>Registreren</h1>

            <form onSubmit={Registreer}>
                <label htmlFor="email">Emailadres:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required placeholder="Vul je emailadres in..."
                />


                <label htmlFor="wachtwoord">Wachtwoord: <br/>(minimaal 8 karakters)</label>
                <input
                    type="password"
                    id="wachtwoord"
                    name="wachtwoord"
                    required
                    placeholder="Vul je wachtwoord in..."
                    minLength="8"
                />

                <label htmlFor="herhaalWachtwoord">Herhaal wachtwoord:</label>
                <input
                    type="password"
                    id="herhaalWachtwoord"
                    name="herhaalWachtwoord"
                    required
                    placeholder="Herhaal je wachtwoord..."
                    minLength="8"
                />

                <label htmlFor="postcode">Postcode:</label>
                <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    pattern="[0-9]{4}\s?[A-Z]{2}"
                    required
                    placeholder="1111 AA"
                />

                <label htmlFor="huisnummer">Huisnummer:</label>
                <input
                    type="text"
                    id="huisnummer"
                    name="huisnummer"
                    required
                    placeholder="Vul je huisnummer in..."
                />

                <label htmlFor="telefoonnummer">Telefoonnummer:</label>
                <input
                    type="tel"
                    id="telefoonnummer"
                    name="telefoonnummer"
                    required
                    placeholder="Vul je telefoonnummer in..."
                />

                <button type="submit">Registreer</button>
            </form>

            {/* Feedback aan gebruiker */}
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}

export default RegistreerBedrijf;
