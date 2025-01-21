import React, { useState, useEffect } from "react";
import {unstable_setDevServerHooks, useNavigate} from 'react-router-dom';
import { useAccount } from "../Login/AccountProvider.jsx"; // Zorg dat de context beschikbaar is
//import ".VoertuigenSelectie.css"; // Import CSS classes
import carAndAllLogo from '../assets/CarAndAll_Logo.webp';
import VoertuigenComponent from "../VoertuigenSelectie.jsx";
import SchademeldingenBekijken from "./SchademeldingenBekijken.jsx"; // Gebruik één afbeelding

const Schadeclaimmaken = () => {
    const [voertuigen, setVoertuigen] = useState([]); // State for storing vehicles
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for handling errors
    const [selectedVoertuig, setSelectedVoertuig] = useState(null);
    const [beschrijving, setbeschrijving] = useState("");
    const [datum, setDatum] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]);

    const { logout } = useAccount(); // Gebruik de logout-functie vanuit de context
    const navigate = useNavigate(); // Voor navigatie

    const apiBaseUrl = `https://localhost:44318/api/Voertuig`; // API endpoint to get all vehicles

    // Fetch voertuigen when the component is mounted
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

    const handleSchadeclaim = async (id) => {


        const data = {
            voertuigId: id,
            beschrijving: beschrijving,
            datum: datum,
        }

        try {
            // Verstuur het POST-verzoek naar de backend
            const response = await fetch('https://localhost:44318/api/', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });

        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan! Fout details: ' + JSON.stringify(error, null, 2));
        }
    }
    useEffect(() => {
        const filtered = voertuigen.filter((voertuig) => {
            return (
                voertuig.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voertuig.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredVoertuigen(filtered); // Update filtered vehicles based on search
    }, [searchTerm, voertuigen]); // Run whenever searchTerm or vehicles changes

    const handleHoofdmenu = () => {
        navigate("/HoofdschermBackoffice");
    }
    const SchadeclaimToevoegen = (id) => {
        setSelectedVoertuig(id);
    };
    const handleBeschrijvingChange = (e) => {
        setbeschrijving(e.target.value);

    };
    const handleSchadeclaimSubmit = (id) => {
        handleSchadeclaim(id);

        setDatum('');
        setSelectedVoertuig(null);
        setbeschrijving('');
    }


    // Nieuwe logout functie
    const handleLogout = () => {
        logout(); // Roep de logout-functie aan
        navigate('/Inlogpagina'); // Navigeren naar inlogpagina
    };



    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">

            <header className="header">
                <h1>Schadeclaims maken</h1>
                <div className="header-buttons">
                    <button className="button small" onClick={handleHoofdmenu}>
                        Hoofdmenu
                    </button>
                    <button className="button small" onClick={handleLogout}>
                        Log uit
                    </button>
                </div>
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
                                <p><strong>Status:</strong> {voertuig.voertuigStatus}</p>
                                <button
                                    onClick={() => SchadeclaimToevoegen(voertuig.voertuigId)}>SchadeclaimToevoegen
                                </button>
                                {voertuig.voertuigId === selectedVoertuig && (
                                    <div className="comment-section">
                                    <textarea
                                        placeholder="Voeg de beschrijving toe"
                                        value={beschrijving}
                                        onChange={(e) => handleBeschrijvingChange(e)}
                                    />
                                        <p>Datum van Schade:</p>
                                        <input
                                            type="date"
                                            id="datum"
                                            placeholder="Kies datum"
                                            className="flatpickr-calander"
                                            value={datum}
                                            onChange={(e) => setDatum(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                        />

                                        <button style={{ marginBottom: "10px",
                                        marginTop: "5px",
                                        }}
                                            onClick={() => handleSchadeclaimSubmit(voertuig.voertuigId)}>
                                            Verzenden
                                        </button>
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

export default Schadeclaimmaken;