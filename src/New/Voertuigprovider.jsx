import {createContext, useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";

const VoertuigContext = createContext();

const baseURL = `https://localhost:44319/api`;
export const Voertuigprovider = ({ children }) => {
    const [voertuigen, setVoertuigen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVoertuigen();
    }, [])

    const fetchVoertuigen = async () => {
        setLoading(true);
        try {
            const url = `${baseURL}/Voertuig/GetAll`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Netwerkfout (${response.status}): ${response.statusText}`);
            }

            const data = await response.json();

            const sanitizedData = Array.isArray(data.voertuigen) ? data.voertuigen : [];

            setVoertuigen(sanitizedData);
        } catch (err) {
            console.error("Error fetching voertuigen:", err);
            setError(`Kan voertuigen niet ophalen: ${err.message}`);
            setVoertuigen([]);
        } finally {
            setLoading(false);
        }
    };



    return(
        <VoertuigContext.Provider value={{ voertuigen, loading, error}}>
            { children }
        </VoertuigContext.Provider>
    );
};

Voertuigprovider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useVoertuigen = () => useContext(VoertuigContext);