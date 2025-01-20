import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../Login/AccountProvider.jsx";
import "./VoertuigenSelectie.css";
import carAndAllLogo from '../assets/CarAndAll_Logo.webp';

const VoertuigenBeheren = () => {
    const [voertuigen, setVoertuigen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVoertuigen, setFilteredVoertuigen] = useState([]);
    const [wijzigen, setWijzigen] = useState(null);
    const [selectedVoertuig, setSelectedVoertuig] = useState(null);
    const [editingVoertuig, setEditingVoertuig] = useState(null);
    const [formData, setFormData] = useState({
        kenteken: '',
        merk: '',
        model: '',
        voertuigType: '',
        kleur: '',
        aanschafjaar: '',
        brandstofType: '',
        prijs: ''
    });

    const { currentAccountId, logout } = useAccount();
    const navigate = useNavigate();
    const apiBaseUrl = `https://localhost:44318/api/Voertuig`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const annuleren = () => {
        setSelectedVoertuig(null);
        setWijzigen(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiBaseUrl}/${editingVoertuig}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    voertuigId: editingVoertuig,
                    ...formData
                }),
            });

            if (!response.ok) {
                throw new Error('Wijzigen mislukt');
            }

            const updatedVoertuig = await response.json();
            setVoertuigen(prevVoertuigen =>
                prevVoertuigen.map(v =>
                    v.voertuigId === editingVoertuig ? updatedVoertuig : v
                )
            );
            setEditingVoertuig(null);
        } catch (error) {
            console.error('Fout bij wijzigen:', error);
            alert('Er is een fout opgetreden bij het wijzigen van het voertuig');
        }
    };

    const VerwijderVoertuig = async (id) => {
        try {
            const response = await fetch(`${apiBaseUrl}/Delete?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update de lijst met voertuigen na succesvolle verwijdering
            setVoertuigen(prevVoertuigen =>
                prevVoertuigen.filter(v => v.voertuigId !== id)
            );
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het verwijderen van het voertuig!');
        }
    };

    const WijzigVoertuig = (id) => {
        setWijzigen(true)
        const voertuig = voertuigen.find(v => v.voertuigId === id);
        if (voertuig) {
            setFormData({
                kenteken: voertuig.kenteken,
                merk: voertuig.merk,
                model: voertuig.model,
                voertuigType: voertuig.voertuigType,
                kleur: voertuig.kleur,
                aanschafjaar: voertuig.aanschafjaar,
                brandstofType: voertuig.brandstofType,
                prijs: voertuig.prijs
            });
            setEditingVoertuig(id);
        }
    };

    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('inlogpagina');
        }

        const fetchVoertuigen = async () => {
            setLoading(true);
            try {
                const url = `${apiBaseUrl}/krijgallevoertuigen`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Netwerkfout (${response.status}): ${response.statusText}`);
                }
                const data = await response.json();
                setVoertuigen(data.$values || []);
            } catch (err) {
                console.error(err);
                setError(`Kan voertuigen niet ophalen: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchVoertuigen();
    }, [currentAccountId, navigate]);

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

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voertuigen-container">
            <header className="header">
                <h1>Voertuig beheren</h1>
            </header>
            <div className="search-filter">
            </div>
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
                                <p><strong>Voertuigtype:</strong> {voertuig.voertuigType}</p>
                                <p><strong>Kleur:</strong> {voertuig.kleur}</p>
                                <p><strong>Aanschafjaar:</strong> {voertuig.aanschafjaar}</p>
                                <p><strong>BrandstofType:</strong> {voertuig.brandstofType}</p>
                                <p><strong>Prijs:</strong> €{voertuig.prijs}</p>

                                <div className="button-container">
                                    <button onClick={() => VerwijderVoertuig(voertuig.voertuigId)}>
                                        Verwijderen
                                    </button>
                                    <button onClick={() => WijzigVoertuig(voertuig.voertuigId)}>
                                        Wijzigen
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {wijzigen && (
                <div className="edit-form">
                    <h2 className="text-xl font-bold mb-4">Voertuig Wijzigen</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {Object.keys(formData).map((field) => (
                            <div key={field} className="space-y-2">
                                <label className="block">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                                    <input
                                        type={field === 'aanschafjaar' || field === 'prijs' ? 'number' : 'text'}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </label>
                            </div>
                        ))}
                        <div className="flex gap-4 justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => annuleren()}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Annuleren
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Opslaan
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default VoertuigenBeheren;