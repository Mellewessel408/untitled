import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import InlogPagina from "./Login/InlogPagina.jsx";
import Registreren from "./Login/Registreren.jsx";
import KiesGebruiker from "./Login/KiesGebruiker.jsx";
import RegistreerBedrijf from "./Login/RegistreerBedrijf.jsx";
import HoofdschermMedewerker from "./HoofdschermFrontoffice.jsx";
import HoofdschermParticulier from "./HoofdschermParticulier.jsx";
import HoofdschermZakelijkBeheerder from "./HoofdschermZakelijkBeheerder.jsx";
import HoofdschermFrontoffice from "./HoofdschermFrontoffice.jsx";
import Pagina404 from "./Pagina404.jsx";
import VoertuigenSelectie from "./VoertuigenSelectie.jsx";
import ProfielWijzigen from "./ProfielWijzigen.jsx";
import {AccountProvider} from "./Login/AccountProvider.jsx";
import VoertuigselectieFrontoffice from "./VoertuigselectieFrontoffice.jsx";

function App() {
    return (
        <AccountProvider>
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
                    <Route path={"/InlogPagina/KiesGebruiker"} element={<Navigate to="/KiesGebruiker" />} />
                    <Route path={"/KiesGebruiker/RegistreerPersoon"} element={<Navigate to="/Registreren" />} />
                    <Route path={"/KiesGebruiker/RegistreerBedrijf"} element={<Navigate to="/RegistreerBedrijf" />} />
                    <Route path="/InlogPagina" element={<InlogPagina />} />
                    <Route path="/RegistreerBedrijf" element={<RegistreerBedrijf />} />
                    <Route path="/Registreren" element={<Registreren />} />
                    <Route path="/KiesGebruiker" element={<KiesGebruiker />} />
                    <Route path="/HoofdschermMedewerker" element={<HoofdschermMedewerker/>} />
                    <Route path="/HoofdschermParticulier" element={<HoofdschermParticulier />} />
                    <Route path="/HoofdschermFrontoffice" element={<HoofdschermFrontoffice />} />
                    <Route path="/HoofdschermZakelijkBeheerder" element={<HoofdschermZakelijkBeheerder />} />
                    <Route path="/VoertuigenSelectie" element={<VoertuigenSelectie />} />
                    <Route path="/VoertuigenSelectieFrontoffice" element={<VoertuigselectieFrontoffice />} />
                    <Route path="*" element={<Pagina404 />}/>
                    <Route path="/ProfielParticulier" element={<ProfielWijzigen />} />
                </Routes>
            </div>
          </Router>
        </AccountProvider>
    );
}

export default App;