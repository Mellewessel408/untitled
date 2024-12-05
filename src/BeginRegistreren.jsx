import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegistreerBedrijf from "./RegistreerBedrijf.jsx";
import RegistreerPersoon from "./Registreren.jsx"
import "./BeginRegistreren.css";

function BeginRegistreren() {
    const navigate = useNavigate();
    const handelRegistreerBedrijf = () => {
        navigate('RegistreerBedrijf')
    };

    const handelRegistreerPersoon = () => {
        navigate('RegistreerPersoon')
    };

    return (
        <div className="button-container">

            <button className="grote-knop" onClick={handelRegistreerBedrijf}>Bedrijf

            </button>


            <button className="grote-knop" onClick={handelRegistreerPersoon}>Particulier

            </button>
        </div>
    );
}

export default BeginRegistreren;
