import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAccount } from "./Login/AccountProvider.jsx";
import "./VoertuigenSelectie.css";
import carAndAllLogo from './assets/CarAndAll_Logo.webp';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const VoertuigenComponent = () => {
    const [voertuigen, setVoertuigen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { logout } = useAccount();
    const navigate = useNavigate();
    const apiBaseUrl = `https://localhost:44318/api/Voertuig`;

    const startDatePickerRef = useRef();
    const endDatePickerRef = useRef();

    // Ophalen van voertuigen bij mounten van component
    useEffect(() => {
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

    // Initialiseren van Flatpickr datepickers
    useEffect(() => {
        if (startDatePickerRef.current) {
            flatpickr(startDatePickerRef.current, {
                dateFormat: "d-m-Y",
                minDate: "today",
                onChange: ([date]) => {
                    setStartDate(date);
                },
            });
        }
        if (endDatePickerRef.current) {
            flatpickr(endDatePickerRef.current, {
                dateFormat: "d-m-Y",
                minDate: startDate, // Einddatum kan niet eerder zijn dan startdatum
                onChange: ([date]) => {
                    setEndDate(date);
                },
            });
        }
    }, [startDate]);

    // Filter voertuigen op zoekterm en beschikbaarheid
    useEffect(() => {
        const filtered = voertuigen.filter((voertuig) => {
            const matchesSearch =
                voertuig.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voertuig.model.toLowerCase().includes(searchTerm.toLowerCase());

            if (!startDate || !endDate) {
                return matchesSearch; // Alleen filteren op zoekterm als er geen datums zijn
            }

            const beschikbaarVan = new Date(voertuig.beschikbaarVan);
            const beschikbaarTot = new Date(voertuig.beschikbaarTot);

            const isAvailable =
                beschikbaarVan <= startDate && beschikbaarTot >= endDate;

            return matchesSearch && isAvailable;
        });

        setFilteredVoertuigen(filtered);
    }, [searchTerm, startDate, endDate, voertuigen]);

    // Afhandelen van uitloggen
    const handleLogout = () => {
        logout();
        navigate('/Inlogpagina');
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

            {/* Zoekveld en datumselectie */}
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Zoek op merk of model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <div className="datepickers">
                    <input
                        type="text"
                        placeholder="Begin datum"
                        ref={startDatePickerRef}
                        className="datepicker-input"
                    />
                    <input
                        type="text"
                        placeholder="Eind datum"
                        ref={endDatePickerRef}
                        className="datepicker-input"
                    />
                </div>
            </div>

            {/* Weergave van voertuigen */}
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
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VoertuigenComponent;
