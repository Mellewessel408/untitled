import React, { useState } from 'react';
import { useAccount } from './Accountprovider.jsx';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/CarAndAll_Logo.webp';

const ProfielScherm = () => {
    const { gebruiker, updateProfile } = useAccount();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: gebruiker?.email || '',
        naam: gebruiker?.naam || '',
        nummer: gebruiker?.nummer || '',
        adres: {
            woonplaats: gebruiker?.adres?.woonplaats || '',
            straatnaam: gebruiker?.adres?.straatnaam || '',
            huisnummer: gebruiker?.adres?.huisnummer || ''
        }
    });

    if (!gebruiker) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('adres.')) {
            const adresField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                adres: {
                    ...prev.adres,
                    [adresField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(gebruiker.accountId, formData);
            setIsEditing(false);
            alert('Profiel succesvol bijgewerkt!');
        } catch (error) {
            alert('Er is een fout opgetreden bij het bijwerken van het profiel.');
            console.error(error);
        }
    };

    if (isEditing) {
        return (
            <div className="container">
                <div className="Centreren">
                    <img className="logo" src={logo} alt="Carandall Logo" />
                </div>
                <h1>Profiel Bewerken</h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Email:<br />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Naam:<br />
                            <input
                                type="text"
                                name="naam"
                                value={formData.naam}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Telefoonnummer:<br />
                            <input
                                type="text"
                                name="nummer"
                                value={formData.nummer}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Woonplaats:<br />
                            <input
                                type="text"
                                name="adres.woonplaats"
                                value={formData.adres.woonplaats}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Straat:<br />
                            <input
                                type="text"
                                name="adres.straatnaam"
                                value={formData.adres.straatnaam}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Huisnummer:<br />
                            <input
                                type="text"
                                name="adres.huisnummer"
                                value={formData.adres.huisnummer}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className="button-group">
                        <button type="submit">Opslaan</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Annuleren</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="Centreren">
                <img className="logo" src={logo} alt="Carandall Logo" />
            </div>
            <h1>Profiel</h1>

            <div>
                {Object.entries({
                    'Email': gebruiker.email,
                    'Naam': gebruiker.naam,
                    'Telefoonnummer': gebruiker.nummer,
                    'Woonplaats': gebruiker.adres?.woonplaats,
                    'Straat': gebruiker.adres?.straatnaam,
                    'Huisnummer': gebruiker.adres?.huisnummer
                }).map(([label, value]) => (
                    <p key={label}>
                        <strong>{label}:</strong> <br /> {value || 'Niet beschikbaar'}
                    </p>
                ))}
            </div>
            <button onClick={() => setIsEditing(true)}>Bewerk Profiel</button>
        </div>
    );
};

export default ProfielScherm;