import React, { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr"; // Importeer Flatpickr
import "flatpickr/dist/flatpickr.min.css"; // Importeer de Flatpickr CSS
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

    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const navigate = useNavigate();
    const apiBaseUrl = `https://localhost:44318/api/Voertuig`;

    // Ref voor het datumveld
    const datePickerRef = useRef();

    // Fetch voertuigen
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
        const fetchVoertuigen = async () => {
            try {
                const url = `${apiBaseUrl}/krijgallevoertuigen`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Netwerkfout: " + response.statusText);
                }
                const data = await response.json();
                const voertuigenArray = data.$values || [];
                setVoertuigen(voertuigenArray);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Kan voertuigen niet ophalen");
                setLoading(false);
            }
        };

        fetchVoertuigen();
    }, []);

    // Filter voertuigen
    useEffect(() => {
        const filtered = voertuigen.filter((voertuig) => {
            return (
                voertuig.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voertuig.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredVoertuigen(filtered);
    }, [searchTerm, voertuigen]);

    // Logout functie
    const handleLogout = () => {
        logout();
        navigate('/Inlogpagina');
    };

    // Reserveer functie
    const handleReserveer = async (voertuigId) => {
        try {
            const response = await fetch(`${apiBaseUrl}/reserveer/${voertuigId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Fout bij reserveren: ${errorText}`);
                return;
            }

            const successMessage = await response.text();
            alert(successMessage);

            const updatedVoertuigen = voertuigen.map((voertuig) =>
                voertuig.voertuigId === voertuigId ? { ...voertuig, voertuigStatus: "Gereserveerd" } : voertuig
            );
            setVoertuigen(updatedVoertuigen);
        } catch (error) {
            console.error("Fout bij reserveren:", error);
            alert("Er is een probleem opgetreden bij het reserveren van het voertuig.");
        }
    };

    // Initialiseer Flatpickr
    useEffect(() => {
        if (datePickerRef.current) {
            flatpickr(datePickerRef.current, {
                dateFormat: "d-m-Y",
                altInput: true,
                altFormat: "F j, Y",
                minDate: "today",
                maxDate: new Date().fp_incr(365),
                weekNumbers: true,
                mode: "range",
            });
        }
    }, []);

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
            {/* Flatpickr invoerveld */}

            <div className="search-filter">
                <input
                    type="text"
                    ref={datePickerRef}
                    className="flatpickr-calander"
                    id="start"
                    placeholder="Kies een datum"
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
