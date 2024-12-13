import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const [currentAccountId, setCurrentAccountId] = useState(28);

    const login = (accountId) => setCurrentAccountId(accountId);
    const logout = () => setCurrentAccountId(null);

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
