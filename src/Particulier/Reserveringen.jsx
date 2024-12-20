import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAccount } from "../Login/AccountProvider.jsx"; // Zorg dat de context beschikbaar is
//import "./VoertuigenSelectie.css"; // Hergebruik de CSS
//import carAndAllLogo from './assets/CarAndAll_Logo.webp'; // Gebruik dezelfde afbeelding

const Reserveringen = () => {
    const [reserveringen, setReserveringen] = useState([]); // State voor reserveringen
    const [loading, setLoading] = useState(true); // State voor loading status
    const [error, setError] = useState(null); // State voor foutmeldingen
    const navigate = useNavigate(); // Voor navigatie
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const apiBaseUrl = `https://localhost:44318/api/Voertuig`; // API endpoint voor reserveringen

    // Haal de reserveringen op bij het laden van de component
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
        const fetchReserveringen = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/krijgallereserveringen`);
                if (!response.ok) {
                    throw new Error("Netwerkfout: " + response.statusText);
                }
                const data = await response.json();
                setReserveringen(data); // Zet de geretourneerde reserveringen
                setLoading(false); // Zet loading op false
            } catch (err) {
                console.log(err);
                setError("Kan reserveringen niet ophalen"); // Zet een foutmelding bij falen
                setLoading(false);
            }
        };

        fetchReserveringen();
    }, []); // Run alleen bij het laden van de component

    // Nieuwe logout functie
    const handleLogout = () => {
        logout(); // Roep de logout functie aan
        navigate('/Inlogpagina'); // Navigeer naar de inlogpagina
    };

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            {/* Title */}
            <header className="header">
                <h1>Mijn reserveringen</h1>
                <button className="logout-button small" onClick={handleLogout}>
                    Log uit
                </button>
            </header>

            {/* Grid van reserveringen */}
            <div className="voertuigen-grid">
                {reserveringen.length === 0 ? (
                    <div className="no-vehicles">Geen reserveringen gevonden</div>
                ) : (
                    reserveringen.map((reservering) => (
                        <div key={reservering.voertuigId} className="voertuig-card">
                            <div className="voertuig-photo">
                                <img
                                    className="voertuig-photo"
                                    src={carAndAllLogo}
                                    alt="CarAndAll Logo"
                                />
                            </div>
                            <div className="voertuig-info">
                                <h3 className="kenteken">{reservering.kenteken}</h3>
                                <p><strong>Merk:</strong> {reservering.merk}</p>
                                <p><strong>Model:</strong> {reservering.model}</p>
                                <p><strong>Kleur:</strong> {reservering.kleur}</p>
                                <p><strong>Aanschafjaar:</strong> {reservering.aanschafjaar}</p>
                                <p><strong>Prijs:</strong> €{reservering.prijs}</p>
                                <p><strong>Status:</strong> {reservering.voertuigStatus}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reserveringen;
