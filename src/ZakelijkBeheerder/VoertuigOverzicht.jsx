import { useNavigate } from 'react-router-dom';
import { useAccount } from "../Login/AccountProvider.jsx";
import React, { useEffect, useState } from "react";
import logo from "../assets/CarAndAll_Logo.webp";
import '../ZakelijkBeheerder/VoertuigOverzicht.css';

function VoertuigOverzicht() {

    const [bedrijfstatistieken, setBedrijfstatistieken] = useState();
    const { currentAccountId, logout } = useAccount(); // Haal de currentAccountId uit de context
    const navigate = useNavigate();
    const [abonnement, setAbonnement] = useState();
    const [teveelAutos, setTeveelAutos] = useState(null);
    const [teveelMedewerkers, setTeveelMedewerkers] = useState(null);

    useEffect(() => {
        if (bedrijfstatistieken && abonnement) {
            ControleerMedewerkersEnVoertuigen();
        }
    }, [bedrijfstatistieken, abonnement]);

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
        GetBedrijfstatistieken();
    }, [currentAccountId]);

    const ControleerMedewerkersEnVoertuigen = async () => {


        if (bedrijfstatistieken && abonnement) {
            if (bedrijfstatistieken.hoeveelheidMedewerkers >= abonnement.maxMedewerkers) {
                setTeveelMedewerkers(true);
            } else {
                setTeveelMedewerkers(false);
            }
            if (bedrijfstatistieken.gehuurdeAutos >= abonnement.maxVoertuigen) {
                setTeveelAutos(true);
            } else {
                setTeveelAutos(false);
            }
        }
    }
    const GetBedrijfstatistieken = async () => {
        try {
            const response2 = await fetch(`https://localhost:44318/api/ZakelijkBeheerder/KrijgBedrijfId?accountId=${currentAccountId}`);
            if (response2.ok) {
                const data2 = await response2.text();

                const response = await fetch(`https://localhost:44318/api/Bedrijf/KrijgAlleBedrijfstatistieken?bedrijfsId=${data2}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });

                if (response.ok) {
                    const data = await response.json();
                    setBedrijfstatistieken(data.statistieken);
                    setAbonnement(data.abonnement);
                } else {
                    throw new Error('Er is iets misgegaan bij het verkrijgen van de gegevens');
                }
            }
        } catch (error) {
            // Foutafhandeling
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het verkrijgen van de gegevens van het bedrijf! Fout details: ' + JSON.stringify(error, null, 2));
        }
    }

    if (!bedrijfstatistieken) {
        return <p>Gegevens laden...</p>;
    }

    return (
        <div className="container">
            <h1><strong>{bedrijfstatistieken.bedrijfsnaam}</strong></h1>
            <div>
                <h2>Bedrijfsgegevens</h2>

                <p><strong>Abonnement:</strong> <a className="MedewerkersLink"
                                                   href="./AbonnementWijzigen">{bedrijfstatistieken.typeAbonnement} </a>
                    <hr/>
                    <p>
                        {teveelAutos &&
                            <strong className="Teveel"> <a className="Teveel" href="./AbonnementWijzigen">Gehuurde autos: </a><div className="tooltip">Je zit op het limiet van maximale auto's. klik om het limiet aan te passen</div></strong>
                        }
                        {!teveelAutos && <strong> Gehuurde autos: </strong>}
                        <a className="MedewerkersLink" href="Bedrijfsvoertuigen">
                            {bedrijfstatistieken.gehuurdeAutos}
                        </a>
                    </p>
                    <hr/>
                    <p>
                        {teveelMedewerkers &&
                            <strong className="Teveel"><a className="Teveel" href="./AbonnementWijzigen">Medewerkers: </a><div
                                className="tooltip">Je zit op het limiet van maximale medewerkers. klik om het limiet aan te passen </div></strong>
                        }
                        {!teveelMedewerkers && <strong> Medewerkers: </strong>}
                        <a className="MedewerkersLink" href="./MedewerkersBeheren">
                            {bedrijfstatistieken.hoeveelheidMedewerkers}
                        </a>
                    </p>

                    <hr/>
                    <p><strong>Totale kosten:</strong> {bedrijfstatistieken.kosten}</p>

                </p>
                <h2>Adresgegevens</h2>
                <p><strong>Woonplaats:</strong> <br/>{bedrijfstatistieken.adres.woonplaats}</p>
                <hr/>
                <p>
                    <strong>Straat:</strong><br/>{bedrijfstatistieken.adres.straatnaam} {bedrijfstatistieken.adres.huisnummer}
                </p>
                <hr/>
                <p><strong>Postcode:</strong> {bedrijfstatistieken.adres.postcode}</p>
                <hr/>
                <p><strong>Provincie:</strong><br/>{bedrijfstatistieken.adres.provincie}</p>
                <hr/>
                <p><strong>Gemeente:</strong> {bedrijfstatistieken.adres.gemeente}</p>

            </div>
            <div className="button-container">
                <button type="button" onClick={() => navigate('/HoofdschermZakelijkBeheerder')}>Terug</button>
            </div>
        </div>
    );
}

export default VoertuigOverzicht;
