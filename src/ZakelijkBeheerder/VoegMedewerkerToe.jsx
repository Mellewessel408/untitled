import {useNavigate} from 'react-router-dom';
import {AccountProvider, useAccount} from "../Login/AccountProvider.jsx";
import {useEffect} from "react";

function VoegMedewerkerToe() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId")
            navigate('/inlogpagina');
        }
    })

    return (
        <div>
            <h2>Welkom, {currentAccountId}!</h2>

        </div>
    );

}

export default VoegMedewerkerToe;