import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../Login/AccountProvider.jsx";
import "../VoertuigenSelectie.css";
import carAndAllLogo from '../assets/CarAndAll_Logo.webp';

const MijnReserveringen = () => {
    const [voertuigen, setVoertuigen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]);
    const [showDetails, setShowDetails] = useState(null); // Nieuw: Show details voor geselecteerd voertuig

    const { currentAccountId, logout } = useAccount();
    const navigate = useNavigate();
    const apiBaseUrl = `https://localhost:44318/api/Voertuig`;

    // Haal de voertuigen op
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
        const fetchVoertuigen = async () => {
            setLoading(true);
            try {
                const url = `${apiBaseUrl}/krijgallevoertuigenAccount?accountId=${currentAccountId}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Netwerkfout (${response.status}): ${response.statusText}`);
                }
                const data = await response.json();
                setVoertuigen(data.$values || []);
            } catch (err) {
                console.error(err);
                setError(`Kan voertuigen niet ophalen: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchVoertuigen();
    }, []);

    // Filter voertuigen
    useEffect(() => {
        const filtered = voertuigen.filter((voertuig) => {
            return Object.keys(voertuig).some((key) => {
                const value = voertuig[key];
                if (typeof value === "string") {
                    return value.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (typeof value === "number") {
                    return value.toString().includes(searchTerm);
                }
                return false;
            });
        });
        setFilteredVoertuigen(filtered);
    }, [searchTerm, voertuigen]);





    // Logout functie
    const handleLogout = () => {
        logout();
        navigate('/Inlogpagina');
    };

    // Functie om details van het voertuig weer te geven
    const toggleDetails = (voertuigId) => {
        setShowDetails(showDetails === voertuigId ? null : voertuigId); // Toggle details
    };

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            <header className="header">
                <h1>Mijn Reserveringen</h1>
                <button className="logout-button small" onClick={handleLogout}>
                    Log uit
                </button>
            </header>
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Zoek op merk of model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
            </div>
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

                                {/* Knop voor details */}
                                <div className="button-container">

                                    <button
                                        className="details-button"
                                        onClick={() => toggleDetails(voertuig.voertuigId)}
                                    >
                                        Details
                                    </button>
                                </div>

                                {/* Details tonen als de knop is ingedrukt */}
                                {showDetails === voertuig.voertuigId && (
                                    <div className="voertuig-details">
                                        <p><strong>VoertuigType:</strong> {voertuig.voertuigType}</p>
                                        <p><strong>Details:</strong> Deze informatie is alleen zichtbaar wanneer je op
                                            Details klikt.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MijnReserveringen;