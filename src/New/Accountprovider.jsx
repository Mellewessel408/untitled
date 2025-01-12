import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AccountContext = createContext();

const baseURL = `https://localhost:44319/api`

export const AccountProvider = ({ children }) => {
    const navigate = useNavigate();
    const [gebruiker, setGebruiker] = useState(() => {
        const storedUser = localStorage.getItem("gebruiker");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (gebruiker) {
            localStorage.setItem("gebruiker", JSON.stringify(gebruiker));
        } else {
            localStorage.removeItem("gebruiker");
        }
    }, [gebruiker]);

    const login = async (email, wachtwoord) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${baseURL}/Account/Login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, wachtwoord})
            });

            const responseData = await response.json();

            if (response.ok) {
                setGebruiker(responseData);
                setLoading(false);
                alert(`Welkom ${responseData.email}, ${responseData.accountType}`);
            } else {
                alert('Fout account of wachtwoord')
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
        }

    };

    const logout = () => {
        setGebruiker(null);
        navigate('/InlogPagina');
    };

    const registreer = async (event, accountType, data) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let adresId = null;
            let bedrijfId = null;
            let accountData = data;

            // Step 1: Create address if it exists in the data
            if (data.adres) {
                const adresResponse = await fetch(`${baseURL}/Adres/Create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data.adres),
                });

                if (!adresResponse.ok) {
                    throw new Error("Adresregistratie mislukt");
                }

                const adresData = await adresResponse.json();
                adresId = adresData.adresId;
            }

            // Step 2: Create business (only for ZakelijkBeheerder) and use the adresId
            if (accountType === "ZakelijkBeheerder" && data.bedrijf) {
                const bedrijfDataWithAdres = {
                    ...data.bedrijf,
                    adresId,  // Use the adresId here
                };

                const bedrijfResponse = await fetch(`${baseURL}/Bedrijf/Create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bedrijfDataWithAdres),
                });

                if (!bedrijfResponse.ok) {
                    throw new Error("Bedrijf registratie mislukt");
                }

                const bedrijfData = await bedrijfResponse.json();
                bedrijfId = bedrijfData.id;

                accountData = {
                    accountType: accountType,
                    email: data.email,
                    wachtwoord: data.wachtwoord,
                    naam: "",
                    nummer: bedrijfId,
                    adresId: adresId
                };
            }

            if (accountType === "Particulier") {
                accountData = {
                    accountType: accountType,
                    email: data.email,
                    wachtwoord: data.wachtwoord,
                    naam: data.naam,
                    nummer: data.nummer ? parseInt(data.nummer) : 0,
                    adresId: adresId,
                };
            }
            console.log(accountData)

            const response = await fetch(`${baseURL}/Account/Registreer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accountData),
            });

            if (response.ok) {
                const responseData = await response.json();
                alert(`Registratie succesvol! Welkom, ${responseData.email}`);
                navigate('/InlogPagina');
            } else {
                const errorData = await response.json();
                setError(`Registratie mislukt: ${errorData.message || response.statusText}`);
                alert(`Registratie mislukt: ${errorData.message || response.statusText}`);
            }
        } catch (err) {
            console.error('Fout tijdens registratie:', err.message);
            setError(`Fout tijdens registratie: ${err.message}`);
            alert(`Fout tijdens registratie: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const verwijder = async (email) => {
        try {
            const response = await fetch(`${baseURL}/Account/Delete?id=${gebruiker.accountId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, wachtwoord})
            });
        }
    }

    return (
        <AccountContext.Provider value={{ loading, error, gebruiker, login, logout, registreer, verwijder }}>
            {children}
        </AccountContext.Provider>
    );
};

AccountProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAccount = () => useContext(AccountContext);