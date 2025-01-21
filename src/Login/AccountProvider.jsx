import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(() => {
        const storedAccount = localStorage.getItem('currentAccount');
        return storedAccount && !isNaN(Number(storedAccount)) ? JSON.parse(storedAccount) : null;
    });

    const login = (account) => {
        setCurrentAccount(account);
    };

    const logout = () => {
        setCurrentAccount(null);
    };

    useEffect(() => {
        if (currentAccount !== null) {
            // Sla het accountId op in localStorage als het is ingesteld
            localStorage.setItem('currentAccountId', JSON.stringify(currentAccount));
        } else {
            // Verwijder het accountId uit localStorage als er uitgelogd is
            localStorage.removeItem('currentAccountId');
        }
    }, [currentAccount]);  // Bijwerken van localStorage wanneer currentAccountId verandert

    return (
        <AccountContext.Provider value={{ currentAccount, login, logout }}>
            {children}
        </AccountContext.Provider>
    );
};

// PropTypes validatie
AccountProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAccount = () => useContext(AccountContext);
