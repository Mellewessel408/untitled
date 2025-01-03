import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccount } from "../Login/AccountProvider.jsx";
import "../VoertuigenSelectie.css";
import carAndAllLogo from '../assets/CarAndAll_Logo.webp';

const ReserveringWijzigen = () => {
    const { currentAccountId, logout } = useAccount();
    const navigate = useNavigate();

    const [mijnVoertuig, setMijnVoertuig] = useState(null);
    const [voertuigen, setVoertuigen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]);
    const [begindatum, setBegindatum] = useState(null);
    const [einddatum, setEinddatum] = useState(null);
    const [showDetails, setShowDetails] = useState(null); // Show details voor geselecteerd voertuig
    const [showConfirm, setShowConfirm] = useState(null); // Voor bevestiging van reserveren
    const [selectedVoertuig, setSelectedVoertuig] = useState(null); // Voor het geselecteerde voertuig om te reserveren
    const [timeRemaining, setTimeRemaining] = useState(30); // Resterende tijd voor de bevestiging
    const [timerActive, setTimerActive] = useState(false); // Om de timer aan en uit te zetten
    const [reservering, setReservering] = useState();
    const location = useLocation();
    const { reserveringId } = location.state || {}; // Haal de reserveringId op uit de state

// Haal de voertuigen op
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('inlogpagina');
            return;
        }
        console.log("Geselecteerde reservering ID: ", reserveringId);
        setReservering(reserveringId);
        fetchVoertuigen(reserveringId);

    }, [currentAccountId, navigate, reserveringId]);








    const fetchVoertuigen = async (reserveringId) => {
        setLoading(true);

        try {
            const url = `https://localhost:44318/api/Reservering/KrijgMijnReservering?reserveringId=` + reserveringId;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Netwerkfout (${response.status}): ${response.statusText}`);
            }
            const data = await response.json();
            setMijnVoertuig({ ...data });
            console.log(data);
            setBegindatum(data.begindatum);
            setEinddatum(data.einddatum);

            const url2 = `https://localhost:44318/api/Voertuig/krijgallevoertuigenDatum?begindatum=${data.begindatum}&einddatum=${data.einddatum}`;
            const response2 = await fetch(url2);
            if (!response2.ok) {
                throw new Error(`Netwerkfout (${response2.status}): ${response2.statusText}`);
            }
            const data2 = await response2.json();
            setVoertuigen(data2.$values || []);
        } catch (err) {
            console.error(err);
            setError(`Kan voertuigen niet ophalen: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

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



    // Logout functie
    const handleLogout = () => {
        logout();
        navigate('/Inlogpagina');
    };

    // Reserveer functie
    const handleReserveer = async (voertuigId) => {
            const data = {
                begindatum: begindatum,
                einddatum : einddatum,
                voertuigId: voertuigId,
                AccountId: currentAccountId
            };

        setLoading(true);
        try {
            const url = `https://localhost:44318/api/Reservering/PutReservering?reserveringId=` + reservering;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Netwerkfout (${response.status}): ${response.statusText}`);
            }


            setVoertuigen((prevVoertuigen) =>
                prevVoertuigen.map((voertuig) =>
                    voertuig.voertuigId === voertuigId
                        ? { ...voertuig, voertuigStatus: "Gereserveerd" }
                        : voertuig
                )
            );
            navigate('/HoofdschermParticulier/MijnReserveringen');
        } catch (error) {
            console.error("Fout bij reserveren:", error);
            alert("Er is een probleem opgetreden bij het reserveren van het voertuig.");
        }

    };

    // Functie om details van het voertuig weer te geven
    const toggleDetails = (voertuigId) => {
        setShowDetails(showDetails === voertuigId ? null : voertuigId); // Toggle details
    };

    // Bevestig reservering
    const showReservationConfirm = (voertuigId) => {
        if (begindatum == null || einddatum == null) {
            alert(`Fout bij reserveren: Vul een datum in.`);
            return;
        }

        setSelectedVoertuig(voertuigId); // Zet het geselecteerde voertuig
        setShowConfirm(true); // Zet de bevestiging dialoog op true
        setTimeRemaining(30); // Zet de timer op 30 seconden

        // Start de timer
        setTimerActive(true);
    };

    useEffect(() => {
        let timer;

        if (timerActive && timeRemaining > 0) {
            // Verminder de tijd elke seconde
            timer = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            // Annuleer de reservering als de tijd op is
            cancelReservation();
        }

        // Cleanup de timer wanneer de component unmount
        return () => clearInterval(timer);
    }, [timerActive, timeRemaining]);

    const cancelReservation = () => {
        setShowConfirm(false); // Annuleer de bevestigingsdialoog
        setSelectedVoertuig(null); // Reset het geselecteerde voertuig
        setTimerActive(false); // Zet de timer uit
    };

    const confirmReservation = () => {
        if (selectedVoertuig !== null) {
            handleReserveer(selectedVoertuig); // Bevestig de reservering
            setShowConfirm(false); // Sluit de bevestigingsdialoog
            setTimerActive(false); // Zet de timer uit
        }
    };



    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            <header className="header">
                <h1>Reservering wijzigen</h1>
                <button className="logout-button small" onClick={handleLogout}>
                    Log uit
                </button>
            </header>

            <div className="search-filter">
                <input
                    type="date"
                    id="begindatum"
                    placeholder="Kies begindatum"
                    className="flatpickr-calander"
                    value={begindatum}
                    onChange={(e) => setBegindatum(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                />
                <input
                    type="date"
                    id="einddatum"
                    placeholder="Kies einddatum"
                    className="flatpickr-calander"
                    value={einddatum}
                    onChange={(e) => {
                        const newEinddatum = e.target.value;
                        setEinddatum(newEinddatum);
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
                {/* Huidige reservering */}
                {mijnVoertuig && (
                    <div className="huidige-reservering">
                        {/*<h2>Huidige reservering</h2>*/}
                        <div className="voertuig-card">
                            <div className="voertuig-photo">
                                <img
                                    className="voertuig-photo"
                                    src={carAndAllLogo}
                                    alt="CarAndAll Logo"
                                />
                            </div>
                            <div className="voertuig-info">
                                <h3 className="kenteken">Jouw Reservering (#{mijnVoertuig.reserveringsId})</h3>
                                <p><strong>Voertuigtype:</strong> {mijnVoertuig.voertuigType}</p>
                                <p><strong>Voertuig:</strong> {mijnVoertuig.merk} {mijnVoertuig.model}</p>
                                <p>
                                    <strong>Begindatum:</strong> {new Date(mijnVoertuig.begindatum).toLocaleDateString("nl-NL")}
                                </p>
                                <p>
                                    <strong>Einddatum:</strong> {new Date(mijnVoertuig.einddatum).toLocaleDateString("nl-NL")}
                                </p>

                                <button
                                    className="behoud-reservering-button"
                                    onClick={() => alert("Reservering behouden!")}
                                >
                                    Behoud reservering
                                </button>
                            </div>
                        </div>
                    </div>
                )}


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
                                <p><strong>Voertuigtype:</strong> {voertuig.voertuigType}</p>

                                {/* Als de bevestigingsdialoog nog niet getoond is */}
                                {!showConfirm && (
                                    <div className="button-container">
                                        <button
                                            className="reserveer-button"
                                            onClick={() => handleReserveer(voertuig.voertuigId)}
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
                                )}

                                {showConfirm && selectedVoertuig === voertuig.voertuigId && (
                                    <div>
                                        <p className="Confirmatievraag">Weet je het zeker? ({timeRemaining}s)</p>
                                        <button className="AnnuleerKnop" onClick={cancelReservation}>Stop</button>
                                        <button className="ReserveerKnop" onClick={confirmReservation}>Ja
                                            Reserveer
                                        </button>
                                    </div>
                                )}

                                {/* Details tonen als de knop is ingedrukt */}
                                {showDetails === voertuig.voertuigId && (
                                    <div className="voertuig-details">
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

export default ReserveringWijzigen;
