import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../HoofdschermFrontoffice.css';
import logo from '../assets/CarAndAll_Logo.webp';
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken
import '../VoertuigenSelectie.css';

function SchademeldingenBekijken() {
    const navigate = useNavigate();
    const {currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context

    const [selectedSchademelding, setSelectedSchademelding] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(30); // Resterende tijd voor de bevestiging
    const [timerActive, setTimerActive] = useState(false); // Om de timer aan en uit te zetten
    const [showConfirm, setShowConfirm] = useState(null); // Voor bevestiging van reserveren
    const [selectedReparatie, setSelectedReparatie] = useState(null);
    const [reparatie, setReparatie] = useState('');
    const [datum, setDatum] = useState('')
    const [schademeldingen, setSchademeldingen] = useState([]);


    const apiBaseUrl ='https://localhost:44318/api/Schadeclaim';
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent niet correct ingelogd. U wordt teruggestuurd naar de inlogpagina");
            navigate('/inlogpagina');
        }
    });

    useEffect(() => {

        fetchSchademeldingen();
        console.log(schademeldingen);
    }, []);

    const fetchSchademeldingen = async () => {
        try {
            const url = `https://localhost:44318/api/Schadeclaim/krijgalleSchadeclaims`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Netwerkfout: " + response.statusText);
            }

            const data = await response.json();
            const schadeclaims = data.$values;

            const fetchedSchademeldingen = [];
            for (let schadeclaim of schadeclaims) {
                const url2 = `https://localhost:44318/api/Voertuig/krijgspecifiekvoertuig?id=${schadeclaim.voertuigId}`;
                const response2 = await fetch(url2);

                if (!response2.ok) {
                    alert("Er is iets mis gegaan bij het inladen van de voertuigen");
                    return;
                }

                const data2 = await response2.json();

                const schademelding = {
                    schadeclaimId: schadeclaim.schadeclaimId,
                    kenteken: data2.kenteken,
                    merk: data2.merk,
                    model: data2.model,
                    kleur: data2.kleur,
                    aanschafjaar: data2.aanschafjaar,
                    brandstofType: data2.brandstofType,
                    datum: schadeclaim.datum,
                    beschrijving: schadeclaim.beschrijving,
                    status: schadeclaim.schadeclaimstatus,
                    reparatieId: schadeclaim.reparatieId
                };

                // Als er een reparatieId is, haal de reparatie op
                if (schademelding.reparatieId) {
                    const reparatie = await KrijgReparatie(schademelding.reparatieId); // Reparatie ophalen met reparatieId
                    schademelding.reparatie = reparatie; // Voeg de reparatie toe aan het schademelding object
                }

                fetchedSchademeldingen.push(schademelding);
            }

            setSchademeldingen(fetchedSchademeldingen); // Update de state met alle schademeldingen
        } catch (err) {
            console.log(err);
        }
    };


    const handleReparatieChange = async (e) => {
        setReparatie(e.target.value);
    }

    const handleInReparatie = async (id, status) => {

        try {
            // Verstuur het POST-verzoek naar de backend
            await fetch(`${apiBaseUrl}/UpdateStatus?schadeclaimId=${id}&status=${status}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            });

            fetchSchademeldingen();
        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
        }
    }

    const KrijgReparatie = async (id) => {
        try {
            const response = await fetch(`https://localhost:44318/api/Reparatie/KrijgSpecifiekeReparatie?id=${id}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });

            if (!response.ok) {
                return;
            }
            const data = await response.json();
            console.log(data);  // Controleer wat er precies wordt teruggestuurd
            return data;
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };


    const MaakReparatie = async (id) => {


        const data = {
            beschrijving: reparatie,
            ReparatieDatum: datum,
        }
        console.log(data);

        try {
            // Verstuur het POST-verzoek naar de backend
            const response = await fetch(`https://localhost:44318/api/Reparatie/MaakReparatieAan?schadeclaimId=${id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("Je hebt een reparatie aangemaakt");
            }

        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
        }
        fetchSchademeldingen();
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
    const confirmInReparatie = (status) => {
        if (selectedSchademelding !== null) {
            handleInReparatie(selectedSchademelding, status); // Bevestig de reservering

            setShowConfirm(false); // Sluit de bevestigingsdialoog
            setTimerActive(false); // Zet de timer uit
        }
    };
    /*const handleCommentChange = (e) => {
        setComment(e.target.value);

    };
    */
    const verstuur = (id) => {
        MaakReparatie(id);
        //setShowCommentField(false);
        setSelectedReparatie(null);
        setReparatie('');
    }
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
    const formatDatum = (datum) => {
        const date = new Date(datum);
        return date.toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

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
                        <p><strong>Datum van schade:</strong> {formatDatum(schademelding.datum)}</p>
                        <p><strong>Schadebeschrijving:</strong> {schademelding.beschrijving}</p>
                        <p><strong>Schadestatus:</strong> {schademelding.status}</p>
                        <br />

                        {!showConfirm && !(schademelding.status === "Afgehandeld") && (
                            <button onClick={() => showInReparatieConfirm(schademelding.schadeclaimId)}>Verander status</button>
                        )}
                        {showConfirm && selectedSchademelding === schademelding.schadeclaimId && (
                            <div>
                                <p className="Confirmatievraag">Weet je het zeker? ({timeRemaining}s)</p>
                                <button className="AnnuleerKnop" onClick={cancelInReparatie}>Stop</button>
                                {schademelding.status === "In afwachting" ? (
                                    <button className="ReserveerKnop" onClick={() => confirmInReparatie("In reparatie")}>In Reparatie</button>
                                ) : (
                                    <button className="ReserveerKnop" onClick={() => confirmInReparatie("Afgehandeld")}>Afgehandeld</button>
                                )}
                            </div>
                        )}

                        {schademelding.reparatieId ? (
                            <>
                                <h2>Reparatie</h2>
                                <p><strong>Reparatienummer:</strong> {schademelding.reparatieId}</p>
                            <p><strong>Reparatiebeschrijving:</strong> {schademelding.reparatie.beschrijving}</p>
                            <p><strong>Reparatiedatum:</strong> {formatDatum(schademelding.reparatie.reparatieDatum)}</p>
                            </>
                ) : (
                            <button style={{marginTop: "5px"}}

                                    onClick={() => {(selectedReparatie === null) || selectedReparatie !== schademelding.schadeclaimId ? setSelectedReparatie(schademelding.schadeclaimId) : (setSelectedReparatie(null))}}>
                                Voeg Reparatie toe
                            </button>
                        )}
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
                                    <button onClick={() => verstuur(schademelding.schadeclaimId)}>
                                        Verstuur
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
