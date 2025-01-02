import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "./Login/AccountProvider.jsx";
import "./VoertuigenSelectie.css";
import carAndAllLogo from './assets/CarAndAll_Logo.webp';

const VoertuigenComponent = () => {
    const [voertuigen, setVoertuigen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]);
    const [begindatum, setBegindatum] = useState(null);
    const [einddatum, setEinddatum] = useState(null);
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
                const url = `${apiBaseUrl}/krijgallevoertuigen`;
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



    const fetchVoertuigen = async (begindatum, einddatum) => {
        setLoading(true);
        try {
            const url = `${apiBaseUrl}/krijgallevoertuigenDatum?begindatum=${begindatum}&einddatum=${einddatum}`;
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

    // Logout functie
    const handleLogout = () => {
        logout();
        navigate('/Inlogpagina');
    };

    // Reserveer functie
    const handleReserveer = async (voertuigId, Prijs, voertuigStatus) => {
        if (voertuigStatus !== "Beschikbaar") {
            alert("Dit voertuig is al gereserveerd");
            return;
        }

        const data = {
            begindatum: begindatum,
            einddatum: einddatum,
            totaalPrijs: Prijs,
            voertuigId: voertuigId,
            AccountId: currentAccountId
        };

        try {
            const url = new URL("https://localhost:44318/api/Voertuig/reserveerVoertuig");
            var response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            alert("Voertuig Gereserveerd!");

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Fout bij reserveren: ${errorText}`);
                return;
            }

            alert("Reservering succesvol");

            const updatedVoertuigen = voertuigen.map((voertuig) =>
                voertuig.voertuigId === voertuigId ? { ...voertuig, voertuigStatus: "Gereserveerd" } : voertuig
            );
            setVoertuigen(updatedVoertuigen);
        } catch (error) {
            console.error("Fout bij reserveren:", error);
            alert("Er is een probleem opgetreden bij het reserveren van het voertuig.");
        }
        fetchVoertuigen(begindatum, einddatum);
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
                <h1>Voertuig huren</h1>
                <button className="logout-button small" onClick={handleLogout}>
                    Log uit
                </button>
            </header>
            <div className="search-filter">
                <input
                    type="date"
                    placeholder="Kies begindatum"
                    className="flatpickr-calander"
                    value={begindatum}
                    onChange={(e) => setBegindatum(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                />
                <input
                    type="date"
                    placeholder="Kies einddatum"
                    className="flatpickr-calander"
                    value={einddatum}
                    onChange={(e) => {
                        const newEinddatum = e.target.value; // Verkrijg de nieuwe waarde van het invoerveld
                        setEinddatum(newEinddatum); // Werk de state bij
                        fetchVoertuigen(begindatum, newEinddatum); // Roep fetchVoertuigen aan met de nieuwe waarde
                    }}
                    min={begindatum || new Date().toISOString().split('T')[0]}
                />

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
                                <p><strong>Status:</strong> {voertuig.voertuigStatus}</p>

                                {/* Knoppen voor reserveren en details */}
                                <div className="button-container">
                                    <button
                                        className="reserveer-button"
                                        onClick={() => handleReserveer(voertuig.voertuigId, voertuig.prijs, voertuig.voertuigStatus)}
                                    >
                                        Reserveer
                                    </button>
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
                                        <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                        <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                        <p><strong>BrandstofType:</strong> {voertuig.brandstofType}</p>
                                        <p><strong>Prijs:</strong> €{voertuig.prijs}</p>
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

export default VoertuigenComponent;
