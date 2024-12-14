import {useNavigate} from 'react-router-dom';
import {useAccount} from "./Login/AccountProvider.jsx";
import {useEffect} from "react";

function HoofdschermMedewerker() {
    const navigate = useNavigate();
    const { currentAccountId, logout } = useAccount();

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('/inlogpagina');
        }
    });

    const VoertuigStatusUpdate = () => {

    };

    // const ReserveringBeheren = () => {
    //
    // }
    // const VoertuigenBeheren = () => {
    //
    // }
    // const Schademeldingen = () => {
    //
    // }
    // const Klantenoverzicht = () => {
    //
    // }
    return (
        <div>
            <h1>Welkom</h1>
            <h2>Wat wil je vandaag doen</h2>
            <button onClick={ReserveringBeheren}></button>
            <button onClick={VoertuigenBeheren}></button>
            <button onClick={Schademeldingen}></button>
            <button onClick={Klantenoverzicht}></button>
        </div>
    );

}
export default HoofdschermMedewerker;