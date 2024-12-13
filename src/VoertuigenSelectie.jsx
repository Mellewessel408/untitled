import React, { useState, useEffect } from "react";
import "./VoertuigenSelectie.css"; // Import CSS classes

const VoertuigenComponent = () => {
    const [voertuigen, setVoertuigen] = useState([]); // State for storing vehicles
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for handling errors
    const [searchTerm, setSearchTerm] = useState(""); // Search term for merk and model
    const [filterType, setFilterType] = useState(""); // Filter by type (auto, camper, caravan)

    const apiBaseUrl = `https://localhost:44318/api/Voertuig`; // API endpoint to get all vehicles

    // Fetch voertuigen when the component is mounted
    useEffect(() => {
        const fetchVoertuigen = async () => {
            try {
                // Ensure correct API endpoint is used
                const response = await fetch(`${apiBaseUrl}/Krijg%20alle%20voertuigen`);
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
    }, []); // Empty dependency array to run only once on component mount

    // Filter vehicles based on search term and filterType
    const filteredVoertuigen = voertuigen.filter((voertuig) => {
        const matchesSearchTerm =
            voertuig.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voertuig.model.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilterType =
            filterType === "" || voertuig.voertuigType.toLowerCase() === filterType.toLowerCase();

        return matchesSearchTerm && matchesFilterType;
    });

    // Log out function (simple example, you can implement actual log out logic)
    const handleLogout = () => {
        alert("Logging out...");
    };

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            {/* Title */}
            <header className="header">
                <h1>Voertuig huren</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Log uit
                </button>
            </header>

            {/* Search and Filter Section */}
            <div className="search-filter">
                <input
                    type="text"
                    placeholder="Zoek op merk of model"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <select
                    className="filter-dropdown"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">Alle types</option>
                    <option value="auto">Auto</option>
                    <option value="camper">Camper</option>
                    <option value="caravan">Caravan</option>
                </select>
            </div>

            {/* Grid of vehicles */}
            <div className="voertuigen-grid">
                {filteredVoertuigen.map((voertuig) => (
                    <div key={voertuig.voertuigId} className="voertuig-card">
                        <div className="voertuig-photo">
                            {/* You can replace with actual vehicle image */}
                            <img src="https://via.placeholder.com/150" alt={voertuig.model} />
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
                ))}
            </div>
        </div>
    );
};

export default VoertuigenComponent;
