import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import InlogPagina from "./InlogPagina";
import Registreren from "./Registreren.jsx";
import BeginRegistreren from "./BeginRegistreren.jsx";
import RegistreerBedrijf from "./RegistreerBedrijf.jsx";
import HoofdschermMedewerker from "./HoofdschermMedewerker.jsx";
import HoofdschermParticulier from "./HoofdschermParticulier.jsx";
import HoofdschermZakelijk from "./HoofdschermZakelijk.jsx";
import AutoHuren from "./AutoHuren.jsx";

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                    </ul>
                </nav>

                <Routes>
                    {/* Redirect van de root naar de InlogPagina */}
                    <Route path="/" element={<Navigate to="/InlogPagina" />} />
                    <Route path="/InlogPagina/Registreren" element={<Navigate to="/Registreren" />} />
                    <Route path="/Registreren/InlogPagina" element={<Navigate to="/InlogPagina" />} />
                    <Route path={"/InlogPagina/BeginRegistreren"} element={<Navigate to="/BeginRegistreren" />} />
                    <Route path={"/BeginRegistreren/RegistreerPersoon"} element={<Navigate to="/Registreren" />} />
                    <Route path={"/BeginRegistreren/RegistreerBedrijf"} element={<Navigate to="/RegistreerBedrijf" />} />
                    <Route path="/InlogPagina" element={<InlogPagina />} />
                    <Route path="/RegistreerBedrijf" element={<RegistreerBedrijf />} />
                    <Route path="/Registreren" element={<Registreren />} />
                    <Route path="/BeginRegistreren" element={<BeginRegistreren />} />
                    <Route path="/HoofdschermMedewerker" element={<HoofdschermMedewerker/>} />
                    <Route path="/HoofdschermParticulier" element={<HoofdschermParticulier />} />
                    <Route path="/HoofdschermZakelijk" element={<HoofdschermZakelijk />} />
                    <Route path="/AutoHuren" element={<AutoHuren />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
