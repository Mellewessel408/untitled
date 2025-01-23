import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from "../Login/AccountProvider.jsx";

function MedewerkersBeheren() {
    const navigate = useNavigate();
    const [medewerkers, setMedewerkers] = useState([]);
    const { currentAccountId, logout } = useAccount();

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent niet correct ingelogd. U wordt teruggestuurd naar de inlogpagina");
            navigate('/inlogpagina');
        }
        GetMedewerkers(currentAccountId);
    }, [currentAccountId, navigate]); // Let op de dependencies van useEffect



    const handleVoegMedewerkerToe = () => {
        navigate('VoegMedewerkerToe');
    };

    const handleMedewerkerVerwijderen = () => {
        navigate('MedewerkerVerwijderen');
    };



    const GetMedewerkers = async (currentAccountId) => {
        try {
            const response2 = await fetch(`https://localhost:44318/api/ZakelijkBeheerder/KrijgBedrijfId?accountId=${currentAccountId}`);
            if (response2.ok) {
                const data2 = await response2.text();

                const response = await fetch(`https://localhost:44318/api/Bedrijf/KrijgBedrijf?id=${data2}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });

                if (response.ok) {
                    const data = await response.json();
                    setMedewerkers(data.bevoegdeMedewerkers.$values);

                    return true;
                } else {
                    throw new Error('Er is iets misgegaan bij het verkrijgen van de gegevens');
                }
            }
        } catch (error) {
            // Foutafhandeling
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het verkrijgen van de gegevens van het bedrijf! Fout details: ' + JSON.stringify(error, null, 2));
            return []; // Return een lege array bij fouten
        }
    };

    return (
        <div>
            <div className="MedewerkersBeheren">
                <header>
                    <h2>Medewerkers beheren</h2>
                </header>
                <center>
                    <button
                        onClick={handleVoegMedewerkerToe}
                        style={{marginRight: '20px'}}
                    >
                        Medewerker Toevoegen
                    </button>
                    <button onClick={handleMedewerkerVerwijderen}>
                        Medewerker Verwijderen
                    </button>
                </center>
            </div>

            <div className="medewerkers-grid">
                {medewerkers.length === 0 ? (
                    <div>Geen medewerkers gevonden</div>
                ) : (
                    medewerkers.map((medewerker) => (
                        <div key={medewerker.accountId} className="voertuig-card">
                            <p>AccountId: {medewerker.accountId}</p>
                            <p>Email: {medewerker.email}</p>
                        </div>
                    ))
                )}
            </div>
        </div>

    );
}

export default MedewerkersBeheren;
