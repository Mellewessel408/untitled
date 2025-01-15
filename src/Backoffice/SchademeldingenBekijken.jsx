import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import './HoofdschermFrontoffice.css';
import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken
import '../VoertuigenSelectie.css';

function SchademeldingenBekijken() {
    const navigate = useNavigate();
    const {currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context

    const [selectedSchademelding, setSelectedSchademelding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(30); // Resterende tijd voor de bevestiging
    const [timerActive, setTimerActive] = useState(false); // Om de timer aan en uit te zetten
    const [showConfirm, setShowConfirm] = useState(null); // Voor bevestiging van reserveren
    const [comment, setComment] = useState("");
    const [showCommentField, setShowCommentField] = useState(false);
    const [showCommentField2, setShowCommentField2] = useState(false);
    const [selectedForComment, setSelectedForComment] = useState(null);
    const [selectedReparatie, setSelectedReparatie] = useState(null);
    const [reparatie, setReparatie] = useState('');
    const [datum, setDatum] = useState('')
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [status, setStatus] = useState(null);
    const schademeldingentest = [
        {
            schadeclaimId: 1,
            kenteken: "AB-123-CD",
            merk: "Toyota",
            model: "Corolla",
            kleur: "Blauw",
            aanschafjaar: 2019,
            brandstofType: "Benzine",
            datum: "2025-01-05",
            beschrijving: "Kleine deuk aan de linkerkant.",
        },
        {
            schadeclaimId: 2,
            kenteken: "EF-456-GH",
            merk: "Volkswagen",
            model: "Golf",
            kleur: "Rood",
            aanschafjaar: 2020,
            brandstofType: "Diesel",
            datum: "2025-01-01",
            beschrijving: "Schade aan de achterbumper door aanrijding.",
        },
        {
            schadeclaimId: 3,
            kenteken: "IJ-789-KL",
            merk: "Tesla",
            model: "Model 3",
            kleur: "Wit",
            aanschafjaar: 2022,
            brandstofType: "Elektrisch",
            datum: "2025-01-04",
            beschrijving: "Kras op de linkerportier.",
        },
    ];
    const [schademeldingen, setSchademeldingen] = useState(schademeldingentest);


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

                const schademeldingenArray = data.$values || [];

                setSchademeldingen(schademeldingenArray); // Set the vehicles data
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
    const verstuurdata = async (id) => {


        const data = {
            schadeclaimId: id,
            comment: comment,
        }
        console.log(data);

        try {
            // Verstuur het POST-verzoek naar de backend
            const response = await fetch('https://localhost:44318/api', {
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
    const handleCommentChange = (e) => {
        setComment(e.target.value);

    };
    const handleCommentSubmit = (id) => {
        verstuurdata(id);
        alert(`Commentaar verzonden: ${comment} voor ${id}`);
        setShowCommentField(false);
        setSelectedForComment(null);
        setComment("");
    };
    const showComment = (id) => {
        setSelectedForComment(id)
        setShowCommentField(true);
    };
    const verstuur = () => {
       // verstuurReparatie();
        setShowCommentField(false);
        setSelectedReparatie(null);
        setReparatie('');
    }
    const handleHoofdmenu = () => {
        navigate('/HoofdschermBackoffice'); // Navigeren naar inlogpagina
    };
    const openReparatie = (id) => {
        setSelectedReparatie(id)
        setShowCommentField2(true)
    }

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };
    const handleLogout = () => {
        LogUit(); // Roep de logout-functie aan
        navigate('/Inlogpagina'); // Navigeren naar inlogpagina
    };
    const handleReparatieChange = (e) => {
        setReparatie(e.target.value);
    }
    const handleAfgehandeld = () => {
        setStatus('Afgehandeld');
    };
    const handleInBehandeling = () => {
        setStatus('In behandeling');
    };
    const handleKeuze = () => {


        setSelectedStatus(null);
    };
    const StatusBijwerken = (id) => {
        setSelectedStatus(id)
    }

    return (
        <div className="voertuigen-container">
            <header className="header">
                <h1>Schademeldingen</h1>
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
                {schademeldingen.length === 0 ? (
                    <div className="no-vehicles">Geen schademeldingen gevonden</div>
                ) : (schademeldingen.map((schademelding) => (
                        <div key={schademelding.schadeclaimId} className="voertuig-card">

                            <p><strong>Kenteken:</strong> {schademelding.kenteken}</p>
                            <p><strong>Voertuig:</strong> {schademelding.merk} {schademelding.model}</p>
                            <p><strong>Kleur:</strong> {schademelding.kleur}</p>
                            <p><strong>Aanschafjaar:</strong> {schademelding.aanschafjaar}</p>
                            <p><strong>Brandstoftype:</strong> {schademelding.brandstofType}</p>
                            <p><strong>Datum van schade:</strong>{schademelding.datum}</p>
                            <p><strong>Schadebeschrijving:</strong>{schademelding.beschrijving}</p>

                            {!showConfirm && (
                                <button onClick={ () =>showInReparatieConfirm(schademelding.schadeclaimId)}>In reparatie</button>
                            )}
                            {showConfirm && selectedSchademelding === schademelding.schadeclaimId && (
                                <div>
                                    <p className="Confirmatievraag">Weet je het zeker? ({timeRemaining}s)</p>
                                    <button className="AnnuleerKnop" onClick={cancelInReparatie}>Stop</button>
                                    <button className="ReserveerKnop" onClick={confirmInReparatie}>In Reparatie</button>
                                </div>
                            )}

                            <button style={{ marginTop: "5px" }}
                                onClick={() => showComment(schademelding.schadeclaimId)}>Comment</button>
                            {selectedForComment === schademelding.schadeclaimId && (
                                <div className="comment-section">
                                    <textarea
                                        placeholder="Voeg hier een opmerking toe..."
                                        value={comment}
                                        onChange={(e) => handleCommentChange(e)}
                                    />
                                    <button onClick={() => handleCommentSubmit(schademelding.schadeclaimId)}>
                                        Verzenden
                                    </button>
                                </div>
                            )}
                            <button style={{ marginTop: "5px" }}
                                onClick={ () => openReparatie(schademelding.schadeclaimId)}>
                                Voeg Reparatie toe
                            </button>
                            {selectedReparatie === schademelding.schadeclaimId && (
                                <div className="comment-section">
                                    <textarea
                                        placeholder="Reparatie"
                                        value={reparatie}
                                        onChange={(e) => handleReparatieChange(e)}
                                    />
                                    <p>Datum van Reparatie:</p>
                                    <input
                                        type="date"
                                        id="datum"
                                        placeholder="Kies datum"
                                        className="flatpickr-calander"
                                        value={datum}
                                        onChange={(e) => setDatum(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    <button onClick={() => verstuur() }>
                                        Verstuur
                                    </button>

                                </div>
                            )}
                            <button style={{ marginTop: "5px" }}
                                    onClick={ ()=> StatusBijwerken(schademelding.schadeclaimId)}>Status bijwerken</button>
                            {schademelding.schadeclaimId === selectedStatus && (
                                <div>
                                    <button
                                        onClick={() => handleInBehandeling()}
                                        style={{
                                            marginRight : "3px",
                                            marginTop: "5px",
                                            backgroundColor:
                                                status === 'In behandeling'
                                                    ? 'grey'
                                                    : '#040404',
                                        }}>In behandeling</button>
                                    <button onClick={() => handleAfgehandeld()}style={{
                                        backgroundColor:
                                            status === 'Afgehandeld'
                                                ? 'grey'
                                                : '#040404',
                                    }}>Afgehandeld</button>
                                    <button style={{ marginTop: "5px" }}
                                            onClick={() => handleKeuze()}>Sla keuze op</button>
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
