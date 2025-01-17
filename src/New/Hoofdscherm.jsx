import React from 'react';
import { useAccount } from './Accountprovider.jsx';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../assets/CarAndAll_Logo.webp';
import "./styles/Buttons.css";

const UserLayout = ({ naam, children }) => (
    <div className="hoofdscherm-container">
        <img src={logo} alt="Carandall Logo" />
        <h1>Welkom {naam}</h1>
        <h2>Wat wil je vandaag doen?</h2>
        {children}
    </div>
);

UserLayout.propTypes = {
    naam: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

// Account type components
const Particulier = ({ gebruiker, navigate, logout }) => (
    <UserLayout naam={gebruiker.naam}>
        <button onClick={() => navigate('/SelectieScherm')}>Auto huren</button>
        <button onClick={() => navigate('/MijnReserveringenScherm')}>Mijn reserveringen</button>
        <button onClick={() => navigate('/ProfielScherm')}>Mijn profiel</button>
        <button className="logout-button" onClick={logout}>Log uit</button>
    </UserLayout>
);

const ZakelijkHuurder = ({ gebruiker, navigate, logout }) => (
    <UserLayout naam={gebruiker.naam}>
        <button onClick={() => navigate('/SelectieScherm')}>Auto huren</button>
        <button onClick={() => navigate('/ProfielScherm')}>Mijn profiel</button>
        <button className="logout-button" onClick={logout}>Log uit</button>
    </UserLayout>
);

const ZakelijkBeheerder = () => <p>Welcome User! You have limited access.</p>;
const Backoffice = () => <p>Welcome Guest! Please log in to get more access.</p>;
const Frontoffice = ({gebruiker, navigate, logout}) => (
    <UserLayout naam={gebruiker.email}>
        <h2>Wat wil je vandaag doen?</h2>
        <button onClick={() => navigate('/StatusUpdate')}>StatusUpdate</button>
        <button className="logout-button" onClick={logout}>Log uit</button>
    </UserLayout>
);

// Common PropTypes shape for user components
const userPropTypes = {
    gebruiker: PropTypes.shape({
        naam: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        accountType: PropTypes.string.isRequired,
    }).isRequired,
    navigate: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired, // Add this line to include logout
};

Particulier.propTypes = userPropTypes;
ZakelijkHuurder.propTypes = userPropTypes;
ZakelijkBeheerder.propTypes = userPropTypes;
Backoffice.propTypes = userPropTypes;
Frontoffice.propTypes = userPropTypes;

const Hoofdscherm = () => {
    const { gebruiker, logout } = useAccount();
    const navigate = useNavigate();

    console.log('Hoofdscherm rendering, gebruiker:', gebruiker);

    if (!gebruiker || !gebruiker.accountType) {
        return <div>Loading...</div>;
    }

    const accountComponents = {
        ParticulierAccount: <Particulier gebruiker={gebruiker} logout={logout} navigate={navigate} />,
        ZakelijkBeheerder: <ZakelijkBeheerder />,
        ZakelijkHuurder: <ZakelijkHuurder gebruiker={gebruiker} logout={logout} navigate={navigate} />,
        BackofficeAccount: <Backoffice />,
        FrontofficeAccount: <Frontoffice />,
    };

    return (
        <div>
            <h2>Homepage</h2>
            {accountComponents[gebruiker.accountType]}
        </div>
    );
};

export default Hoofdscherm;
