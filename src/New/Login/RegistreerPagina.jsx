import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../Accountprovider.jsx";

function RegistreerPagina() {
    const { registreer, loading, error } = useAccount(); // Assuming this function interacts with the backend API.
    const navigate = useNavigate();

    const [accountType, setAccountType] = useState("Particulier"); // Default type
    const [formData, setFormData] = useState({
        email: "",
        wachtwoord: "",
        herhaalWachtwoord: "",
        naam: "",
        nummer: "",
        bedrijfsnaam: "",
        domeinnaam: "",
        kvkNummer: "",
        huisnummer: "",
        postcode: ""
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.wachtwoord !== formData.herhaalWachtwoord) {
            alert("Wachtwoorden komen niet overeen. Probeer het opnieuw.");
            return;
        }

        let payload = {
            accountType,
            email: formData.email,
            wachtwoord: formData.wachtwoord,
        };

        if (accountType === "Particulier") {
            payload = {
                ...payload,
                naam: formData.naam,
                nummer: formData.nummer ? parseInt(formData.nummer) : null,
                adres: {
                    huisnummer: formData.huisnummer,
                    postcode: formData.postcode,
                },
            };
        }

        if (accountType === "ZakelijkBeheerder") {
            payload = {
                ...payload,
                bedrijf: {
                    bedrijfsnaam: formData.bedrijfsnaam,
                    domeinnaam: formData.domeinnaam,
                    kvkNummer: formData.kvkNummer ? parseInt(formData.kvkNummer) : null,
                },
                adres: {
                    huisnummer: formData.huisnummer,
                    postcode: formData.postcode,
                },
            };
        }

        try {
            await registreer(e, accountType, payload);
            alert("Account succesvol geregistreerd!");
            navigate("/InlogPagina");
        } catch (err) {
            alert("Er is een fout opgetreden: " + err.message);
        }
    };


    return (
        <div className="container">
            <h1>Registreren</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Type account:</label>
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                    >
                        <option value="Particulier">Particulier</option>
                        <option value="ZakelijkBeheerder">Zakelijk Beheerder</option>
                        <option value="Frontoffice">Frontoffice</option>
                        <option value="Backoffice">Backoffice</option>
                    </select>
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Wachtwoord:</label>
                    <input
                        type="password"
                        name="wachtwoord"
                        value={formData.wachtwoord}
                        onChange={handleInputChange}
                        required
                        minLength="8"
                    />
                </div>

                <div>
                    <label>Herhaal Wachtwoord:</label>
                    <input
                        type="password"
                        name="herhaalWachtwoord"
                        value={formData.herhaalWachtwoord}
                        onChange={handleInputChange}
                        required
                        minLength="8"
                    />
                </div>

                {accountType === "Particulier" && (
                    <>
                        <div>
                            <label>Naam:</label>
                            <input
                                type="text"
                                name="naam"
                                value={formData.naam}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Telefoonnummer:</label>
                            <input
                                type="tel"
                                name="nummer"
                                value={formData.nummer}
                                onChange={handleInputChange}
                            />
                        </div>
                    </>
                )}

                {accountType === "ZakelijkBeheerder" && (
                    <>
                        <div>
                            <label>Bedrijfsnaam:</label>
                            <input
                                type="text"
                                name="bedrijfsnaam"
                                value={formData.bedrijfsnaam}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Domeinnaam:</label>
                            <input
                                type="text"
                                name="domeinnaam"
                                value={formData.domeinnaam}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <label>KVK-nummer:</label>
                            <input
                                type="text"
                                name="kvkNummer"
                                value={formData.kvkNummer}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                )}

                {(accountType === "Particulier" || accountType === "ZakelijkBeheerder") && (
                    <>
                        <div>
                            <label>Huisnummer:</label>
                            <input
                                type="text"
                                name="huisnummer"
                                value={formData.huisnummer}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Postcode:</label>
                            <input
                                type="text"
                                name="postcode"
                                value={formData.postcode}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Registreren..." : "Registreer"}
                </button>

                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
        </div>
    );

}

export default RegistreerPagina;
