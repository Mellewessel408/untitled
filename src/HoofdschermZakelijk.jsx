import {useNavigate} from 'react-router-dom';

function HoofdschermZakelijk() {
    const navigate = useNavigate();
    const VoertuigenOverzicht = () => {

    }
    const MedewerkersBeheren = () => {

    }
    const AbbonementsBeheer = () => {

    }
    const VerhuurActiviteiten = () => {

    }

    return (
        <div>
            <h1>Welkom</h1>
            <h2>Wat wil je vandaag doen</h2>
            <button onClick={VoertuigenOverzicht}></button>
            <button onClick={MedewerkersBeheren}></button>
            <button onClick={AbbonementsBeheer}></button>
            <button onClick={VerhuurActiviteiten}></button>
        </div>
    );

}
export default HoofdschermZakelijk;