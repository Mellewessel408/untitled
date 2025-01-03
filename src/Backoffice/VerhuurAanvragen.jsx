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
                                    className="voertuig-photo"
                                    src={carAndAllLogo}
                                    alt="CarAndAll Logo"
                                />
                            </div>
                            <div className="voertuig-info">
                                <h3 className="kenteken">ReserveringsId #{voertuig.reserveringsId}</h3>
                                <p><strong>Voertuigtype:</strong> {voertuig.voertuigType}</p>
                                <p><strong>Begindatum:</strong> {formatDatum(voertuig.begindatum)}</p>
                                <p><strong>Einddatum:</strong> {formatDatum(voertuig.einddatum)}</p>
                                <p>
                                    <strong>Betalingsstatus:</strong> {voertuig.isBetaald ? "Betaald" : `Nog te betalen €${voertuig.totaalPrijs || 0}`}
                                </p>




                                    <div className="voertuig-details">
                                        <p><strong>Kenteken:</strong> {voertuig.kenteken}</p>
                                        <p><strong>Voertuig:</strong> {voertuig.merk} {voertuig.model}</p>
                                        <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                        <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                        <p><strong>Brandstoftype:</strong> {voertuig.brandstofType}</p>
                                        <p><strong>Totaalprijs:</strong> €{voertuig.totaalPrijs}</p>
                                    </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

}

export default VerhuurAanvragen;
