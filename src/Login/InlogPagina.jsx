import React, {useEffect, useState} from 'react';
import './InlogPagina.css';
import './KiesGebruiker.jsx';
import { useNavigate } from 'react-router-dom';
import {AccountProvider, useAccount} from "./AccountProvider.jsx";

function InlogPagina() {
    const [email, setEmail] = useState('');
    const [wachtwoord, setWachtwoord] = useState('');
    const [gebruiker, setGebruiker] = useState('');
    const navigate = useNavigate();
    const { login } = useAccount();



    const inlogKnop = async (event) => {
        event.preventDefault(); // Voorkomt dat het formulier standaard wordt ingediend

        const data = {
            email: email,
            wachtwoord: wachtwoord
        }

        try {
            // Verstuur het POST-verzoek naar de backend
            const response = await fetch('https://localhost:44318/api/' + gebruiker + '/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Als de request succesvol is
            if (response.ok) {
                console.log("Object terughalen voor AccountId");
                const IdResponse = await fetch('https://localhost:44318/api/' + gebruiker + '/KrijgSpecifiekAccountEmail?email=' + email);
                const IdData = await IdResponse.json();
                if (IdData?.accountId) {
                    login(IdData.accountId); // Account-ID instellen vanuit de response
                }

                console.log('Account succesvol ingelogd');
                alert('Inloggen succesvol!');
                navigate('/Hoofdscherm' + gebruiker); // Of een andere route
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

    const handleChange = (event) => {
        setGebruiker(event.target.value);
    };

    return (
        <>
            <div className="container">
                <h1>Inloggen</h1>

                <form>
                    <h3>Type Account:</h3>
                    <label>
                        <input
                            type="radio"
                            className="typeAccount"
                            name="typeAccount"
                            value="Particulier"
                            checked={gebruiker === "Particulier"}
                            onChange={handleChange}
                        />
                        Particulier
                    </label>
                    <label>
                        <input
                            type="radio"
                            className="typeAccount"
                            name="typeAccount"
                            value="Backoffice"
                            checked={gebruiker === "Backoffice"}
                            onChange={handleChange}
                        />
                        Backoffice
                    </label>
                    <label>
                        <input
                            type="radio"
                            className="typeAccount"
                            name="typeAccount"
                            value="Frontoffice"
                            checked={gebruiker === "Frontoffice"}
                            onChange={handleChange}
                        />
                        Frontoffice
                    </label>
                    <label>
                        <input
                            type="radio"
                            className="typeAccount"
                            name="typeAccount"
                            value="ZakelijkHuurder"
                            checked={gebruiker === "ZakelijkHuurder"}
                            onChange={handleChange}
                        />
                        Zakelijk Huurder
                    </label>
                    <label>
                        <input
                            type="radio"
                            className="typeAccount"
                            name="typeAccount"
                            value="ZakelijkBeheerder"
                            checked={gebruiker === "ZakelijkBeheerder"}
                            onChange={handleChange}
                        />
                        Zakelijk Beheerder
                    </label>
                </form>

                <form className="Inlogform" onSubmit={inlogKnop}>
                    <div>
                        <label htmlFor="email">E-mailadres:</label>
                        <input
                            type="text"
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
