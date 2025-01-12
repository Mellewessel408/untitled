import React from 'react';
import { useAccount } from './Accountprovider.jsx';
import logo from "../assets/CarAndAll_Logo.webp";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Hoofdscherm() {
    const { gebruiker } = useAccount();
    const navigate = useNavigate();

    return (
        <div>
            <h2>Homepage</h2>
            {gebruiker.accountType === "ParticulierAccount" && <Particulier gebruiker={ gebruiker } navigate={ navigate } />}
            {gebruiker.accountType === "ZakelijkBeheerder" && <ZakelijkBeheerder />}
            {gebruiker.accountType === "ZakelijkHuurder" && <ZakelijkHuurder gebruiker={ gebruiker } navigate={ navigate } />}
            {gebruiker.accountType === "BackofficeAccount" && <Backoffice />}
            {gebruiker.accountType === "FrontofficeAccount" && <Frontoffice />}
        </div>
    );
}

function Particulier({ gebruiker, navigate }) {
    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>
            <h1>Welkom {gebruiker.naam}</h1>
            <h2>Wat wil je vandaag doen?</h2>
            <button onClick={() => navigate('/SelectieScherm')}>Auto huren</button>
            {/*<button onClick={MijnReservering}>Mijn reserveringen</button>*/}
            <button onClick={() => navigate('/ProfielScherm')}>Mijn profiel</button>
            {/*<button onClick={AccountVerwijderen} className="fetusDeletus">Verwijder account</button>*/}
            {/*<button className="logout-button" onClick={LogUit}>Log uit</button>*/}
        </div>
    );
}

Particulier.propTypes = {
    gebruiker: PropTypes.shape({
        naam: PropTypes.string.isRequired,
        accountType: PropTypes.string.isRequired,
    }).isRequired,
    navigate: PropTypes.func.isRequired,
};

function ZakelijkBeheerder() {
    const { gebruiker } = useAccount();
    return <p>Welcome User! You have limited access.</p>;
}

function ZakelijkHuurder({ gebruiker, navigate}) {
    return (
        <div className="hoofdscherm-container">
            <img src={logo} alt="Carandall Logo"/>
            <h1>Welkom {gebruiker.naam}</h1>
            <h2>Wat wil je vandaag doen?</h2>
            <button onClick={() => navigate('/SelectieScherm')}>Auto huren</button>
            {/*<button onClick={MijnReservering}>Mijn reserveringen</button>*/}
            <button onClick={() => navigate('/ProfielScherm')}>Mijn profiel</button>
            {/*<button onClick={AccountVerwijderen} className="fetusDeletus">Verwijder account</button>*/}
            {/*<button className="logout-button" onClick={LogUit}>Log uit</button>*/}
        </div>
    );
}

ZakelijkHuurder.propTypes = {
    gebruiker: PropTypes.shape({
        naam: PropTypes.string.isRequired,
        accountType: PropTypes.string.isRequired,
    }).isRequired,
    navigate: PropTypes.func.isRequired,
};

function Backoffice() {
    const { gebruiker } = useAccount();
    return <p>Welcome Guest! Please log in to get more access.</p>;
}

function Frontoffice() {
    const { gebruiker } = useAccount();
    return <p>Welcome Guest! Please log in to get more access.</p>;
}
export default Hoofdscherm;