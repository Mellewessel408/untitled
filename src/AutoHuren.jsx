import React, { useState } from 'react';

function AutoHuren() {
    const [selectedFilter, setSelectedFilter] = useState(''); // Voor het beheren van de geselecteerde filter
    const [voertuigen, setVoertuigen] = useState([]); // Voeg je voertuigen array toe hier, mogelijk vanuit een API

    const [zoekTerm, setZoekTerm] = useState(''); // State voor de zoekterm
    const addTestVoertuig = () => {
        const nieuwVoertuig = {
            id: voertuigen.length + 1, // Unieke ID, gebaseerd op de lengte
            naam: "Test Auto",
            model: "Test Model",
            zitplaatsen: 4,
            prijsPerDag: 50,
            afbeeldingUrl: "https://via.placeholder.com/150", // Placeholder-afbeelding
        };

        setVoertuigen([...voertuigen, nieuwVoertuig]); // Voeg het nieuwe voertuig toe aan de array
    };


    // Functie die wordt aangeroepen bij het drukken op de Enter-toets
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            // De gewenste functie wordt aangeroepen wanneer Enter wordt ingedrukt
            handleSearch();
        }
    };

    // Functie voor de zoekactie
    const handleSearch = () => {
        console.log('Zoeken op:', zoekTerm);
        // Hier kun je de zoeklogica toevoegen, bijvoorbeeld:
        // 1. Zoekresultaten ophalen
        // 2. Lijst van voertuigen filteren op basis van zoekterm
    };
    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
        // Hier kun je de filterlogica toevoegen
        // Bijvoorbeeld: filter voertuigen op basis van de geselecteerde filter
    };

    const handleFilterClick = () => {
        // Hier kun je de filterlogica toevoegen, bijvoorbeeld de lijst voertuigen bijwerken op basis van de geselecteerde filter
        console.log('Geselecteerde filter:', selectedFilter);
    };

    return (
        <div className="auto-huren-container">
            <h1>Welkom</h1>
            <h2>Auto huren</h2>
            <div className="zoek-filter">
                <input
                    type="text"
                    placeholder="Zoeken"
                    className="zoekbalk"
                    value={zoekTerm}
                    onChange={(e) => setZoekTerm(e.target.value)} // Update zoekterm bij invoer
                    onKeyDown={handleKeyPress} // Handle Enter-toets
                />

                {/* Dropdown voor filteren */}
                <select className="filter-dropdown" onChange={handleFilterChange} value={selectedFilter}>
                    <option value="">Selecteer een type</option>
                    <option value="caravan">Caravan</option>
                    <option value="auto">Auto</option>
                    <option value="camper">Camper</option>
                </select>

                <button className="filter-knop" onClick={handleFilterClick}>Filter</button>
            </div>

            <div className="voertuigen-scroll-container">
                {voertuigen.map((voertuig) => (
                    <div key={voertuig.id} className="voertuig-card">
                        <img src={voertuig.afbeeldingUrl} alt={voertuig.naam} className="voertuig-afbeelding"/>
                        <h2>{voertuig.naam}</h2>
                        <p><strong>Model:</strong> {voertuig.model}</p>
                        <p><strong>Aantal zitplaatsen:</strong> {voertuig.zitplaatsen}</p>
                        <p><strong>Prijs:</strong> €{voertuig.prijsPerDag}</p>
                        <button className="reserveer-knop">Reserveer</button>
                    </div>
                ))}
            </div>
            <button onClick={addTestVoertuig}>Voeg Test Voertuig Toe</button>

        </div>
    );
}

export default AutoHuren;
