import React, { useState, useEffect } from "react";
import "./VoertuigenSelectie.css"; // Import CSS classes
import carImage from './assets/Car_image.jpg';
import camperImage from './assets/Camper_image.jpg';
import caravanImage from './assets/Caravan_image.jpg';

const VoertuigenComponent = () => {
    const [voertuigen, setVoertuigen] = useState([]); // State for storing vehicles
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for handling errors
    const [searchTerm, setSearchTerm] = useState(""); // Search term for merk and model
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]); // Filtered vehicles

    const apiBaseUrl = `https://localhost:44318/api/Voertuig`; // API endpoint to get all vehicles

    // Fetch voertuigen when the component is mounted
    useEffect(() => {
        const fetchVoertuigen = async () => {
            try {
                const url = `${apiBaseUrl}/Krijg%20alle%20voertuigen`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Netwerkfout: " + response.statusText);
                }
                const data = await response.json();
                setVoertuigen(data || []); // Set the vehicles data
                setLoading(false); // Set loading to false after data is fetched
            } catch (err) {
                setError("Kan voertuigen niet ophalen"); // Set error if fetch fails
                setLoading(false); // Set loading to false after error
            }
        };

        fetchVoertuigen();
    }, []); // Run only on component mount

    // Filter vehicles based on search term
    useEffect(() => {
        const filtered = voertuigen.filter((voertuig) => {
            return (
                voertuig.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voertuig.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredVoertuigen(filtered); // Update filtered vehicles based on search
    }, [searchTerm, voertuigen]); // Run whenever searchTerm or vehicles changes

    // Log out function (simple example, you can implement actual log out logic)
    const handleLogout = () => {
        alert("Logging out...");
    };

    // Function to determine voertuigType based on 'merk' or 'model'
    const determineVoertuigType = (voertuig) => {
        const type = voertuig.type ? voertuig.type.toLowerCase() : ''; // Ensure type is in lowercase
        console.log("Voertuig type:", type); // Debugging: Log the type to see what's being passed

        if (type.includes("camper")) {
            return "camper"; // If "camper" is found, return "camper"
        } else if (type.includes("caravan")) {
            return "caravan"; // If "caravan" is found, return "caravan"
        } else {
            return "auto"; // Default to "auto" if no match
        }
    };

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            {/* Title */}
            <header className="header">
                <h1>Voertuig huren</h1>
                <button className="logout-button small" onClick={handleLogout}>
                    Log uit
                </button>
            </header>

            {/* Search Section */}
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Zoek op merk of model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
            </div>

            {/* Grid of vehicles */}
            <div className="voertuigen-grid">
                {filteredVoertuigen.length === 0 ? (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                ) : (
                    filteredVoertuigen.map((voertuig) => {
                        // Determine the type of the vehicle
                        const voertuigType = determineVoertuigType(voertuig);

                        // Select the image based on the type
                        const imageSrc = voertuigType === 'auto'
                            ? carImage
                            : voertuigType === 'camper'
                                ? camperImage
                                : caravanImage;

                        return (
                            <div key={voertuig.voertuigId} className="voertuig-card">
                                <div className="voertuig-photo">
                                    <img
                                        className="voertuig-photo"
                                        src={imageSrc}
                                        alt={`${voertuigType} afbeelding`}
                                    />
                                </div>
                                <div className="voertuig-info">
                                    <h3 className="kenteken">{voertuig.kenteken}</h3>
                                    <p><strong>Merk:</strong> {voertuig.merk}</p>
                                    <p><strong>Model:</strong> {voertuig.model}</p>
                                    <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                    <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                    <p><strong>Prijs:</strong> €{voertuig.prijs}</p>
                                    <p><strong>Status:</strong> {voertuig.voertuigStatus}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default VoertuigenComponent;
