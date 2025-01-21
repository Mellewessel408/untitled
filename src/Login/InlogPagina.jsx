import {useState} from 'react';
import './InlogPagina.css';
import './KiesGebruiker.jsx';
import { useNavigate } from 'react-router-dom';
import { useAccount } from "./AccountProvider.jsx";

function InlogPagina() {
    const [email, setEmail] = useState('');
    const [wachtwoord, setWachtwoord] = useState('');

    const navigate = useNavigate();
    const { login } = useAccount();
    const [gebruiker, setGebruiker] = useState('Particulier');


    const inlogKnop = async (event) => {
        event.preventDefault(); // Voorkomt dat het formulier standaard wordt ingediend

        const data = {
            email: email,
            wachtwoord: wachtwoord
        }

        try {
            // Verstuur het POST-verzoek naar de backend
            const response = await fetch('https://localhost:44318/Account/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                alert('Fout account of wachtwoord!');
                return;
            }

            const responseData = await response.json();
            login(responseData);
            console.log(responseData);
            console.log('Account succesvol ingelogd');
            alert('Inloggen succesvol!');
            navigate('/Hoofdscherm' + gebruiker);
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


                <label htmlFor="Kies-type-gebruiker">Kies type gebruiker</label>
                <select
                    id="Kies-type-gebruiker"
                    value={gebruiker}
                    onChange={(e) => setGebruiker(e.target.value)}
                    aria-labelledby="Kies-type-gebruiker" // Geeft extra duidelijkheid voor schermlezers
                >
                    <option value="Particulier">Particulier</option>
                    <option value="Backoffice">Backoffice</option>
                    <option value="Frontoffice">Frontoffice</option>
                    <option value="ZakelijkHuurder">Zakelijk Huurder</option>
                    <option value="ZakelijkBeheerder">Zakelijk Beheerder</option>
                </select>
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
