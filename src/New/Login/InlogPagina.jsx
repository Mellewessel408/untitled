import React, { useState } from 'react';
import './KiesGebruiker.jsx';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../Accountprovider.jsx';

function InlogPagina() {
    const navigate = useNavigate();
    const { login, loading, error } = useAccount();

    const [email, setEmail] = useState('');
    const [wachtwoord, setWachtwoord] = useState('');

    const handleLogin = (event) => {
        event.preventDefault(); // Prevent form submission from reloading the page
        login(email, wachtwoord);
        navigate('/Hoofdscherm')
    };

    return (
        <div className="container">
            <h1>Inloggen</h1>

            {error && <p style={{color: "red"}}>Fout bij inloggen: {error}</p>}
            {loading && <p>Bezig met inloggen...</p>}

            <form className="Inlogform" onSubmit={handleLogin}>
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
                <button type="submit" className="Inlogknop">Inloggen</button>
            </form>

            <button className="Inlogknop" onClick={() => navigate('/RegistreerPagina')}>
                Registreren
            </button>
        </div>
    );
}

export default InlogPagina;
