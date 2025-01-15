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

    console.log('AccountProvider state:', gebruiker);

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
                // After successful login, fetch the complete user details including address
                const userDetailsResponse = await fetch(`${baseURL}/Account/GetSpecifiek?id=${responseData.accountId}`);
                if (userDetailsResponse.ok) {
                    const completeUserData = await userDetailsResponse.json();
                    console.log('Complete user data:', completeUserData);
                    setGebruiker(completeUserData);
                    setLoading(false);
                    alert(`Welkom ${completeUserData.email}, ${completeUserData.accountType}`);
                    navigate('/Hoofdscherm');
                } else {
                    throw new Error('Failed to fetch complete user details');
                }
            } else {
                alert('Fout account of wachtwoord')
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
            setLoading(false);
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

    const updateProfile = async (accountId, updateData) => {
        setLoading(true);
        setError(null);

        try {
            // First update the address if it exists
            if (updateData.adres) {
                const adresResponse = await fetch(`${baseURL}/Adres/Update?id=${gebruiker.adres.adresId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData.adres),
                });

                if (!adresResponse.ok) {
                    throw new Error("Failed to update address");
                }
            }

            // Then update the account
            const accountResponse = await fetch(`${baseURL}/Account/Update?id=${accountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: updateData.email,
                    naam: updateData.naam,
                    nummer: updateData.nummer,
                    accountType: gebruiker.accountType,
                    adresId: gebruiker.adres?.adresId
                }),
            });

            if (!accountResponse.ok) {
                throw new Error("Failed to update account");
            }

            // Fetch updated user data
            const updatedUserResponse = await fetch(`${baseURL}/Account/GetSpecifiek?id=${accountId}`);
            if (updatedUserResponse.ok) {
                const updatedUserData = await updatedUserResponse.json();
                setGebruiker(updatedUserData);
            }

            setLoading(false);
            return true;
        } catch (error) {
            setError(error.message);
            setLoading(false);
            throw error;
        }
    };

    const AccountVerwijderen = async () => {
        if (!gebruiker) {
            console.error('Geen gebruiker gevonden om te verwijderen');
            return;
        }

        try {
            const response = await fetch(`${baseURL}/Account/Delete?id=${gebruiker.accountId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                console.log('Account succesvol verwijderd');
                alert('Account succesvol verwijderd!');
                setGebruiker(null);
                navigate('/InlogPagina');
            } else {
                throw new Error('Er is iets misgegaan bij het verwijderen van het account');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het verwijderen van het account! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };

    return (
        <AccountContext.Provider value={{
            loading,
            error,
            gebruiker,
            login,
            logout,
            registreer,
            AccountVerwijderen,
            updateProfile
        }}>
            {children}
        </AccountContext.Provider>
    );
};

AccountProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAccount = () => useContext(AccountContext);