import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../Login/AccountProvider.jsx";
import "../VoertuigenSelectie.css";
import carAndAllLogo from '../assets/CarAndAll_Logo.webp';

const MijnReserveringen = () => {
    const [reserveringen, setReserveringen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const { currentAccountId, logout } = useAccount();
    const apiBaseUrl = `https://localhost:44318/api/Voertuig`;

    // Haal de voertuigen op
    const fetchReserveringen = async () => {
        try {
            const url = `${apiBaseUrl}/krijgallevoertuigenAccount?accountId=${currentAccountId}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Netwerkfout (${response.status}): ${response.statusText}`);
            }
            const data = await response.json();
            setReserveringen(data.$values || []);
        } catch (err) {
            console.error(err);
            setError(`Kan voertuigen niet ophalen: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReserveringen();
    }, [currentAccountId]);

    const DeleteReserveer = async (ReserveringId) => {
        setDeleting(ReserveringId);
        try {
            const url = `https://localhost:44318/api/Reservering/VerwijderReservering?reserveringId=${ReserveringId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Verwijder de reservering direct uit de lokale staat
                setReserveringen((prevReserveringen) =>
                    prevReserveringen.filter((reservering) => reservering.reserveringsId !== ReserveringId)
                );
                showNotification(ReserveringId, "red", "Verwijderd", 3000);
            } else {
                throw new Error(`Verwijderen mislukt: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Fout bij reserveren:", error);
        } finally {
            setDeleting(null);
        }
    };

    const formatDatum = (datum) => {
        const date = new Date(datum);
        return date.toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    let timeoutId; // Variabele om de timer bij te houden

    function showNotification(ReserveringId, bgColor, actie, duration) {
        const notification = document.getElementById("notification");
        const notificationText = document.getElementById("notificationText");
        const progressBar = document.getElementById("progressBar");

        // Tekst aanpassen
        notificationText.innerHTML = "Reservering #" + ReserveringId + " " + actie;

        // Achtergrondkleur instellen
        notification.style.backgroundColor = bgColor;

        // Annuleer bestaande timer en animatie
        if (timeoutId) {
            clearTimeout(timeoutId);
            progressBar.classList.remove("animated"); // Reset animatie
            void progressBar.offsetWidth; // Forceer hertekening
        }

        // Start progressBar-animatie opnieuw
        progressBar.style.animationDuration = `${duration}ms`;
        progressBar.classList.add("animated");

        // Toon de notificatie
        notification.classList.remove("hidden");
        notification.classList.add("visible");

        // Stel een nieuwe timeout in
        timeoutId = setTimeout(() => {
            notification.classList.remove("visible");
            notification.classList.add("hidden");
            progressBar.classList.remove("animated"); // Stop de animatie
        }, duration);
    }


    function WijzigReservering() {

    }



    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            <header className="header">
                <h1>Mijn Reserveringen</h1>
                <button className="logout-button small" onClick={logout}>
                    Log uit
                </button>
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

                                {/* Knop voor details */}
                                <div className="button-container">
                                    <button
                                        className="details-button"
                                        onClick={() => setShowDetails(showDetails === voertuig.voertuigId ? null : voertuig.voertuigId)}
                                    >
                                        {showDetails === voertuig.voertuigId ? "Verberg Details" : "Toon Details"}
                                    </button>
                                    <button
                                        className="fetusDeletus"
                                        disabled={deleting === voertuig.reserveringsId}
                                        onClick={() => DeleteReserveer(voertuig.reserveringsId)}
                                    >
                                        {deleting === voertuig.reserveringsId ? "Verwijderen..." : "Verwijder reservering"}
                                    </button>
                                </div>

                                {/* Details tonen als de knop is ingedrukt */}
                                {showDetails === voertuig.voertuigId && (
                                    <div className="voertuig-details">
                                        <p><strong>Kenteken:</strong> {voertuig.kenteken}</p>
                                        <p><strong>Voertuig:</strong> {voertuig.merk} {voertuig.model}</p>
                                        <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                        <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                        <p><strong>Brandstoftype:</strong> {voertuig.brandstofType}</p>
                                        <p><strong>Totaalprijs:</strong> €{voertuig.totaalPrijs}</p>

                                        <button className="ReserveringWijzigenKnop" onClick={WijzigReservering}>
                                            Wijzigen
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div id="notification" className="hidden">
                <div id="notificationText"></div>
                <div id="progressBar"></div>
            </div>

        </div>
    );
};

export default MijnReserveringen;
