import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "../VoertuigenSelectie.css";

import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx";
import carAndAllLogo from "../assets/CarAndAll_Logo.webp"; // Gebruik de useAccount hook om de context te gebruiken

function VerhuurAanvragen() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const [voertuigen, setVoertuigen] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null);
    const [showCommentField, setShowCommentField] = useState(false);
    const [comment, setComment] = useState("");
    const [selectedReserveringId, setSelectedReserveringId] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const apiBaseUrl = `https://localhost:44318/api/Voertuig`;

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });
    useEffect(() => {
        const fetchVoertuigen = async () => {
            try {
                const url = `${apiBaseUrl}/gereserveerdevoertuigen`;
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
                setError("Kan reserveringen niet ophalen"); // Set error if fetch fails
                setLoading(false); // Set loading to false after error
            }
        };

        fetchVoertuigen();
    }, []);
    const handleLogout = () => {
        LogUit(); // Roep de logout-functie aan
        navigate('/Inlogpagina'); // Navigeren naar inlogpagina
    };
    const handleHoofdmenu = () => {
        navigate('/HoofdschermBackoffice'); // Navigeren naar inlogpagina
    };

    const handleGoedkeuren = (id) => {
        setSelectedReserveringId(id);
        setShowCommentField(true); // Toon het commentaarveld
        setSelectedAction(true);
    };

    const handleCommentChange = (e, id) => {
        setComment(e.target.value);

    };
    const verstuurdata = async (event, id) => {
        event.preventDefault(); // Voorkomt dat het formulier standaard wordt ingediend

        const data = {
            reserveringId : id,
            comment : comment,
            keuze : selectedAction
        }

        try {
            // Verstuur het POST-verzoek naar de backend
            await fetch('https://localhost:44318/api/accountmedewerkerbackoffice/verhuuraanvraagkeuren', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        }
        catch (error) {
                // Foutafhandelingslogica
                console.error('Er is een fout opgetreden:', error.message);
                alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
            }
    }


    const handleCommentSubmit = (id) => {
        alert(`Commentaar verzonden: ${comment} voor ${id}`);
        setShowCommentField(false);
        setSelectedReserveringId(null)
        setComment("");
        verstuurdata(id);
    };

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };
    const handleAfkeuren = (id) => {
        setSelectedReserveringId(id)
        setShowCommentField(true);
        setSelectedAction(false);
    };

    return (
        <div className="voertuigen-container">

            <header className="header">
                <h1>Verhuur aanvragen goedkeuren</h1>
                <button className="logout-button small" onClick={handleHoofdmenu}>
                    Hoofdmenu
                </button>
                <button className="logout-button small" onClick={handleLogout}>
                    Log uit
                </button>

            </header>
            <div className="voertuigen-grid">
                {voertuigen.length === 0 ? (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                ) : (
                    voertuigen.map((voertuig) => (
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
                                <p><strong>Begindatum:</strong> {voertuig.begindatum}</p>
                                <p><strong>Einddatum:</strong> {voertuig.einddatum}</p>
                                <p><strong>Status:</strong> {voertuig.voertuigStatus}</p>
                                <button onClick={() => handleGoedkeuren(voertuig.voertuigId)}
                                        style={{
                                            backgroundColor: selectedAction === true && selectedReserveringId === voertuig.voertuigId ? 'grey' : '#040404',
                                        }}
                                >
                                    Goedkeuren
                                </button>
                                <button onClick={() => handleAfkeuren(voertuig.voertuigId)}
                                        style={{
                                            backgroundColor: selectedAction === false && selectedReserveringId === voertuig.voertuigId ? 'grey' : '#040404',
                                        }}>
                                    Afkeuren
                                </button>
                            </div>
                            {selectedReserveringId === voertuig.voertuigId && (
                                <div >
                                      <textarea
                                          placeholder="Voeg hier een opmerking toe..."
                                          value={comment}
                                          onChange={(e) => handleCommentChange(e, voertuig.voertuigId)}
                                      />
                                    <button  onClick={() => handleCommentSubmit(voertuig.voertuigId)}>
                                        Verzenden
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default VerhuurAanvragen;
