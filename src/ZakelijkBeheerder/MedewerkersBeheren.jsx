import React from 'react';
import { useNavigate } from 'react-router-dom';

function MedewerkersBeheren() {
    const navigate = useNavigate();

    const handleVoegMedewerkerToe = () => {
        navigate('VoegMedewerkerToe');
    };

    const handleMedewerkerVerwijderen = () => {
        navigate('MedewerkerVerwijderen');
    };

    return (
        <div>
            <header>
                <h2>Medewerkers beheren</h2>
            </header>
            <div>
                <button
                    onClick={handleVoegMedewerkerToe}
                    style={{ marginRight: '20px' }}
                >
                    Medewerker Toevoegen
                </button>
                <button onClick={handleMedewerkerVerwijderen}>
                    Medewerker Verwijderen
                </button>
            </div>
        </div>
    );
}

export default MedewerkersBeheren;
