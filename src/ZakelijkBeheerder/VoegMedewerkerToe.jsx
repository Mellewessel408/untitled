import { useNavigate } from 'react-router-dom';
import { useAccount } from "../Login/AccountProvider.jsx";
import React, { useEffect, useState } from "react";
import logo from "../assets/CarAndAll_Logo.webp";

function VoegMedewerkerToe() {
    const navigate = useNavigate();
    const { currentAccountId } = useAccount();
    const [bedrijf, setBedrijf] = useState(null);

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent niet correct ingelogd. U wordt teruggestuurd naar de inlogpagina");
            navigate('/inlogpagina');
        } else {
            GetBedrijf(); // Haal bedrijf zodra de component laadt
        }
    }, [currentAccountId, navigate]);

    const GetBedrijf = async () => {
        try {
            const url = new URL(`https://localhost:44318/api/ZakelijkBeheerder/KrijgSpecifiekAccount?id=${currentAccountId}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const gegevens = await response.json();
                setBedrijf(gegevens.bedrijfId);
            }
        } catch (error) {
            console.error('Fout bij het versturen van het verzoek:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
        }
    }

    const GetBedrijfDomein = async () => {
        try {
            const url = new URL(`https://localhost:44318/api/Bedrijf/KrijgBedrijfDomein?accountId=${currentAccountId}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                return await response.text();
            }
        } catch (error) {
            console.error('Fout bij het versturen van het verzoek:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
            return null;
        }
    }

    const Registreer = async (event) => {
        event.preventDefault();

        // Wacht tot bedrijf is opgehaald en bedrijf state is bijgewerkt
        await GetBedrijf();
        if (!bedrijf) {
            alert('Bedrijf niet gevonden. Probeer het later opnieuw.');
            return;
        }

        const bedrijfDomein = await GetBedrijfDomein();
        if (bedrijfDomein === null) {
            return;
        }

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const wachtwoord = formData.get('wachtwoord');
        const herhaalWachtwoord = formData.get('herhaalWachtwoord');

        const emailDomein = email.split('@')[1]?.toLowerCase();

        if (bedrijfDomein !== emailDomein) {
            alert("Emailadres klopt niet met de bijbehorende bedrijfsdomein!");
            return;
        }

        if (wachtwoord !== herhaalWachtwoord) {
            alert('Wachtwoorden komen niet overeen. Probeer het opnieuw.');
            return;
        }

        const data = {
            Email: email,
            Wachtwoord: wachtwoord,
            BedrijfId: bedrijf,
        };

        try {
            const url = new URL("https://localhost:44318/api/Bedrijf/VoegMedewerkerToe");
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                console.log('Account succesvol aangemaakt');
                alert("Huurder Account succesvol aangemaakt!");
                navigate('/HoofdschermZakelijkBeheerder');
            } else {
                const errorMessage = await response.text();
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
                <img className="logo" src={logo} alt="Carandall Logo" />
            </div>
            <h1>Medewerker toevoegen</h1>
            <form onSubmit={Registreer}>
                <div>
                    <label htmlFor="email">Huurder email:</label>
                    <input type="text" id="email" name="email" required placeholder="Vul je bedrijfsnaam in..." />
                </div>
                <div>
                    <label htmlFor="wachtwoord">Wachtwoord:</label>
                    <input type="password" id="wachtwoord" name="wachtwoord" required placeholder="(minimaal 8 karakters)" minLength="8" />
                </div>
                <div>
                    <label htmlFor="herhaalWachtwoord">Herhaal Wachtwoord:</label>
                    <input type="password" id="herhaalWachtwoord" name="herhaalWachtwoord" required placeholder="Vul alweer het wachtwoord in..." />
                </div>
                <button type="submit">Voeg nieuwe medewerker toe</button>
            </form>
        </div>
    );
}

export default VoegMedewerkerToe;
