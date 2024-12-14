import React from 'react';
import {useNavigate} from 'react-router-dom';
import './HoofdschermParticulier.css';
import logo from './assets/CarAndAll_Logo.webp';

function HoofdschermParticulier() {
    const navigate = useNavigate();
    const AutoHuren = () => {
        navigate('/AutoHuren');
    }
    const MijnReservering = () => {

    }
    const MijnProfiel = () => {

    }
    const LogUit = () => {

    }

    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>
            <h1>Welkom</h1>
            <h2>Wat wil je vandaag doen?</h2>
            <button onClick={AutoHuren}>Auto huren</button>
            <button onClick={MijnReservering}>Mijn reserveringen</button>
            <button onClick={MijnProfiel}>Mijn profiel</button>
            <button className="logout-button" onClick={LogUit}>Log uit</button>
        </div>
    );

}

export default HoofdschermParticulier;