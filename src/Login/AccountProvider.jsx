import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const [currentAccountId, setCurrentAccountId] = useState(() => {
        const storedAccountId = localStorage.getItem('currentAccountId');
        return storedAccountId && !isNaN(Number(storedAccountId)) ? JSON.parse(storedAccountId) : null;
    });

    const login = (accountId) => {
        setCurrentAccountId(accountId);
    };

    const logout = () => {
        setCurrentAccountId(null);
    };

    useEffect(() => {
        if (currentAccountId !== null) {
            // Sla het accountId op in localStorage als het is ingesteld
            localStorage.setItem('currentAccountId', JSON.stringify(currentAccountId));
        } else {
            // Verwijder het accountId uit localStorage als er uitgelogd is
            localStorage.removeItem('currentAccountId');
        }
    }, [currentAccountId]);  // Bijwerken van localStorage wanneer currentAccountId verandert

    return (
        <AccountContext.Provider value={{ currentAccountId, login, logout }}>
            {children}
        </AccountContext.Provider>
    );
};

// PropTypes validatie
AccountProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAccount = () => useContext(AccountContext);
