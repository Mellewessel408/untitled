import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/CarAndAll_Logo.webp';
import './Accountsbeheren.css';
import './Voertuigenselectie.css'
import { AccountProvider, useAccount } from "../Login/AccountProvider.jsx"; // Gebruik de useAccount hook om de context te gebruiken

function AbonnementGoedkeuren() {
    const mockbedrijfabonnementen = [
        {
            abonnementId: 1,
            abonnementType: "Basis",
            MaxVoertuigen: 5,
            MaxMedewerkers: 10,
        },
        {
            abonnementId: 2,
            abonnementType: "Standaard",
            MaxVoertuigen: 15,
            MaxMedewerkers: 30,
        },
        {
            abonnementId: 3,
            abonnementType: "Premium",
            MaxVoertuigen: 50,
            MaxMedewerkers: 100,
        },
        {
            abonnementId: 4,
            abonnementType: "Enterprise",
            MaxVoertuigen: 200,
            MaxMedewerkers: 500,
        },
    ];

    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const [bedrijfabonnementen, setBedrijfabonnementen] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedAbonnementId, setSelectedAbonnement] = useState(null);

    async function fetchAbonnementen() {
        try {
            const response = await fetch(`https://localhost:44318/api/Bedrijf`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Er is een fout opgetreden: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const abonnementen = data.$values;
            const abonnementenMetNullBegindatum = abonnementen.filter(abonnement => abonnement.begindatum == null);
            setBedrijfabonnementen(abonnementenMetNullBegindatum);
        } catch (error) {
            console.error('Fout bij het ophalen van de accounts:', error);
        }
    }

// 2. useEffect met lege dependency array voor eenmalige uitvoering
    useEffect(() => {
        fetchAbonnementen();
    }, []);


    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });

    const LogUit = () => {
        logout();
        navigate('/Inlogpagina');
    };

    const handleGoedkeuren = (id) => {
        setSelectedAbonnement(id);
        setSelectedAction(true);
    }

    const handleAfkeuren = (id) => {
        setSelectedAbonnement(id)
        setSelectedAction(false);
    }
    const handleSubmit = (bedrijf) => {
        updateAbonnement(bedrijf);
        setSelectedAbonnement(null);
    }
    async function updateAbonnement(bedrijf) {
        try {
            const updatedAbonnement = {
                abonnementId: bedrijf.abonnementId,
                maxVoertuigen: bedrijf.abonnement.maxVoertuigen,
                maxMedewerkers: bedrijf.abonnement.maxMedewerkers,
                abonnementType: bedrijf.abonnement.type,
                begindatum: new Date().toISOString()
            };
            const response = await fetch(`https://localhost:44318/api/Abonnement/UpdateAbonnement?abonnementId=${bedrijf.abonnementId}&accountId=${bedrijf.bevoegdeMedewerkers.accountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAbonnement)
            });

            if (!response.ok) {
                throw new Error(`Er is een fout opgetreden: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Abonnement succesvol bijgewerkt:', data);
        } catch (error) {
            console.error('Fout bij het bijwerken van het abonnement:', error);
        }
    }


    return (

        <div>
            <button className="logout-button" onClick={LogUit}>Log uit</button>

            <div className="accounts-container">

                <h1>Abonnementen Goedkeuren</h1>
                <div className="accounts-grid">
                    {bedrijfabonnementen.map((bedrijf) => (

                        <div key={bedrijf.abonnementId} className="account-card">
                            <div className="account-header">
                                <div className="account-title">{bedrijf.abonnementType}</div>
                            </div>
                            <div className="account-content">
                                <div className="account-info">
                                    <div className="info-row">
                                        <span className="font-medium">Bedrijfsnaam:</span>
                                        <span>{bedrijf.bedrijfsnaam}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="font-medium">Max voertuigen</span>
                                        <span>{bedrijf.abonnement.maxVoertuigen}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="font-medium">Max medewerkers</span>
                                        <span>{bedrijf.abonnement.maxMedewerkers}</span>
                                    </div>

                                    <div className="button-group">
                                        <button
                                            onClick={() => handleGoedkeuren(bedrijf.abonnementId)}
                                            style={{
                                                backgroundColor:
                                                    selectedAction === true && selectedAbonnementId === bedrijf.abonnementId
                                                        ? 'grey'
                                                        : '#040404',
                                                marginRight: '10px',
                                            }}
                                        >
                                            Goedkeuren
                                        </button>
                                        <button
                                            onClick={() => handleAfkeuren(bedrijf.abonnementId)}
                                            style={{
                                                backgroundColor:
                                                    selectedAction === false && selectedAbonnementId === bedrijf.abonnementId
                                                        ? 'grey'
                                                        : '#040404',

                                            }}
                                        >
                                            Afkeuren
                                        </button>
                                        <button onClick={() => handleSubmit(bedrijf)}
                                        style={{
                                            marginTop: '10px',
                                        }

                                        }>
                                            Verzenden
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}

export default AbonnementGoedkeuren;
