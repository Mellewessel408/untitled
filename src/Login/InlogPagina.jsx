import React, { useState } from 'react';
import './InlogPagina.css';
import './KiesGebruiker.jsx'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
function InlogPagina() {


    const navigate = useNavigate();




        const inlogKnop = async (event) => {
            event.preventDefault(); // Voorkomt dat het formulier standaard wordt ingediend

            const formData = new FormData(event.target);
            const email = formData.get('email');
            const wachtwoord = formData.get('wachtwoord');

            try {
                // Verstuur het POST-verzoek naar de backend
                const response = await axios.post('https://localhost:44318/api/Particulier/Login', null, {
                    params: {
                        email: email,
                        wachtwoord: wachtwoord
                    }
                });

                // Als de request succesvol is
                console.log('Account succesvol ingelogd:', response.data);
                alert('Inloggen succesvol!');

            } catch (error) {
                // Foutafhandelingslogica
                console.error('Er is een fout opgetreden:', error.message);
                alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
            }
        };

        const registrerenKnop = () => {
        navigate('KiesGebruiker');
    }


    return (
        <>
            <div className="container">
                <h1>Inloggen</h1>

                <form className="Inlogform" onSubmit={inlogKnop}>
                    <div>
                        <label htmlFor="email">Emailadres:</label>
                        <input type="email" id="email" name="email" required placeholder="Vul je emailadres in..."/>
                    </div>
                    <div>
                        <label htmlFor="wachtwoord">Wachtwoord: </label>
                        <input type="password" id="wachtwoord" name="wachtwoord" required
                               placeholder="(minimaal 8 karakters)" minLength="8"/>
                    </div>
                    <button
                        className="Inlogknop"
                    >Inloggen
                    </button>
                </form>


                <button
                    className="Inlogknop"
                    onClick={registrerenKnop}>Registreren
                </button>
            </div>
        </>
    );
}

export default InlogPagina;
