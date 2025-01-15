import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAccount } from "../Login/AccountProvider.jsx"; // Zorg dat de context beschikbaar is
import "../VoertuigenSelectie.css"; // Import CSS classes
import carAndAllLogo from '../assets/CarAndAll_Logo.webp'; // Gebruik één afbeelding

const VoertuigenComponent = () => {
    const [voertuigen, setVoertuigen] = useState([]); // State for storing vehicles
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for handling errors
    const [searchTerm, setSearchTerm] = useState(""); // Search term for merk and model
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]); // Filtered vehicles

    const { logout } = useAccount(); // Gebruik de logout-functie vanuit de context
    const navigate = useNavigate(); // Voor navigatie

    const apiBaseUrl = `https://localhost:44318/api/ZakelijkHuurder`; // API endpoint to get all vehicles

    // Fetch voertuigen when the component is mounted
    useEffect(() => {
        const fetchVoertuigen = async () => {
            try {
                const url = `${apiBaseUrl}/krijgalleautos`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Netwerkfout: " + response.statusText);
                }
                const data = await response.json();

                const voertuigenArray = data.$values || [];

                setVoertuigen(voertuigenArray); // Set the vehicles data
                setLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                console.log(err)
                setError("Kan voertuigen niet ophalen"); // Set error if fetch fails
                setLoading(false); // Set loading to false after error
            }
        };

        fetchVoertuigen();
    }, []); // Run only on component mount

    // Filter vehicles based on search term
    useEffect(() => {
        const filtered = voertuigen.filter((voertuig) => {
            return (
                voertuig.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voertuig.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredVoertuigen(filtered); // Update filtered vehicles based on search
    }, [searchTerm, voertuigen]); // Run whenever searchTerm or vehicles changes

    // Nieuwe logout functie
    const handleLogout = () => {
        logout(); // Roep de logout-functie aan
        navigate('/Inlogpagina'); // Navigeren naar inlogpagina
    };

    const handleReserveer = async (voertuigId) => {
        try {
            const response = await fetch(`https://localhost:44318/api/Voertuig/reserveer/${voertuigId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Fout bij reserveren: ${errorText}`);
                return;
            }

            const successMessage = await response.text();
            alert(successMessage);

            // Optioneel: Refresh de voertuigenlijst om de nieuwe status te tonen
            const updatedVoertuigen = voertuigen.map((voertuig) =>
                voertuig.voertuigId === voertuigId ? { ...voertuig, voertuigStatus: "Gereserveerd" } : voertuig
            );
            setVoertuigen(updatedVoertuigen);
        } catch (error) {
            console.error("Fout bij reserveren:", error);
            alert("Er is een probleem opgetreden bij het reserveren van het voertuig.");
        }
    };

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            {/* Title */}
            <header className="header">
                <h1>Voertuig huren</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Log uit
                </button>
            </header>

            {/* Search Section */}
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Zoek op merk of model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
            </div>

            {/* Grid of vehicles */}
            <div className="voertuigen-grid">
                {filteredVoertuigen.length === 0 ? (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                ) : (
                    filteredVoertuigen.map((voertuig) => (
                        <div key={voertuig.voertuigId} className="voertuig-card">
                            <div className="voertuig-photo">
                                <img
                                    className="voertuig-photo"
                                    src={carAndAllLogo}
                                    alt="CarAndAll Logo"
                                />
                            </div>
                            <div className="voertuig-info">
                                <h3 className="kenteken">{voertuig.kenteken}</h3>
                                <p><strong>Merk:</strong> {voertuig.merk}</p>
                                <p><strong>Model:</strong> {voertuig.model}</p>
                                <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                <p><strong>Prijs:</strong> €{voertuig.prijs}</p>
                                <p><strong>Status:</strong> {voertuig.voertuigStatus}</p>
                                <button
                                    className="reserveer-button"
                                    onClick={() => handleReserveer(voertuig.voertuigId)}
                                >
                                    Reserveer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VoertuigenComponent;
