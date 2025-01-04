import "./AbonnementWijzigen.css";
import { useEffect, useState } from "react";
import { useAccount } from "../Login/AccountProvider.jsx";
import { useNavigate } from "react-router-dom";

function AbonnementWijzigen() {
    const [abonnement, setAbonnement] = useState('');
    const [maxVoertuigen, setMaxVoertuigen] = useState(null);
    const [maxMedewerkers, setMaxMedewerkers] = useState(null);

    const { currentAccountId } = useAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('inlogpagina');
        }
        const fetchAbonnement = async () => {
            try {
                const response = await fetch(`https://localhost:44318/api/Abonnement/getSpecifiekAbonnement?id=${currentAccountId}`);
                if (response.ok) {
                    const responsedata = await response.json();
                    setAbonnement(responsedata.abonnementType);
                    setMaxVoertuigen(responsedata.maxVoertuigen);
                    setMaxMedewerkers(responsedata.maxMedewerkers);
                } else {
                    console.error('Fout bij ophalen abonnement:', response.status);
                }
            } catch (error) {
                console.error('Kan abonnement niet ophalen:', error.message);
                alert('Er is iets fout gegaan bij het ophalen van het abonnement.');
            }
        };

        fetchAbonnement();
        console.log(currentAccountId)
        console.log("State:", { abonnement, maxVoertuigen, maxMedewerkers });

    }, [currentAccountId, navigate]);

    const paygAbbo = () => {
        console.log("Pay-As-You-Go clicked");
    };

    const upAbbo = () => {
        console.log("Up Front clicked");
    };

    return (
        <>
            <div>
                <label>{abonnement || "Laden..."}</label>
                <label>{maxVoertuigen!== null ? maxVoertuigen : "Laden..."}</label>
                <label>{maxMedewerkers !== null ? maxMedewerkers : "Laden..."}</label>
            </div>
            <div className="button-container">
                <button className="grote-knop" onClick={paygAbbo}>
                    Pay-As-You-Go
                </button>
                <button className="grote-knop" onClick={upAbbo}>
                    Up Front
                </button>
                <button></button>
            </div>
        </>
    );
}

export default AbonnementWijzigen;
