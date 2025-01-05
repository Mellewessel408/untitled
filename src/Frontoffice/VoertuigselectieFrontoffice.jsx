import React, { useState, useEffect } from "react";
import "../VoertuigenSelectie.css"; // Import CSS classes
import carAndAllLogo from '../assets/CarAndAll_Logo.webp'; // Use one image

const VoertuigenComponent = () => {
    const [voertuigen, setVoertuigen] = useState([]); // State for storing vehicles
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for handling errors
    const [searchTerm, setSearchTerm] = useState(""); // Search term for merk and model
    const [statusFilter, setStatusFilter] = useState(""); // Filter for vehicle status
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState(""); // Filter for vehicle type
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]); // Filtered vehicles
    const [begindatum, setBegindatum] = useState(null);
    const [einddatum, setEinddatum] = useState(null);

    // State to toggle visibility of extra details
    const [showDetails, setShowDetails] = useState({});

    const apiBaseUrl = `https://localhost:44318/api/Voertuig`; // API endpoint to get all vehicles

    // Fetch vehicles from API
    const fetchVoertuigen = async () => {
        try {
            const url = `${apiBaseUrl}/krijgallevoertuigen`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Netwerkfout: " + response.statusText);
            }
            const data = await response.json();

            const voertuigenArray = data.$values || [];
            setVoertuigen(voertuigenArray); // Set the vehicles data
            setLoading(false); // Set loading to false after data is fetched
        } catch (err) {
            console.log(err);
            setError("Kan voertuigen niet ophalen"); // Set error if fetch fails
            setLoading(false); // Set loading to false after error
        }
    };

    // Fetch vehicles when the component is mounted
    useEffect(() => {
        fetchVoertuigen();
    }, []); // Run only on component mount

    // Filter vehicles based on search term, status, and vehicle type
    // useEffect(() => {
    //     const filtered = voertuigen.filter((voertuig) => {
    //         const matchesSearchTerm = (
    //             voertuig.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             voertuig.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             voertuig.kleur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             voertuig.kenteken.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //         const matchesStatus = statusFilter ? voertuig.voertuigStatus === statusFilter : true;
    //         const matchesVehicleType = vehicleTypeFilter ? voertuig.voertuigType === vehicleTypeFilter : true;
    //
    //         return matchesSearchTerm && matchesStatus && matchesVehicleType; // Filter on search term, status, and vehicle type
    //     });
    //     setFilteredVoertuigen(filtered); // Update filtered vehicles based on search, status, and vehicle type
    // }, [searchTerm, statusFilter, vehicleTypeFilter, voertuigen]);Run whenever these values change

    useEffect(() => {
        const filtered = voertuigen.filter((voertuig) => {
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
        setFilteredVoertuigen(filtered);
    }, [searchTerm, voertuigen]);

    // Update vehicle status
    const updateData = async (voertuigId) => {
        const voertuig = voertuigen.find(v => v.voertuigId === voertuigId);
        let updatedStatus = voertuig.voertuigStatus;

        // Transition logic based on current status
        if (updatedStatus === "Gereserveerd") {
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
    };

    // Toggle details visibility
    const toggleDetails = (voertuigId) => {
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

                {/* Date Filters */}
                <input
                    type="date"
                    placeholder="Kies begindatum"
                    className="flatpickr-calander"
                    value={begindatum}
                    onChange={(e) => setBegindatum(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Ensure the date is today or later
                />
                <input
                    type="date"
                    placeholder="Kies einddatum"
                    className="flatpickr-calander"
                    value={einddatum}
                    onChange={(e) => setEinddatum(e.target.value)}
                    min={begindatum || new Date().toISOString().split('T')[0]} // Ensure the date is today or after begindatum
                />
            </div>

            {/* Vehicle Grid */}
            <div className="voertuigen-grid">
                {filteredVoertuigen.length === 0 ? (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                ) : (
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
                                <p><strong>Status:</strong> {voertuig.voertuigStatus}</p>

                                {/* Status button and Details */}
                                <div className="button-container">
                                    <button
                                        className="reserveer-button"
                                        onClick={() => handleButtonClick(voertuig.voertuigId)}
                                    >
                                        {voertuig.voertuigStatus === "Gereserveerd"
                                            ? "Maak Uitgegeven"
                                            : voertuig.voertuigStatus === "Uitgegeven"
                                                ? "Maak Beschikbaar"
                                                : "Maak Uitgegeven"}
                                    </button>

                                    {/* Details Button */}
                                    <button
                                        className="details-button"
                                        onClick={() => toggleDetails(voertuig.voertuigId)}
                                    >
                                        {showDetails[voertuig.voertuigId] ? "Verberg Details" : "Toon Details"}
                                    </button>
                                </div>

                                {/* Extra details visible when the button is clicked */}
                                {showDetails[voertuig.voertuigId] && (
                                    <div className="extra-details">
                                        <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                        <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                        <p><strong>Prijs:</strong> €{voertuig.prijs}</p>
                                        <p><strong>Voertuigtype:</strong> {voertuig.voertuigType}</p>
                                        <p><strong>Brandstoftype:</strong> {voertuig.brandstofType}</p>
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
