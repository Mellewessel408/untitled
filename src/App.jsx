import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import InlogPagina from "./Login/InlogPagina.jsx";
import Registreren from "./Login/Registreren.jsx";
import KiesGebruiker from "./Login/KiesGebruiker.jsx";
import RegistreerBedrijf from "./Login/RegistreerBedrijf.jsx";
import HoofdschermMedewerker from "./HoofdschermMedewerker.jsx";
import HoofdschermParticulier from "./HoofdschermParticulier.jsx";
import HoofdschermZakelijk from "./HoofdschermZakelijk.jsx";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Redirect van de root naar de InlogPagina */}
                    <Route path="/" element={<Navigate to="/InlogPagina" />} />

                    {/* Directe routes zonder tussenliggende stappen */}
                    <Route path="/InlogPagina" element={<InlogPagina />} />
                    <Route path="/Registreren" element={<Registreren />} />
                    <Route path="/KiesGebruiker" element={<KiesGebruiker />} />
                    <Route path="/RegistreerBedrijf" element={<RegistreerBedrijf />} />
                    <Route path="/HoofdsschermMedewerker" element={<HoofdschermMedewerker />} />
                    <Route path="/HoofdsschermParticulier" element={<HoofdschermParticulier />} />
                    <Route path="/HoofdsschermZakelijk" element={<HoofdschermZakelijk />} />

                    {/* Redirects voor de juiste navigatie */}
                    <Route path="/InlogPagina/Registreren" element={<Navigate to="/Registreren" />} />
                    <Route path="/KiesGebruiker/RegistreerPersoon" element={<Navigate to="/Registreren" />} />
                    <Route path="/KiesGebruiker/RegistreerBedrijf" element={<Navigate to="/RegistreerBedrijf" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
