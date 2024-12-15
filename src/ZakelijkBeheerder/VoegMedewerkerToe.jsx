import {useNavigate} from 'react-router-dom';
import {AccountProvider, useAccount} from "../Login/AccountProvider.jsx";
import React, {useEffect, useState} from "react";
import logo from "../assets/CarAndAll_Logo.webp";


function VoegMedewerkerToe() {
    const navigate = useNavigate();
    const { currentAccountId} = useAccount(); // Haal de currentAccountId uit de context
    const [bedrijf, setBedrijf] = useState(null);
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId")
            navigate('/inlogpagina');

        }
    })

    const GetBedrijf = async () => {
        try {
            // Verstuur het POST verzoek naar de backend
            const url = new URL("https://localhost:44318/api/ZakelijkBeheerder/KrijgSpecifiekAccount?id=" + currentAccountId);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const gegevens = await response.json();
                setBedrijf(gegevens.bedrijfId);
                console.log(gegevens.bedrijfId);
            }
        } catch (error) {
            console.error('Fout bij het versturen van het verzoek:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
            return null;
        }
    }
    const GetBedrijfDomein = async () => {

        try {
            // Verstuur het POST verzoek naar de backend
            const url = new URL("https://localhost:44318/api/Bedrijf/KrijgBedrijfDomein?accountId=" + currentAccountId);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const bedrijfDomein = response.text();
                return bedrijfDomein;
            }
        } catch (error) {
            console.error('Fout bij het versturen van het verzoek:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
            return null;
        }
    }
    const Registreer = async (event) => {
        event.preventDefault();
        GetBedrijf();


        const formData = new FormData(event.target);
        const email = formData.get('email');
        const wachtwoord = formData.get('wachtwoord');
        const herhaalWachtwoord = formData.get('herhaalWachtwoord');

        const bedrijfDomein = await GetBedrijfDomein();
        if (bedrijfDomein === null || bedrijf === null) {
            return;
        }


        // Haal het domein van het e-mailadres op
        const emailDomein = email.split('@')[1]?.toLowerCase();

        // Controleer of de bedrijfsnaam overeenkomt met het e-maildomein
        if (bedrijfDomein !== ('@' + emailDomein)) {
            alert("Emailadres klopt niet met de bijbehorende bedrijfsdomein!");
            return;
        }


        // Controleer of de wachtwoorden overeenkomen
        if (wachtwoord !== herhaalWachtwoord) {
            alert('Wachtwoorden komen niet overeen. Probeer het opnieuw.');
            return;
        }


        // Verzamel de data in een object om te verzenden
        const data = {
            Email: email,
            Wachtwoord: wachtwoord,
            BedrijfId: bedrijf,
        };

console.log(data);
        try {
            // Verstuur het POST verzoek naar de backend
            const url = new URL("https://localhost:44318/api/Bedrijf/VoegMedewerkerToe");
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Data moet een JSON-object zijn
            });
            if (response.ok) {
                // Als de request succesvol is
                console.log('Account succesvol aangemaakt');
                navigate('/HoofdschermZakelijkBeheerder');
            } else {
                // Als de request niet succesvol is (bijvoorbeeld BadRequest)
                const errorMessage = await response.text(); // Krijg de tekst van de foutmelding
                alert(`Fout: ${errorMessage}`);
            }
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
            <h1>Medewerker toevoegen</h1>
            <form onSubmit={Registreer}>
                <div>
                    <label htmlFor="email">Huurder email:</label>
                    <input type="text" id="email" name="email" required placeholder="Vul je bedrijfsnaam in..."/>
                </div>

                <div>
                    <label htmlFor="wachtwoord">Wachtwoord:</label>
                    <input type="password" id="wachtwoord" name="wachtwoord" required placeholder="(minimaal 8 karakters)" minLength="8"/>
                </div>

                <div>
                    <label htmlFor="herhaalWachtwoord">Herhaal Wachtwoord:</label>
                    <input type="password" id="herhaalWachtwoord" name="herhaalWachtwoord" required placeholder="Vul alweer het wachtwoord in..."/>
                </div>

                <button type="submit">Voeg nieuwe medewerker toe</button>
            </form>
        </div>
    );
}

export default VoegMedewerkerToe;