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

    const { currentAccountId, logout } = useAccount();
    const apiBaseUrl = `https://localhost:44318/api/Voertuig`;

    // Haal de voertuigen op
    useEffect(() => {
        const fetchReserveringen = async () => {
            setLoading(true);
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

        fetchReserveringen();
    }, [currentAccountId]);

    const formatDatum = (datum) => {
        const date = new Date(datum);
        return date.toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

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
                                        onClick={() => handleReserveer(voertuig.voertuigId)}
                                    >
                                        Verwijder reservering
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
