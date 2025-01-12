import React, {useEffect, useState} from "react";
import carAndAllLogo from "../assets/CarAndAll_Logo.webp";
import { useAccount } from './Accountprovider.jsx';
import { useVoertuigen } from "./Voertuigprovider.jsx";


function SelectieScherm() {
    const { voertuigen } = useVoertuigen();
    const { logout } = useAccount();

    const [begindatum, setBegindatum] = useState("");
    const [einddatum, setEinddatum] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVoertuigen, setFilteredVoertuigen] = useState(voertuigen);

    // States for handling confirmation and details
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedVoertuig, setSelectedVoertuig] = useState(null);
    const [showDetails, setShowDetails] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(10);

    useEffect(() => {
        console.log("Voertuigen from context:", voertuigen);

        // Handle different structures
        if (Array.isArray(voertuigen)) {
            setFilteredVoertuigen(voertuigen);
        } else if (voertuigen && typeof voertuigen === "object") {
            setFilteredVoertuigen(Object.values(voertuigen));
        } else {
            setFilteredVoertuigen([]);
        }
    }, [voertuigen]);

    React.useEffect(() => {
        const filtered = voertuigen.filter((voertuig) => {
            const matchesSearchTerm = Object.keys(voertuig).some((key) => {
                const value = voertuig[key];
                if (typeof value === "string") {
                    return value.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (typeof value === "number") {
                    return value.toString().includes(searchTerm);
                }
                return false;
            });

            const isInDateRange = (
                (begindatum ? new Date(voertuig.availableFrom) >= new Date(begindatum) : true) &&
                (einddatum ? new Date(voertuig.availableTo) <= new Date(einddatum) : true)
            );

            return matchesSearchTerm && isInDateRange;
        });

        setFilteredVoertuigen(filtered);
    }, [searchTerm, begindatum, einddatum, voertuigen]);

    const showReservationConfirm = (voertuigId) => {
        setSelectedVoertuig(voertuigId);
        setShowConfirm(true);
    };

    const cancelReservation = () => {
        setShowConfirm(false);
        setSelectedVoertuig(null);
    };

    const confirmReservation = () => {
        alert(`Voertuig ${selectedVoertuig} gereserveerd!`);
        setShowConfirm(false);
        setSelectedVoertuig(null);
    };

    const toggleDetails = (voertuigId) => {
        setShowDetails(showDetails === voertuigId ? null : voertuigId);
    };

    return (
        <div className="voertuigen-container">
            <header className="header">
                <h1>Voertuig huren</h1>
                <button className="logout-button small" onClick={logout}>
                    Log uit
                </button>
            </header>
            <div className="search-filter">
                <input
                    type="date"
                    id="begindatum"
                    placeholder="Kies begindatum"
                    className="flatpickr-calander"
                    value={begindatum}
                    onChange={(e) => setBegindatum(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    max={einddatum}
                />
                <input
                    type="date"
                    id="einddatum"
                    placeholder="Kies einddatum"
                    className="flatpickr-calander"
                    value={einddatum}
                    onChange={(e) => {
                        const newEinddatum = e.target.value;
                        setEinddatum(newEinddatum);
                    }}
                    min={begindatum || new Date().toISOString().split('T')[0]}
                />

                <input
                    type="text"
                    placeholder="Zoek op merk of model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
            </div>
            <div className="voertuigen-grid">
                {filteredVoertuigen.length > 0 ? (
                    filteredVoertuigen.map((voertuig) => (
                        <div key={voertuig.voertuigId} className="voertuig-card">
                            <div className="voertuig-photo">
                                <img
                                    className="voertuig-photo"
                                    src={carAndAllLogo}
                                    alt="CarAndAll Logo"
                                />
                            </div>
                            <div className="voertuig-info">
                                <h3 className="kenteken">{voertuig.kenteken}</h3>
                                <p><strong>Merk:</strong> {voertuig.merk}</p>
                                <p><strong>Model:</strong> {voertuig.model}</p>
                                <p><strong>Voertuigtype:</strong> {voertuig.voertuigType}</p>

                                {/* Reservation Confirmation */}
                                {!showConfirm && (
                                    <div className="button-container">
                                        <button
                                            className="reserveer-button"
                                            onClick={() => showReservationConfirm(voertuig.voertuigId)}
                                        >
                                            Reserveer
                                        </button>
                                        <button
                                            className="details-button"
                                            onClick={() => toggleDetails(voertuig.voertuigId)}
                                        >
                                            Details
                                        </button>
                                    </div>
                                )}

                                {showConfirm && selectedVoertuig === voertuig.voertuigId && (
                                    <div>
                                        <p className="Confirmatievraag">Weet je het zeker? ({timeRemaining}s)</p>
                                        <button className="AnnuleerKnop" onClick={cancelReservation}>Stop</button>
                                        <button className="ReserveerKnop" onClick={confirmReservation}>Ja Reserveer</button>
                                    </div>
                                )}

                                {showDetails === voertuig.voertuigId && (
                                    <div className="voertuig-details">
                                        <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                        <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                        <p><strong>BrandstofType:</strong> {voertuig.brandstofType}</p>
                                        <p><strong>Prijs:</strong> €{voertuig.prijs}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                )}
            </div>
        </div>
    );
}

export default SelectieScherm;