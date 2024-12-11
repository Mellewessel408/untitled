import {useNavigate} from 'react-router-dom';
import './HoofdschermParticulier.css';

function HoofdschermParticulier() {
    const navigate = useNavigate();
    const AutoHuren = () => {

    }
    const MijnReservering = () => {

    }
    const MijnProfiel = () => {

    }

    return (
        <div>
            <h1>Welkom</h1>
            <h2>Wat wil je vandaag doen</h2>
            <button onClick={AutoHuren}></button>
            <button onClick={MijnReservering}></button>
            <button onClick={MijnProfiel}></button>
        </div>
    );

}
export default HoofdschermParticulier;