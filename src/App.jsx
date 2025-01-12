import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {AccountProvider} from "./New/Accountprovider.jsx";

import InlogPagina from "./New/Login/InlogPagina.jsx";
import Hoofdscherm from "./New/Hoofdscherm.jsx";
import SelectieScherm from "./New/SelectieScherm.jsx";
import {Voertuigprovider} from "./New/Voertuigprovider.jsx";
import RegistreerPagina from "./New/Login/RegistreerPagina.jsx";

function App() {
  return (
      <Router>
            <AccountProvider>
                <Voertuigprovider>
                    <div className={"App"}>
                        <Routes>
                            <Route path={"/"} element={<Navigate to={"/InlogPagina"} />} />
                            <Route path={"/InlogPagina"} element={<InlogPagina />} />
                            <Route path={"/RegistreerPagina"} element={<RegistreerPagina />} />
                            <Route path={"/Hoofdscherm"} element={<Hoofdscherm />} />
                            <Route path={"/SelectieScherm"} element={<SelectieScherm />} />
                        </Routes>
                    </div>
                </Voertuigprovider>
            </AccountProvider>
      </Router>
  )
}

export default App;
