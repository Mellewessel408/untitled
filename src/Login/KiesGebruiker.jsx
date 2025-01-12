import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegistreerBedrijf from "./RegistreerBedrijf.jsx";
import RegistreerPersoon from "./Registreren.jsx"
import "../styles/KiesGebruiker.css";

function KiesGebruiker() {
    const navigate = useNavigate();
    const handelRegistreerBedrijf = () => {
        navigate('/RegistreerBedrijf')
    };

    const handelRegistreerPersoon = () => {
        navigate('/Registreren')
    };

    const handelInloggen = () => {
        navigate('/InlogPagina')
    }

    return (
        <>
        <div className="button-container">

            <button className="grote-knop" onClick={handelRegistreerBedrijf}>Bedrijf

            </button>


            <button className="grote-knop" onClick={handelRegistreerPersoon}>Particulier

            </button>
        </div>
            <div className="button-container">
                <button onClick={handelInloggen}>Inloggen</button>
            </div>

        </>
    );
}

export default KiesGebruiker;
