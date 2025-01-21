import { useEffect, useState } from "react";
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
    const navigate = useNavigate();
    const { currentAccount, logout } = useAccount();


    // Haal de voertuigen op
    const fetchReserveringen = async () => {
        try {
            const url = `https://localhost:44318/Reservering/GetReserveringen?accountId=${currentAccount.accountId}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Netwerkfout (${response.status}): ${response.statusText}`);
            }
            const data = await response.json();
            setReserveringen(data.$values || []);
            console.log(reserveringen)
        } catch (err) {
            console.error(err);
            setError(`Kan voertuigen niet ophalen: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReserveringen();
    }, [currentAccount.accountId]);

    const DeleteReserveer = async (ReserveringId) => {
        setDeleting(ReserveringId);
        try {
            const url = `https://localhost:44318/Reservering/Delete?reserveringId=${ReserveringId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Verwijder de reservering direct uit de lokale staat
                setReserveringen((prevReserveringen) =>
                    prevReserveringen.filter((reservering) => reservering.reserveringId !== ReserveringId)
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


    const handleReserveringClick = (reserveringId) => {
        navigate('ReserveringWijzigen', { state: { reserveringId } });
    };



    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            <header className="header">
                <h1>Mijn Reserveringen</h1>

            </header>

            <div className="voertuigen-grid">
                {reserveringen.length === 0 ? (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                ) : (
                    reserveringen.map((reservering) => (
                        <div key={reservering.reserveringId} className="voertuig-card">
                            <div className="voertuig-photo">
                                <img
                                    className="voertuig-photo"
                                    src={carAndAllLogo}
                                    alt="CarAndAll Logo"
                                />
                            </div>
                            <div className="voertuig-info">
                                <h3 className="kenteken">ReserveringId #{}</h3>
                                <p><strong>Voertuigtype:</strong> {reservering.voertuig.voertuigType}</p>
                                <p><strong>Begindatum:</strong> {formatDatum(reservering.begindatum)}</p>
                                <p><strong>Einddatum:</strong> {formatDatum(reservering.einddatum)}</p>
                                <p>
                                    <strong>Betalingsstatus:</strong> {reservering.isBetaald ? "Betaald" : `Nog te betalen €${reservering.totaalPrijs || 0}`}
                                </p>

                                {/* Knop voor details */}
                                <div className="button-container">
                                    <button
                                        className="details-button"
                                        onClick={() => setShowDetails(showDetails === reservering.reserveringId ? null : reservering.reserveringId)}
                                    >
                                        {showDetails === reservering.voertuigId ? "Verberg Details" : "Toon Details"}
                                    </button>
                                    <button
                                        className="fetusDeletus"
                                        disabled={deleting === reservering.reserveringId}
                                        onClick={() => DeleteReserveer(reservering.reserveringId)}
                                    >
                                        {deleting === reservering.reserveringId ? "Verwijderen..." : "Verwijder reservering"}
                                    </button>
                                </div>

                                {/* Details tonen als de knop is ingedrukt */}
                                {showDetails === reservering.reserveringId && reservering.voertuig && (
                                    <div className="voertuig-details">
                                        <p><strong>Kenteken:</strong> {reservering.voertuig.kenteken}</p>
                                        <p><strong>Voertuig:</strong> {reservering.voertuig.merk} {reservering.voertuig.model}</p>
                                        <p><strong>Kleur:</strong> {reservering.voertuig.kleur}</p>
                                        <p><strong>Aanschafjaar:</strong> {reservering.voertuig.aanschafjaar}</p>
                                        <p><strong>Brandstoftype:</strong> {reservering.voertuig.brandstofType}</p>
                                        <p><strong>Totaalprijs:</strong> €{reservering.voertuig.totaalPrijs}</p>

                                        <button onClick={() => handleReserveringClick(reservering.reserveringId)}>
                                            Wijzig Reservering
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
