import React, { useState } from 'react';
import './InlogPagina.css';
import './KiesGebruiker.jsx';
import { useNavigate } from 'react-router-dom';

function InlogPagina() {
    const [email, setEmail] = useState('');
    const [wachtwoord, setWachtwoord] = useState('');
    const navigate = useNavigate();

    const inlogKnop = async (event) => {
        event.preventDefault(); // Voorkomt dat het formulier standaard wordt ingediend

        const data = {
            email: email,
            wachtwoord: wachtwoord
        }

        try {
            // Verstuur het POST-verzoek naar de backend
            const response = await fetch('https://localhost:44318/api/Particulier/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Als de request succesvol is
            if (response.ok) {
                console.log('Account succesvol ingelogd');
                alert('Inloggen succesvol!');
                navigate('./HoofdschermParticulier'); // Of een andere route
            } else {
                alert('Fout account of wachtwoord!');
            }
        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };

    const registrerenKnop = () => {
        navigate('KiesGebruiker');
    };

    return (
        <>
            <div className="container">
                <h1>Inloggen</h1>

                <form className="Inlogform" onSubmit={inlogKnop}>
                    <div>
                        <label htmlFor="email">E-mailadres:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Vul je emailadres in..."
                        />
                    </div>
                    <div>
                        <label htmlFor="wachtwoord">Wachtwoord: </label>
                        <input
                            type="password"
                            id="wachtwoord"
                            name="wachtwoord"
                            value={wachtwoord}
                            onChange={(e) => setWachtwoord(e.target.value)}
                            required
                            placeholder="Vul hier uw wachtwoord in..."
                        />
                    </div>
                    <button className="Inlogknop">Inloggen</button>
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
