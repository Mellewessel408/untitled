import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import "../VoertuigenSelectie.css";

import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx";
import carAndAllLogo from "../assets/CarAndAll_Logo.webp"; // Gebruik de useAccount hook om de context te gebruiken

function VerhuurAanvragen() {
    const navigate = useNavigate();
    const {currentAccountId, logout} = useAccount(); // Haal de currentAccountId uit de context
    const [reserveringen, setReservering] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null);
    const [showCommentField, setShowCommentField] = useState(false);
    const [comment, setComment] = useState("");
    const [selectedReserveringId, setSelectedReserveringId] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const apiBaseUrl = `https://localhost:44318/api`;

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });
    useEffect(() => {
        const fetchReserveringen = async () => {
            try {
                const response = await fetch("https://localhost:44318/api/reservering/GetAlleVoertuigenMetReserveringen");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setReservering(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            fetchReserveringen();
        }
    });


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
                reserveringId: id,
                comment: comment,
                keuze: selectedAction
            }

            try {
                // Verstuur het POST-verzoek naar de backend
                await fetch('https://localhost:44318/api/accountmedewerkerbackoffice/verhuuraanvraagkeuren', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data),
                });
            } catch (error) {
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
                <div className="header-buttons">
                    <button className="button small" onClick={handleHoofdmenu}>
                        Hoofdmenu
                    </button>
                    <button className="button small" onClick={handleLogout}>
                        Log uit
                    </button>
                </div>
            </header>

            <div className="voertuigen-grid">
                {reserveringen.length === 0 ? (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                ) : (
                    reserveringen.map((voertuig) => (
                        <div key={voertuig.voertuigId} className="voertuig-card">
                            <div className="voertuig-photo">
                                <img
                                    className="photo"
                                    src={carAndAllLogo}
                                    alt={`${voertuig.merk} ${voertuig.model}`}
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

                                <div className="voertuig-actions">
                                    <button
                                        onClick={() => handleGoedkeuren(voertuig.voertuigId)}
                                        disabled={selectedAction === true && selectedReserveringId === voertuig.voertuigId}
                                        style={{
                                            backgroundColor:
                                                selectedAction === true && selectedReserveringId === voertuig.voertuigId
                                                    ? 'grey'
                                                    : '#040404',
                                        }}
                                    >
                                        Goedkeuren
                                    </button>
                                    <button
                                        onClick={() => handleAfkeuren(voertuig.voertuigId)}
                                        disabled={selectedAction === false && selectedReserveringId === voertuig.voertuigId}
                                        style={{
                                            backgroundColor:
                                                selectedAction === false && selectedReserveringId === voertuig.voertuigId
                                                    ? 'grey'
                                                    : '#040404',
                                        }}
                                    >
                                        Afkeuren
                                    </button>
                                </div>
                            </div>

                            <div className="reserveringen-section">
                                <h4>Reserveringen</h4>
                                {voertuig.reserveringen.length > 0 ? (
                                    <ul className="reserveringen-list">
                                        {voertuig.reserveringen.map((reservering) => (
                                            <li key={reservering.reserveringId}>
                                                <p><strong>Reservering ID:</strong> {reservering.reserveringId}</p>
                                                <p><strong>Begindatum:</strong> {new Date(reservering.begindatum).toLocaleDateString()}</p>
                                                <p><strong>Einddatum:</strong> {new Date(reservering.einddatum).toLocaleDateString()}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Geen reserveringen beschikbaar</p>
                                )}
                            </div>

                            {selectedReserveringId === voertuig.voertuigId && (
                                <div className="voertuig-comment-section">
                                <textarea
                                    placeholder="Voeg hier een opmerking toe..."
                                    value={comment}
                                    onChange={(e) => handleCommentChange(e, voertuig.voertuigId)}
                                    className="comment-textarea"
                                />
                                    <button
                                        onClick={() => handleCommentSubmit(voertuig.voertuigId)}
                                        className="button submit-comment"
                                    >
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
