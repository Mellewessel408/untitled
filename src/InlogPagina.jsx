import { useState } from 'react';
import './InlogPagina.css';
import './BeginRegistreren.jsx'
import { useNavigate } from 'react-router-dom';
function InlogPagina() {
    const testGebruikersnaam = 'admin';
    const testWachtwoord = '1234';

    const navigate = useNavigate();
    const [gebruikersnaam, setGebruikersnaam] = useState('');
    const [wachtwoord, setWachtwoord] = useState('');

    const handelGebruikersnaam = (event) => {
        setGebruikersnaam(event.target.value);
    };
    const handelWachtwoord = (event) => {
        setWachtwoord(event.target.value);
    };
    const inlogKnop = () => {

        if (gebruikersnaam === testGebruikersnaam && wachtwoord === testWachtwoord) {
            alert('Ingelogd')
        }
        else {
            alert('Ongeldige gebruikersnaam of wachtwoord');
        }
    };
    const registrerenKnop = () => {
        navigate('BeginRegistreren');
    }


    return (
        <div className = "container">
            <h1>Inloggen</h1>


            <input
                type="text"
                value={gebruikersnaam}
                onChange={handelGebruikersnaam}
                placeholder="Gebruikersnaam..."
            />

            <input
                type="password"
                value={wachtwoord}
                onChange={handelWachtwoord}
                placeholder="Wachtwoord..."
            />
            <button
                onClick={inlogKnop}>Inloggen
            </button>
            <button
                onClick={registrerenKnop}>Registreren
            </button>
        </div>
    );
}

export default InlogPagina;
