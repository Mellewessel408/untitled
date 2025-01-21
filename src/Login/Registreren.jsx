import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registreren.css';
import React from 'react';
import logo from '../assets/CarAndAll_Logo.webp';
import {AccountProvider, useAccount} from "./AccountProvider.jsx";
function Registreren() {
    const navigate = useNavigate();
    const baseUrl = 'https://localhost:44318';
    const InlogPagina = () => {
        navigate("/InlogPagina")
    }

    const { login } = useAccount(); // Toegang krijgen tot de login functie

    const Registreer = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const wachtwoord = formData.get('wachtwoord');
        const herhaalWachtwoord = formData.get('herhaalWachtwoord');
        const naam = formData.get('naam');
        const postcode = formData.get('postcode');
        const huisnummer = formData.get('huisnummer');
        const telefoonnummer = formData.get('telefoonnummer');

        if (wachtwoord !== herhaalWachtwoord) {
            alert('Wachtwoorden komen niet overeen. Probeer het opnieuw.');
            return;
        }

        const adresData = {
            postcode: postcode,
            huisnummer: huisnummer
        }

        try{
            const adresUrl = `${baseUrl}/Adres/MaakAdres`;
            const adresResponse = await fetch(adresUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adresData),
            });

            if (!adresResponse.ok) {
                const errorMessage = await response.text(); // Krijg de tekst van de foutmelding
                alert(`Fout: ${errorMessage}`);
            }

            const adresResponseData = await adresResponse.json(); // Parse JSON
            const adresId = Number(adresResponseData.adresId);

            const data = {
                email: email,
                wachtwoord: wachtwoord,
                accountType: "Particulier",
                naam: naam,
                nummer: telefoonnummer,
                adresId: adresId
            };

            const url = `${baseUrl}/Account/Registreer`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                alert(`Fout: ${errorMessage}`);
            }
            console.log(response)

            login(response)
            console.log('Account succesvol aangemaakt');
            navigate('/HoofdschermParticulier');
        } catch (error) {
            console.error('Fout bij het versturen van het verzoek:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
        }
    }

    return (
        <div className="container">
            <div className="Centreren">
                <img className="logo" src={logo} alt="Carandall Logo"/>
            </div>
            <h1>Registreer</h1>
            <form onSubmit={Registreer}>
                <div>
                    <label htmlFor="email">Emailadres:</label>
                    <input type="email" id="email" name="email" required placeholder="Vul je emailadres in..."/>
                </div>

                <div>
                    <label htmlFor="naam">Naam:</label>
                    <input type="text" id="naam" name="naam" required
                           placeholder="Vul uw naam in"/>
                </div>

                <div>
                    <label htmlFor="wachtwoord">Wachtwoord: </label>
                    <input type="password" id="wachtwoord" name="wachtwoord" required
                           placeholder="(minimaal 8 karakters)" minLength="8"/>
                </div>

                <div>
                    <label htmlFor="herhaalWachtwoord">Herhaal wachtwoord:</label>
                    <input type="password" id="herhaalWachtwoord" name="herhaalWachtwoord" required
                           placeholder="Vul je wachtwoord in..." minLength="8"/>
                </div>

                <div>
                    <label htmlFor="postcode">Postcode:</label>
                    <input type="text" id="postcode" name="postcode" pattern="[0-9]{4}\s?[A-Z]{2}" required
                           placeholder="1111AA"/>
                </div>

                <div>
                    <label htmlFor="huisnummer">Huisnummer:</label>
                    <input type="text" id="huisnummer" name="huisnummer" required
                           placeholder="Vul je Huisnummer in..."/>
                </div>

                <div>
                    <label htmlFor="telefoonnummer">Telefoonnummer:</label>
                    <input type="tel" id="telefoonnummer" name="telefoonnummer" required
                           placeholder="Vul je Telefoonnummer in..."/>
                </div>


                <button type="submit">Registreer</button>
                <button onClick={InlogPagina}>Inloggen</button>
            </form>
        </div>

    );
}

export default Registreren;