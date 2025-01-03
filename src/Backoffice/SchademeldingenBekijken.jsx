import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './HoofdschermFrontoffice.css';
import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken

function SchademeldingenBekijken() {
    const navigate = useNavigate();
    const {currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const [schademeldingen, setSchademeldingen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const apiBaseUrl ='https://localhost:44318/api/';
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });

    useEffect(() => {
        const fetchSchademeldingen = async () => {
            try {
                const url = `${apiBaseUrl}/schademeldingen`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Netwerkfout: " + response.statusText);
                }
                const data = await response.json();

                const schademledingenArray = data.$values || [];

                setSchademeldingen(schademledingenArray); // Set the vehicles data
                setLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                console.log(err)
                setError("Kan schademeldingen niet ophalen"); // Set error if fetch fails
                setLoading(false); // Set loading to false after error
            }
        };
    })

    const handleHoofdmenu = () => {
        navigate('/HoofdschermBackoffice'); // Navigeren naar inlogpagina
    };

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };
    const handleLogout = () => {
        LogUit(); // Roep de logout-functie aan
        navigate('/Inlogpagina'); // Navigeren naar inlogpagina
    };

    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>


            <h1>Schademeldingen</h1>

            <button className="logout-button" onClick={handleLogout}>Log uit</button>
            <button onClick={handleHoofdmenu}>Hoofdmenu</button>
        </div>
    );
}

export default SchademeldingenBekijken;
