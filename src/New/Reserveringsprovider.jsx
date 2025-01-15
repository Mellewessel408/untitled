import {createContext, useContext, useEffect, useState} from "react";
import {useAccount} from "./Accountprovider.jsx";
import PropTypes from "prop-types";

const ReserveringContext = createContext();
const baseURL = `https://localhost:44319/api`;

export const Reserveringsprovider = ({ children }) => {
    const { gebruiker } = useAccount()

    const [reserveringen, setReserveringen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        fetchReserveringen();
    }, [gebruiker.id]);

    const fetchReserveringen = async () => {
        setLoading(true);
        try {
            const url = `${baseURL}/Reservering/GetAll?id=${gebruiker.id}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Netwerkfout (${response.status}): ${response.statusText}`);
            }

            const data = await response.json();

            const sanitizedData = Array.isArray(data) ? data : [];

            // Log or process the Voertuigen details here if necessary
            setReserveringen(sanitizedData);
        } catch (err) {
            console.error("Error fetching reserveringen:", err);
            setError(`Kan reserveringen niet ophalen: ${err.message}`);
            setReserveringen([]);
        } finally {
            setLoading(false);
        }
    };

    let timeoutId;

    function showNotification(ReserveringId, bgColor, actie, duration) {
        const notification = document.getElementById("notification");
        const notificationText = document.getElementById("notificationText");
        const progressBar = document.getElementById("progressBar");

        // Tekst aanpassen
        notificationText.innerHTML = "Reservering #" + ReserveringId + " " + actie;

        // Achtergrondkleur instellen
        notification.style.backgroundColor = bgColor;

        // Annuleer bestaande timer en animatie
        if (timeoutId) {
            clearTimeout(timeoutId);
            progressBar.classList.remove("animated"); // Reset animatie
            void progressBar.offsetWidth; // Forceer hertekening
        }

        // Start progressBar-animatie opnieuw
        progressBar.style.animationDuration = `${duration}ms`;
        progressBar.classList.add("animated");

        // Toon de notificatie
        notification.classList.remove("hidden");
        notification.classList.add("visible");

        // Stel een nieuwe timeout in
        timeoutId = setTimeout(() => {
            notification.classList.remove("visible");
            notification.classList.add("hidden");
            progressBar.classList.remove("animated"); // Stop de animatie
        }, duration);
    }

    const DeleteReserveer = async (ReserveringId) => {
        try {
            const url = `https://localhost:44318/api/Reservering/VerwijderReservering?reserveringId=${ReserveringId}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Verwijder de reservering uit de lokale staat
                setReserveringen((prevReserveringen) =>
                    prevReserveringen.filter((reservering) => reservering.reserveringsId !== ReserveringId)
                );
                showNotification(ReserveringId, "red", "Verwijderd", 3000);
            } else {
                throw new Error(`Verwijderen mislukt: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Fout bij verwijderen reservering:", error);
        }
    };

    return (
        <ReserveringContext.Provider value={{ reserveringen, loading, error, DeleteReserveer }}>
            {children}
        </ReserveringContext.Provider>
    );
};

Reserveringsprovider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useReserveringen = () => useContext(ReserveringContext);