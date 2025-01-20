import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import InlogPagina from "./Login/InlogPagina.jsx";
import Registreren from "./Login/Registreren.jsx";
import KiesGebruiker from "./Login/KiesGebruiker.jsx";
import RegistreerBedrijf from "./Login/RegistreerBedrijf.jsx";
import HoofdschermMedewerker from "./Frontoffice/HoofdschermFrontoffice.jsx";
import HoofdschermParticulier from "./Particulier/HoofdschermParticulier.jsx";
import HoofdschermZakelijkBeheerder from "./ZakelijkBeheerder/HoofdschermZakelijkBeheerder.jsx";
import MedewerkersBeheren from "./ZakelijkBeheerder/MedewerkersBeheren.jsx";
import VoegMedewerkerToe from "./ZakelijkBeheerder/VoegMedewerkerToe.jsx";
import MedewerkerVerwijderen from "./ZakelijkBeheerder/MedewerkerVerwijderen.jsx";
import HoofdschermFrontoffice from "./Frontoffice/HoofdschermFrontoffice.jsx";
import Pagina404 from "./Error/Pagina404.jsx";
import VoertuigenSelectie from "./VoertuigenSelectie.jsx";
import ProfielWijzigen from "./Particulier/ProfielWijzigen.jsx";
import ProfielPagina from "./Particulier/ProfielPagina.jsx";
import {AccountProvider} from "./Login/AccountProvider.jsx";
import VoertuigselectieFrontoffice from "./Frontoffice/VoertuigselectieFrontoffice.jsx";
import VoertuigenSelectieZakelijkHuurder from "./ZakelijkHuurder/VoertuigenSelectieZakelijkHuurder.jsx";
import HoofdschermZakelijkHuurder from "./ZakelijkHuurder/HoofdschermZakelijkHuurder.jsx";
import MijnReserveringen from "./Particulier/MijnReserveringen.jsx";
import ReserveringWijzigen from "./Particulier/ReserveringWijzigen.jsx";
import AbonnementWijzigen from "./ZakelijkBeheerder/AbonnementWijzigen.jsx";
import VoertuigOverzicht from "./ZakelijkBeheerder/VoertuigOverzicht.jsx";
import BedrijfsVoertuigen from "./ZakelijkBeheerder/BedrijfsVoertuigen.jsx";
import HoofdschermBackoffice from "./Backoffice/HoofdschermBackoffice.jsx";
import AbonnementGoedkeuren from "./Backoffice/AbonnementGoedkeuren.jsx";
import VerhuurAanvragen from "./Backoffice/VerhuurAanvragen.jsx";
import SchademeldingenBekijken from "./Backoffice/SchademeldingenBekijken.jsx";
import Schadeclaimmaken from "./Backoffice/Schadeclaimmaken.jsx";
import AccountsBeheren from "./Backoffice/AccountsBeheren.jsx";
import VoegmedewerkerToe from "./Backoffice/VoegMedewerkerToe.jsx";
import VoertuigenBeheren from "./Backoffice/VoertuigenBeheren.jsx";

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
                    <Route path="/HoofdschermParticulier/MijnReserveringen" element={<MijnReserveringen />} />
                    <Route path="/HoofdschermZakelijkHuurder/MijnReserveringen" element={<MijnReserveringen />} />

                    <Route path="/HoofdschermParticulier/MijnReserveringen/ReserveringWijzigen" element={<ReserveringWijzigen />} />
                    <Route path="/HoofdschermZakelijkHuurder/MijnReserveringen/ReserveringWijzigen" element={<ReserveringWijzigen />} />
                    <Route path="/HoofdschermZakelijkBeheerder/MedewerkersBeheren" element={<MedewerkersBeheren />} />
                    <Route path="/HoofdschermZakelijkBeheerder/MedewerkersBeheren/VoegMedewerkerToe" element={<VoegMedewerkerToe />} />
                    <Route path="/HoofdschermZakelijkBeheerder/MedewerkersBeheren/MedewerkerVerwijderen" element={<MedewerkerVerwijderen />} />
                    <Route path="/HoofdschermZakelijkBeheerder/VoertuigOverzicht" element={<VoertuigOverzicht />} />
                    <Route path="/HoofdschermZakelijkBeheerder/Bedrijfsvoertuigen" element={<BedrijfsVoertuigen />} />
                    <Route path="/HoofdschermZakelijkHuurder" element={<HoofdschermZakelijkHuurder />} />
                    <Route path="/VoertuigenSelectie" element={<VoertuigenSelectie />} />
                    <Route path="/HoofdschermZakelijkBeheerder/AbonnementWijzigen" element={<AbonnementWijzigen />} />
                    <Route path="/VoertuigenSelectieFrontoffice" element={<VoertuigselectieFrontoffice />} />
                    <Route path="/VoertuigenSelectieZakelijkHuurder" element={<VoertuigenSelectieZakelijkHuurder />} />
                    <Route path="*" element={<Pagina404 />}/>
                    <Route path="/ProfielParticulier" element={<ProfielWijzigen />} />
                    <Route path="/ProfielPagina" element={<ProfielPagina />} />
                    <Route path="/ProfielWijzigen" element={<ProfielWijzigen />} />
                    <Route path="/HoofdschermBackoffice" element={<HoofdschermBackoffice />} />
                    <Route path="/HoofdschermBackoffice/AbonnementGoedKeuren" element={<AbonnementGoedkeuren />} />
                    <Route path="/HoofdschermBackoffice/VerhuurAanvragen" element={<VerhuurAanvragen />} />
                    <Route path="/HoofdschermBackoffice/Schademeldingen" element={<SchademeldingenBekijken/>} />
                    <Route path="/HoofdschermBackoffice/Schadeclaimmaken" element={<Schadeclaimmaken />} />
                    <Route path="/HoofdschermBackoffice/AccountsBeheren" element={<AccountsBeheren />} />
                    <Route path="/HoofdschermBackoffice/AccountsBeheren/voegMedewerkertoe" element={<VoegmedewerkerToe />} />
                    <Route path="/HoofdschermBackoffice/BedrijfsabbonomentenGoedkeuren" element={<AbonnementGoedkeuren />} />
                    <Route path="/HoofdschermBackoffice/VoertuigenBeheren" element={<VoertuigenBeheren/>} />
                </Routes>
            </div>
          </Router>
        </AccountProvider>
    );
}

export default App;