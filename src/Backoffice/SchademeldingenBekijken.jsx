import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './HoofdschermFrontoffice.css';
import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken

function SchademeldingenBekijken() {
    const navigate = useNavigate();
    const {currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const [schademeldingen, setSchademeldingen] = useState([]);
    const [selectedSchademelding, setSelectedSchademelding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(30); // Resterende tijd voor de bevestiging
    const [timerActive, setTimerActive] = useState(false); // Om de timer aan en uit te zetten
    const [showConfirm, setShowConfirm] = useState(null); // Voor bevestiging van reserveren
    const [comment, setComment] = useState("");
    const [showCommentField, setShowCommentField] = useState(false);

    const apiBaseUrl ='https://localhost:44318/api/';
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });

    useEffect(() => {
        const fetchSchademeldingen = async () => {
            try {
                const url = `${apiBaseUrl}/voertuigMetSchademeldingen`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Netwerkfout: " + response.statusText);
                }
                const data = await response.json();

                const schademledingenArray = data.$values || [];

                setSchademeldingen(schademledingenArray); // Set the vehicles data
                setLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                console.log(err)
                setError("Kan schademeldingen niet ophalen"); // Set error if fetch fails
                setLoading(false); // Set loading to false after error
            }
            finally {
                setTimeout(() => {
                    setLoading(false); // Zet loading op false na de vertraging
                }, 1000); // Stel de vertraging in, bijvoorbeeld 1000ms (1 seconde)
            }
        };
    })
    const handleInReparatie = async (id) => {


        const data = {
            schadeclaimId: id,
            status: "in repartie"
        }
        console.log(data);

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
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
        }
    }

    const showInReparatieConfirm = (schademeldingId) => {
        setSelectedSchademelding(schademeldingId); // Zet het geselecteerde voertuig
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
            cancelInReparatie();
        }


        // Cleanup de timer wanneer de component unmount
        return () => clearInterval(timer);
    }, [timerActive, timeRemaining]);

    const cancelInReparatie = () => {
        setShowConfirm(false); // Annuleer de bevestigingsdialoog
        setSelectedSchademelding(null); // Reset het geselecteerde voertuig
        setTimerActive(false); // Zet de timer uit
    };
    const confirmInReparatie = () => {
        if (selectedSchademelding !== null) {
            handleInReparatie(selectedSchademelding); // Bevestig de reservering
            setShowConfirm(false); // Sluit de bevestigingsdialoog
            setTimerActive(false); // Zet de timer uit
        }
    };
    const handleCommentChange = (e, id) => {
        setComment(e.target.value);

    };
    const handleCommentSubmit = (id) => {
        verstuurdata(id);
        alert(`Commentaar verzonden: ${comment} voor ${id}`);
        setShowCommentField(false);
        setSelectedSchademelding(null);
        setComment("");

    };

    const handleHoofdmenu = () => {
        navigate('/HoofdschermBackoffice'); // Navigeren naar inlogpagina
    };

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };
    const handleLogout = () => {
        LogUit(); // Roep de logout-functie aan
        navigate('/Inlogpagina'); // Navigeren naar inlogpagina
    };

    return (
        <div>

            <header className="header">

                <div className="header-buttons">
                    <button className="button small" onClick={handleHoofdmenu}>
                        Hoofdmenu
                    </button>
                    <button className="button small" onClick={handleLogout}>
                        Log uit
                    </button>
                </div>
            </header>
            <div className="hoofdscherm-container">
                <img src={logo} alt="Carandall Logo"/>
                <h1>Schademeldingen</h1>
                {schademeldingen.length === 0 ? (
                    <div className="no-vehicles">Geen schademeldingen gevonden</div>
                    ) : ( schademeldingen.map((schademelding) => (
                        <div key={schademelding.schadeclaimId} className="voertuig-card">

                            <p><strong>Kenteken:</strong> {schademelding.kenteken}</p>
                            <p><strong>Voertuig:</strong> {schademelding.merk} {schademelding.model}</p>
                            <p><strong>Kleur:</strong> {schademelding.kleur}</p>
                            <p><strong>Aanschafjaar:</strong> {schademelding.aanschafjaar}</p>
                            <p><strong>Brandstoftype:</strong> {schademelding.brandstofType}</p>
                            <p><strong>Datum van schade:</strong>{schademelding.datum}</p>
                            <p><strong>Schadebeschrijving:</strong>{schademelding.beschrijving}</p>

                            {!showConfirm && (
                            <button onClick={showInReparatieConfirm}>In reparatie</button>
                            )}
                            {showConfirm && selectedSchademelding === schademelding.schadeclaimId && (
                                <div>
                                    <p className="Confirmatievraag">Weet je het zeker? ({timeRemaining}s)</p>
                                    <button className="AnnuleerKnop" onClick={cancelInReparatie}>Stop</button>
                                    <button className="ReserveerKnop" onClick={confirmInReparatie}>Ja Reserveer</button>
                                </div>
                            )}
                            {selectedSchademelding === schademelding.schadeclaimId && (
                                <div className="comment-section">
                                    <textarea
                                        placeholder="Voeg hier een opmerking toe..."
                                        value={comment}
                                        onChange={(e) => handleCommentChange(e, schademelding.schadeclaimId)}
                                    />
                                    <button onClick={() => handleCommentSubmit(schademelding.schadeclaimId)}>
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

export default SchademeldingenBekijken;
