import "./AbonnementWijzigen.css";
import React, { useEffect, useState } from "react";
import { useAccount } from "../Login/AccountProvider.jsx";
import { useNavigate } from "react-router-dom";

function AbonnementWijzigen() {
    const [abonnement, setAbonnement] = useState('');
    const [maxVoertuigen, setMaxVoertuigen] = useState(null);
    const [maxMedewerkers, setMaxMedewerkers] = useState(null);
    const [newVoertuigType, setNewVoertuigType] = useState(null);
    const [newAbonnement, setNewAbonnement] = useState(null);
    const [showWijzigen, setShowWijzigen] = useState(null);
    const [abonnementId, setAbonnementId] = useState(null);

    const { currentAccountId } = useAccount();
    console.log('currentAccountId:', currentAccountId);
    const navigate = useNavigate();

    useEffect(() => {
        setShowWijzigen(false);
        if (currentAccountId === 0) {
            alert("U bent niet correct ingelogd. U wordt teruggestuurd naar de inlogpagina");
            navigate('inlogpagina');
        }
        const fetchAbonnement = async () => {
            try {
                //abonnement ophalen
                const response = await fetch(`https://localhost:44318/api/Abonnement/getSpecifiekAbonnement?id=${currentAccountId}`);

                if (response.ok) {
                    //Abonnement invullen
                    const responsedata = await response.json();
                    setAbonnementId(responsedata.abonnementId)
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

    const WijzigLimieten = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const abonnementType = formData.get('typeAbonnement');
        if (abonnementType == null || abonnementType === abonnement) {
            abonnementType === abonnement;
        }

        //Medewerkerlimiet ophalen en kijken of hij leeg is, zodat je de oude kan gebruiken.
        const medewerkerLimiet = formData.get('medewerkerLimiet');
        if (medewerkerLimiet === "" || medewerkerLimiet === maxMedewerkers) {
            medewerkerLimiet === maxMedewerkers;
        }

        //Voertuigenlimiet ophalen en kijken of hij leeg is, zodat je de oude kan gebruiken.
        const voertuigenLimiet = formData.get('voertuigenLimiet');
        if (voertuigenLimiet === "" || voertuigenLimiet === maxVoertuigen) {
            voertuigenLimiet === maxVoertuigen;
        }

        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const ingangsdatum = nextMonth.toISOString()

            //Kijken of er al een nieuw abonnement was
        let soortAbonnement;
        if (newAbonnement != null) {
            soortAbonnement = newAbonnement.abonnementType;
        } else {
            soortAbonnement = abonnementType;
        }


        //Nieuwe abonnementgegevens invullen
        const UpdateAbonnement = {
            abonnementType: soortAbonnement,
            maxVoertuigen: voertuigenLimiet,
            maxMedewerkers: medewerkerLimiet,
            begindatum: ingangsdatum
        };
        try {
            //Nieuw abonnement aanmaken
            const response = await fetch(`https://localhost:44318/api/Abonnement/UpdateAbonnement?abonnementId=${abonnementId}&accountId=${currentAccountId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(UpdateAbonnement) // Send the payload as the request body
            });

            // Check the response status
            if (response.ok) {
                //Nieuw abonnement invullen
                const responsedata = await response.json();
                setNewAbonnement({
                    abonnementType: responsedata.abonnementType,
                    maxVoertuigen: responsedata.maxVoertuigen,
                    maxMedewerkers: responsedata.maxMedewerkers,
                    ingangsdatum: responsedata.begindatum
                });
            } else {
                console.error('Fout bij wijzigen abonnement:', response.status);
                alert('Er is iets fout gegaan bij het wijzigen van het abonnement.');
            }
        } catch (error) {
            console.error('Kan abonnement niet wijzigen:', error.message);
            alert(`Er is iets fout gegaan bij het wijzigen van het abonnement: ${error.message}`);
        }
        setShowWijzigen(false);
    }

    return (
        <>
            <div className="card-container">
                <div className="card">
                    {!showWijzigen && (
                        <>
                            <h2>Huidig Abonnement</h2>
                            <div className="card-labels">

                                <label><strong>Abonnement Type:</strong> {abonnement || "Laden..."}</label>
                                <label><strong>Maximaal aant.
                                    voertuigen:</strong> {maxVoertuigen !== null ? maxVoertuigen : "Laden..."}</label>
                                <label><strong>Maximaal aant.
                                    medewerkers:</strong> {maxMedewerkers !== null ? maxMedewerkers : "Laden..."}
                                </label>

                            </div>
                        </>
                    )}
                    <br/>
                    {!showWijzigen && !newAbonnement && (
                        <button onClick={() => setShowWijzigen(true)}>Wijzig Abonnement</button>
                    )}
                    {showWijzigen && (
                        <form className="WijzigLimiet" onSubmit={WijzigLimieten}>
                            <div>
                                <label htmlFor="typeAbonnement">Type Abonnement:</label>
                                <select name="typeAbonnement" id="typeAbonnement"
                                        value={newVoertuigType !== null ? newVoertuigType : abonnement}
                                        onChange={(e) => setNewVoertuigType(e.target.value)}>
                                    <option value="PayAsYouGo">Pay-As-You-Go</option>
                                    <option value="UpFront">UpFront</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="MedewerkerLimiet">Medewerkerlimiet:</label>
                                <input type="text" name="medewerkerLimiet"
                                       placeholder="Stel hier het medewerkerlimiet in..."/>
                            </div>
                            <div>
                                <label htmlFor="VoertuigenLimiet">Voertuigenlimiet:</label>
                                <input type="text" name="voertuigenLimiet"
                                       placeholder="Stel hier het voertuiglimiet in..."/>
                            </div>
                            <input className="WijzigenKnop" type="submit" value="Wijzig"/>

                        </form>
                    )}
                </div>


                {newAbonnement && (
                    <div className="card">
                        <h2>Nieuw Abonnement</h2>
                        <div className="card-labels">
                            <label><strong>Ingangsdatum:</strong> {new Date(newAbonnement.ingangsdatum).toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })}</label>
                            <label><strong>Abonnement Type:</strong> {newAbonnement.abonnementType}</label>
                            <label><strong>Maximaal aant. voertuigen:</strong> {newAbonnement.maxVoertuigen}</label>
                            <label><strong>Maximaal aant. medewerkers:</strong> {newAbonnement.maxMedewerkers}</label>
                        </div>
                    </div>

                )}
            </div>
            <div className="button-container">
                <button type="button" onClick={() => {!showWijzigen ? (navigate('/HoofdschermZakelijkBeheerder')) : setShowWijzigen(false)}}>Terug</button>
            </div>
        </>
    );
}

export default AbonnementWijzigen;
