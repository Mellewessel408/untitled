import React, { useEffect, useState } from 'react';
import { useAccount } from "../Login/AccountProvider.jsx";
import logo from "../assets/CarAndAll_Logo.webp";
import { useNavigate } from "react-router-dom";

function ProfielPagina() {
    const { currentAccountId } = useAccount();
    const [accountDetails, setAccountDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const url = new URL("https://localhost:44318/api/Particulier/KrijgSpecifiekAccount");
                url.searchParams.append("id", String(currentAccountId));
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    setAccountDetails(data);
                } else {
                    console.error('Fout bij het ophalen van accountgegevens:', await response.text());
                    alert('Er is een fout opgetreden bij het ophalen van de accountgegevens. Probeer het later opnieuw.');
                }
            } catch (error) {
                console.error('Fout bij het ophalen van accountgegevens:', error);
                alert('Er is een fout opgetreden. Probeer het later opnieuw.');
            }
        };

        fetchAccountDetails();
    }, [currentAccountId]);

    const Telefoonnummer = ( telefoonnummer ) => {
        if (!telefoonnummer) {
            return <p>Onbekend</p>;
        }
        const stringnummer = String(telefoonnummer);
        const formattedNumber = `06 ${stringnummer.slice(1, 9)}`;

        return <p>{formattedNumber}</p>;
    };







    if (!accountDetails) {
        return <p>Gegevens laden...</p>;
    }

    return (
        <div className="container">
            <div className="Centreren">
                <img className="logo" src={logo} alt="Carandall Logo"/>
            </div>
            <h1>Profiel</h1>

            <div>
                <p><strong>Email:</strong> <br/> {accountDetails.email}</p>
                <p><strong>Naam:</strong> <br/> {accountDetails.naam}</p>
                <p><strong>Telefoonnummer:</strong><br/> {Telefoonnummer(accountDetails.telefoonnummer)}</p>
                <p><strong>Woonplaats:</strong> <br/>{accountDetails.adres.woonplaats}</p>
                <p><strong>Straat:</strong> <br/>{accountDetails.adres.straatnaam}</p>
                <p><strong>Huisnummer:</strong><br/> {accountDetails.adres.huisnummer}</p>
            </div>
            <div className="button-container">
                <button onClick={() => navigate('/ProfielWijzigen')}>Wijzigen</button>
                <button type="button" onClick={() => navigate('/HoofdschermParticulier')}>Terug</button>
            </div>
        </div>
    );
}

export default ProfielPagina;
