import "./AbonnementWijzigen.css";
import React, { useEffect, useState } from "react";
import { useAccount } from "../Login/AccountProvider.jsx";
import { useNavigate } from "react-router-dom";

function AbonnementWijzigen() {
    const [abonnement, setAbonnement] = useState('');
    const [maxVoertuigen, setMaxVoertuigen] = useState(null);
    const [maxMedewerkers, setMaxMedewerkers] = useState(null);
    const [newAbonnement, setNewAbonnement] = useState(null);

    const { currentAccountId, logout } = useAccount();
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
    }, [currentAccountId, navigate]);

    const switchAbonnement = async () => {
        // Switch between abonnement types
        const newType = abonnement === "Up Front" ? "Pay-As-You-Go" : "Up Front";
        const newMaxVoertuigen = abonnement === "Up Front" ? 10 : 5; // Example values, adjust as needed
        const newMaxMedewerkers = abonnement === "Up Front" ? 50 : 25; // Example values, adjust as needed

        // Create the payload with correct data structure
        const payload = {
            abonnementType: newType,
            maxVoertuigen: newMaxVoertuigen,
            maxMedewerkers: newMaxMedewerkers
        };

        // Log the payload to verify the data
        console.log("Payload:", payload);
        console.log("AccountId", currentAccountId)

        try {
            // Make the POST request with the correct accountId as a query parameter and the payload in the body
            const response = await fetch(`https://localhost:44318/api/Abonnement/Create?accountId=${currentAccountId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload) // Send the payload as the request body
            });

            // Check the response status
            if (response.ok) {
                const responsedata = await response.json();
                setNewAbonnement({
                    abonnementType: responsedata.abonnementType,
                    maxVoertuigen: responsedata.maxVoertuigen,
                    maxMedewerkers: responsedata.maxMedewerkers,
                });
            } else {
                console.error('Fout bij wijzigen abonnement:', response.status);
                alert('Er is iets fout gegaan bij het wijzigen van het abonnement.');
            }
        } catch (error) {
            console.error('Kan abonnement niet wijzigen:', error.message);
            alert('Er is iets fout gegaan bij het wijzigen van het abonnement.');
        }
    };


    return (
        <>
            <div className="card-container">
                <div className="card">
                    <h2>Huidig Abonnement</h2>
                    <div className="card-labels">
                        <label><strong>Abonnement Type:</strong> {abonnement || "Laden..."}</label>
                        <label><strong>Maximaal aant. voertuigen:</strong> {maxVoertuigen !== null ? maxVoertuigen : "Laden..."}</label>
                        <label><strong>Maximaal aant. medewerkers:</strong> {maxMedewerkers !== null ? maxMedewerkers : "Laden..."}</label>
                    </div>
                    {newAbonnement === null && (
                        <button onClick={switchAbonnement}>
                            Switch to {abonnement === "Up Front" ? "Pay-As-You-Go" : "Up Front"}
                        </button>
                    )}
                </div>

                {newAbonnement && (
                    <div className="card">
                        <h2>Nieuw Abonnement</h2>
                        <div className="card-labels">
                            <label><strong>Abonnement Type:</strong> {newAbonnement.abonnementType}</label>
                            <label><strong>Maximaal aant. voertuigen:</strong> {newAbonnement.maxVoertuigen}</label>
                            <label><strong>Maximaal aant. medewerkers:</strong> {newAbonnement.maxMedewerkers}</label>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AbonnementWijzigen;
