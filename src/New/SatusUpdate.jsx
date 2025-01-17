import React, { useState, useEffect } from "react";
import carAndAllLogo from '../assets/CarAndAll_Logo.webp';
import { useVoertuigen } from "./Voertuigprovider.jsx"; // Use one image
import { useAccount } from './Accountprovider.jsx';

function StatusUpdate() {
    const { voertuigen } = useVoertuigen();
    const { logout, loading, error } = useAccount();

    const [begindatum, setBegindatum] = useState("");
    const [einddatum, setEinddatum] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVoertuigen, setFilteredVoertuigen] = useState(voertuigen);

    const [showDetails, setShowDetails] = useState(null);

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

    const updateData = async (voertuigId) => {
        const voertuig = voertuigen.find(v => v.voertuigId === voertuigId);
        let updatedStatus = voertuig.voertuigStatus;

        // Transition logic based on current status
        if (updatedStatus === "IsGoedgekeurd") {
            updatedStatus = "Uitgegeven"; // Transition "Gereserveerd" to "Uitgegeven"
        } else if (updatedStatus === "Uitgegeven") {
            updatedStatus = "Beschikbaar"; // Transition "Uitgegeven" to "Beschikbaar"
        } else if (updatedStatus === "Beschikbaar") {
            if (!begindatum || !einddatum) {
                alert("Voor deze statusverandering moet een begindatum en einddatum ingevuld worden.");
                return; // Ensure dates are filled when changing from "Beschikbaar" to "Uitgegeven"
            }
            updatedStatus = "Uitgegeven"; // Transition "Beschikbaar" to "Uitgegeven" with date check
        }

        // If we are changing to "Uitgegeven", we need to send the dates
        const url = `https://localhost:44318/api/Frontoffice/updatevoertuigstatus?id=${voertuigId}&begindatum=${begindatum}&einddatum=${einddatum}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // If the update was successful, update the status locally
                setVoertuigen((prevVoertuigen) => {
                    return prevVoertuigen.map((voertuig) => {
                        if (voertuig.voertuigId === voertuigId) {
                            return {
                                ...voertuig,
                                voertuigStatus: updatedStatus,
                            };
                        }
                        return voertuig;
                    });
                });
            } else {
                console.error('Failed to update the vehicle status');
            }
        } catch (error) {
            console.error('Error updating vehicle status:', error);
        }
    };

    // Event handler for button click
    const handleButtonClick = (voertuigId) => {
        updateData(voertuigId);
        if (begindatum == null || einddatum == null) {
            alert("Fout bij status veranderen: Vul een begin- en einddatum in.");
            return;
        }
    };

    // Toggle details visibility
    const toggleDetails = (voertuigId) => {
        setShowDetails((prevState) => ({
            ...prevState,
            [voertuigId]: !prevState[voertuigId], // Toggle the visibility for the given vehicle
        }));
    };

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

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
};

export default StatusUpdate;
