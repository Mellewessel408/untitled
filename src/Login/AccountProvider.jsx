import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const [currentAccountId, setCurrentAccountId] = useState(() => {
        const storedAccountId = localStorage.getItem('currentAccountId');
        return storedAccountId ? JSON.parse(storedAccountId) : 0;
    });

    const login = (accountId) => {
        setCurrentAccountId(accountId);
        // Sla het accountId op in de localStorage
        localStorage.setItem('currentAccountId', JSON.stringify(accountId));
    };

    const logout = () => {
        setCurrentAccountId(null);
        // Verwijder het accountId uit de localStorage
        localStorage.removeItem('currentAccountId');
    };


    return (
        <AccountContext.Provider value={{ currentAccountId, login, logout }}>
            {children}
        </AccountContext.Provider>
    );
};

// PropTypes validation
AccountProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAccount = () => useContext(AccountContext);
