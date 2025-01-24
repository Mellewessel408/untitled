import React, { useState, useEffect } from "react";
import "./VoertuigselectieFrontoffice.css"; // Import CSS classes
import carAndAllLogo from '../assets/CarAndAll_Logo.webp';
import Reserveringen from "../Particulier/Reserveringen.jsx"; // Use one image

const VoertuigenComponent = () => {
    const [reserveringen, setReserveringen] = useState([]); // State for storing vehicles
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for handling errors
    const [searchTerm, setSearchTerm] = useState(""); // Search term for merk and model
    const [statusFilter, setStatusFilter] = useState(""); // Filter for vehicle status
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState(""); // Filter for vehicle type
    const [filteredReserveringen, setFilteredReserveringen] = useState([]); // Filtered vehicles

    // State to toggle visibility of extra details
    const [showDetails, setShowDetails] = useState({});

    const apiBaseUrl = `https://localhost:44318/api/Reservering`; // API endpoint to get all vehicles

    // Fetch vehicles from API
    const fetchReserveringen = async () => {
        try {
            const url = `${apiBaseUrl}/KrijgAlleReserveringenGoedgekeurd`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Netwerkfout: " + response.statusText);
            }
            const data = await response.json();

            const reserveringenArray = data.$values || [];
            setReserveringen(reserveringenArray);
           // Set the vehicles data
            setLoading(false); // Set loading to false after data is fetched
        } catch (err) {
            console.log(err);
            setError("Kan reserveringen niet ophalen"); // Set error if fetch fails
            setLoading(false); // Set loading to false after error
        }
    };

    // Fetch vehicles when the component is mounted
    useEffect(() => {
        fetchReserveringen();
    }, []); // Run only on component mount

    // Filter vehicles based on search term, status, and vehicle type
    useEffect(() => {
        const filtered = reserveringen.filter((voertuig) => {
            return Object.keys(voertuig).some((key) => {
                const value = voertuig[key];
                if (typeof value === "string") {
                    return value.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (typeof value === "number") {
                    return value.toString().includes(searchTerm);
                }
                return false;
            });
        });
        setFilteredReserveringen(filtered);
    }, [searchTerm, reserveringen]);
// Run whenever these values change

    // Event handler for button click
    const handleButtonClick = async (voertuigId) => {
        const reservering = reserveringen.find(r => r.voertuigId === voertuigId);
        let updatedStatus = reservering.voertuig.voertuigStatus;

        // Transition logic based on current status
        if (updatedStatus === "Gereserveerd") {
            updatedStatus = "Uitgegeven"; // Transition "Gereserveerd" to "Uitgegeven"
        } else if (updatedStatus === "Uitgegeven") {
            updatedStatus = "Beschikbaar"; // Transition "Uitgegeven" to "Beschikbaar"
        } else if (updatedStatus === "Beschikbaar") {
            updatedStatus = "Uitgegeven"; // Transition "Beschikbaar" to "Uitgegeven" with date check
        }

        // If we are changing to "Uitgegeven", we need to send the dates
        const url = `https://localhost:44318/api/Frontoffice/updatevoertuigstatus?id=${voertuigId}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ voertuigStatus: updatedStatus })
            });

            if (response.ok) {
                // If the update was successful, update the status locally
                // setReserveringen((prevVoertuigen) => {
                //     return prevVoertuigen.map((r) => {
                //         if (r.voertuigId === voertuigId) {
                //             return {
                //                 ...r,
                //                 voertuigStatus: updatedStatus,
                //             };
                //         }
                //         return r;
                //     });
                // });

                fetchReserveringen();
            } else {
                console.error('Failed to update the vehicle status');
            }
        } catch (error) {
            console.error('Error updating vehicle status:', error);
        }
    };

    // Toggle details visibility
    const toggleDetails = (voertuigId) => {
        console.log(reserveringen)
        setShowDetails((prevState) => ({
            ...prevState,
            [voertuigId]: !prevState[voertuigId], // Toggle the visibility for the given vehicle
        }));
    };

    // Logout function (example, can be updated based on your logic)
    const handleLogout = () => {
        alert("Logging out...");
    };

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            {/* Title */}
            <header className="header">
                <h1>Status Updaten</h1>
            </header>

            {/* Search, Status and Vehicle Type Filter Section */}
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Zoek op merk of model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />

                {/* Status Filter */}
                <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Alle Statussen</option>
                    <option value="Gereserveerd">Gereserveerd</option>
                    <option value="Uitgegeven">Uitgegeven</option>
                    <option value="Beschikbaar">Beschikbaar</option>
                </select>

                {/* Vehicle Type Filter */}
                <select
                    className="vehicle-type-filter"
                    value={vehicleTypeFilter}
                    onChange={(e) => setVehicleTypeFilter(e.target.value)}
                >
                    <option value="">Alle Voertuigtypes</option>
                    <option value="Auto">Auto</option>
                    <option value="Camper">Camper</option>
                    <option value="Caravan">Caravan</option>
                </select>
            </div>

            {/* Vehicle Grid */}
            <div className="voertuigen-grid">
                {filteredReserveringen.length === 0 ? (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                ) : (
                    filteredReserveringen.map((reserveringen) => (
                        <div key={reserveringen.voertuig.voertuigId} className="voertuig-card">
                            <div className="voertuig-photo">
                                <img className="voertuig-photo" src={carAndAllLogo} alt="CarAndAll Logo" />
                            </div>
                            <div className="voertuig-info">
                                <h3 className="kenteken">{reserveringen.voertuig.kenteken}</h3>
                                <p><strong>Merk:</strong> {reserveringen.voertuig.merk}</p>
                                <p><strong>Model:</strong> {reserveringen.voertuig.model}</p>
                                <p><strong>Status:</strong> {reserveringen.voertuig.voertuigStatus}</p>

                                {/* Button container */}
                                <div className="button-container">
                                    <button className="reserveer-button" onClick={() => handleButtonClick(reserveringen.voertuig.voertuigId)}>
                                        Auto is binnen
                                    </button>
                                    <button className="details-button" onClick={() => toggleDetails(reserveringen.voertuig.voertuigId)}>
                                        {showDetails[reserveringen.voertuig.voertuigId] ? "Verberg Details" : "Toon Details"}
                                    </button>
                                </div>

                                {/* Extra details visible when the button is clicked */}
                                {showDetails[reserveringen.voertuig.voertuigId] && (
                                    <div className="extra-details">
                                        <p><strong>Kleur:</strong> {reserveringen.voertuig.kleur}</p>
                                        <p><strong>Aanschafjaar:</strong> {reserveringen.voertuig.aanschafjaar}</p>
                                        <p><strong>Prijs:</strong> €{reserveringen.voertuig.prijs}</p>
                                        <p><strong>Voertuigtype:</strong> {reserveringen.voertuig.voertuigType}</p>
                                        <p><strong>Brandstoftype:</strong> {reserveringen.voertuig.brandstofType}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VoertuigenComponent;
