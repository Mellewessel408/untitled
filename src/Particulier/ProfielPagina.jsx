import React, { useEffect, useState } from 'react';
import { useAccount } from "../Login/AccountProvider.jsx";
import logo from "../assets/CarAndAll_Logo.webp";
import { useNavigate } from "react-router-dom";

function ProfielPagina() {
    const { currentAccount, logout } = useAccount();
    const navigate = useNavigate();


    const Telefoonnummer = ( telefoonnummer ) => {
        if (!telefoonnummer) {
            return <p>Onbekend</p>;
        }
        const stringnummer = String(telefoonnummer);
        const formattedNumber = `06 ${stringnummer.slice(1, 9)}`;

        return <p>{formattedNumber}</p>;
    };

    const handleLogout = () => {
        logout();
        navigate('/Inlogpagina');
    };

    return (
        <div className="container">
            <button className="logout-button small" onClick={handleLogout}>
                Log uit
            </button>
            <div className="Centreren">
                <img className="logo" src={logo} alt="Carandall Logo"/>
            </div>
            <h1>Profiel</h1>

            <div>
                <p><strong>Email:</strong> <br/> {currentAccount.email}</p>
                <p><strong>Naam:</strong> <br/> {currentAccount.naam}</p>
                <p><strong>Telefoonnummer:</strong><br/> {Telefoonnummer(currentAccount.telefoonnummer)}</p>
                <p><strong>Woonplaats:</strong> <br/>{currentAccount.adres.woonplaats}</p>
                <p><strong>Straat:</strong> <br/>{currentAccount.adres.straatnaam}</p>
                <p><strong>Huisnummer:</strong><br/> {currentAccount.adres.huisnummer}</p>
            </div>
            <div className="button-container">
                <button onClick={() => navigate('/ProfielWijzigen')}>Wijzigen</button>
                <button type="button" onClick={() => navigate('/HoofdschermParticulier')}>Terug</button>
            </div>
        </div>
    );
}

export default ProfielPagina;
