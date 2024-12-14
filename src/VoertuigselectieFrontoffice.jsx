import React, { useState, useEffect } from "react";
import "./VoertuigenSelectie.css"; // Import CSS classes
import carAndAllLogo from './assets/CarAndAll_Logo.webp'; // Use one image

const VoertuigenComponent = () => {
    const [voertuigen, setVoertuigen] = useState([]); // State for storing vehicles
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for handling errors
    const [searchTerm, setSearchTerm] = useState(""); // Search term for merk and model
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]); // Filtered vehicles

    const apiBaseUrl = `https://localhost:44318/api/Voertuig`; // API endpoint to get all vehicles
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
            console.log(err)
            setError("Kan voertuigen niet ophalen"); // Set error if fetch fails
            setLoading(false); // Set loading to false after error
        }
    };
    // Fetch voertuigen when the component is mounted
    useEffect(() => {
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

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    const updateData = async (voertuigId) => {
        const url = `https://localhost:44318/api/Frontoffice/updatevoertuigstatus?id=${voertuigId}`;

        try {
            // Make the PUT request to update the vehicle status
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
                            let updatedStatus = voertuig.voertuigStatus;
                            if (voertuig.voertuigStatus === "Gereserveerd" || voertuig.voertuigStatus === "Beschikbaar") {
                                updatedStatus = "Uitgegeven";
                            } else if (voertuig.voertuigStatus === "Uitgegeven") {
                                updatedStatus = "Beschikbaar";
                            }
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


    const buttonevent = (voertuigId) => {
        updateData(voertuigId);

    }

    return (
        <div className="voertuigen-container">
            {/* Title */}
            <header className="header">
                <h1>Status Updaten</h1>
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
                                <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                <p><strong>Prijs:</strong> €{voertuig.prijs}</p>
                                <button onClick={() => buttonevent(voertuig.voertuigId)}>{voertuig.voertuigStatus}</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VoertuigenComponent;
