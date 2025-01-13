import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../Login/AccountProvider.jsx";
import "../VoertuigenSelectie.css";
import carAndAllLogo from '../assets/CarAndAll_Logo.webp';

import PropTypes from "prop-types";

// Separate component for individual voertuig card to prevent unnecessary re-renders
const VoertuigenComponent = () => {
const VoertuigCard = React.memo(({
                                     voertuig,
                                     email,
                                     showDetails,
                                     toggleDetails,
                                     formatDatum
                                 }) => {
    return (
        <div className="voertuig-card">
            <div className="voertuig-photo">
                <img
                    src={carAndAllLogo}
                    alt="CarAndAll Logo"
                />
            </div>
            <div className="voertuig-info">
                <h3 className="kenteken">ReserveringsId #{voertuig.reserveringId}</h3>
                <p><strong>E-mail:</strong> {email || 'Laden...'}</p>
                <p>
                    <strong>Aanvraag:</strong> {voertuig.isGoedgekeurd ? "Goedgekeurd" : "In behandeling"}
                </p>
                <p><strong>Begindatum:</strong> {formatDatum(voertuig.begindatum)}</p>
                <p><strong>Einddatum:</strong> {formatDatum(voertuig.einddatum)}</p>
                <p>
                    <strong>Betalingsstatus:</strong> {voertuig.isBetaald ? "Betaald" : `Nog te betalen €${voertuig.totaalPrijs || 0}`}
                </p>
                <div className="button-container">
                    <button
                        className="details-button"
                        onClick={() => toggleDetails(voertuig.voertuigId)}
                    >
                        {showDetails === voertuig.voertuigId ? "Verberg Details" : "Toon Details"}
                    </button>
                </div>
                {showDetails === voertuig.voertuigId && (
                    <div className="voertuig-details">
                        <p><strong>Kenteken:</strong> {voertuig.voertuig?.kenteken || 'Onbekend'}</p>
                        <p><strong>Voertuig:</strong> {voertuig.voertuig ? `${voertuig.voertuig.merk} ${voertuig.voertuig.model}` : 'Onbekend'}</p>
                        <p><strong>Comment:</strong> {voertuig.comment || "Geen comment"}</p>
                        <p><strong>Totaalprijs:</strong> €{voertuig.totaalPrijs || 0}</p>

                        <button className="VerwijderKnop" onClick={() => VerwijderReservering(voertuig.reserveringId)}>Verwijderen</button>

                    </div>
                )}
            </div>
        </div>
    );
});

// Define PropTypes for proper prop validation
VoertuigCard.propTypes = {
    voertuig: PropTypes.shape({
        reserveringId: PropTypes.number.isRequired,
        voertuigId: PropTypes.number.isRequired,
        isGoedgekeurd: PropTypes.bool.isRequired,
        isBetaald: PropTypes.bool.isRequired,
        begindatum: PropTypes.string.isRequired,
        einddatum: PropTypes.string.isRequired,
        totaalPrijs: PropTypes.number,
        comment: PropTypes.string,
        voertuig: PropTypes.shape({
            kenteken: PropTypes.string,
            merk: PropTypes.string,
            model: PropTypes.string
        })
    }).isRequired,
    email: PropTypes.string,
    showDetails: PropTypes.number,
    toggleDetails: PropTypes.func.isRequired,
    formatDatum: PropTypes.func.isRequired
};

// Add display name for debugging purposes
VoertuigCard.displayName = 'VoertuigCard';


    // Combine related state to reduce updates
    const [filterCriteria, setFilterCriteria] = useState({
        searchTerm: "",
        begindatum: "",
        einddatum: ""
    });

    const [state, setState] = useState({
        reserveringen: [],
        loading: true,
        error: null,
        showDetails: null,
        emails: {}
    });

    const { currentAccountId, logout } = useAccount();
    const navigate = useNavigate();
    const apiBaseUrl = `https://localhost:44318/api/ZakelijkBeheerder`;

    const VerwijderReservering = async (ReserveringId) => {
        // Optimistische update
        const nieuweReserveringen = state.reserveringen.filter(
            (reservering) => reservering.reserveringId !== ReserveringId
        );
        setState(prevState => ({
            ...prevState,
            reserveringen: nieuweReserveringen
        }));

        try {
            const response = await fetch(`https://localhost:44318/api/Reservering/VerwijderReservering?reserveringId=${ReserveringId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Verwijderen mislukt: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Fout bij verwijderen:", error);
            // Terugdraaien van de update als de API-aanroep mislukt
            setState(prevState => ({
                ...prevState,
                reserveringen: state.reserveringen
            }));
        }
    };


    // Memoize the date formatter
    const formatDatum = useCallback((datum) => {
        try {
            return new Date(datum).toLocaleDateString("nl-NL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        } catch {
            return 'Ongeldige datum';
        }
    }, []);

    // Batch fetch emails with debouncing
    const fetchEmails = useCallback(async (accountIds) => {
        const uniqueIds = [...new Set(accountIds)].filter(id => id && id !== 0);
        const unfetchedIds = uniqueIds.filter(id => !state.emails[id]);

        if (unfetchedIds.length === 0) return;

        try {
            const promises = unfetchedIds.map(async (accountId) => {
                const response = await fetch(
                    `${apiBaseUrl}/KrijgAccountemail?accountId=${accountId}`,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (!response.ok) throw new Error();
                const email = await response.text();
                return { accountId, email };
            });

            const results = await Promise.all(promises);
            setState(prev => ({
                ...prev,
                emails: {
                    ...prev.emails,
                    ...Object.fromEntries(results.map(({ accountId, email }) => [accountId, email]))
                }
            }));
        } catch (error) {
            console.error('Email fetch error:', error);
        }
    }, [apiBaseUrl, state.emails]);

    // Optimize filtering with useMemo
    const filteredVoertuigen = useMemo(() => {
        const { searchTerm, begindatum, einddatum } = filterCriteria;

        if (!state.reserveringen.length) return [];

        return state.reserveringen.filter(voertuig => {
            if (!voertuig) return false;

            const searchValues = [
                voertuig.voertuig?.kenteken,
                voertuig.voertuig?.merk,
                voertuig.voertuig?.model,
                voertuig.comment
            ].filter(Boolean).join(' ').toLowerCase();

            const matchesSearch = !searchTerm ||
                searchValues.includes(searchTerm.toLowerCase());

            const matchesDate = (!begindatum || new Date(voertuig.einddatum) >= new Date(begindatum)) &&
                (!einddatum || new Date(voertuig.begindatum) <= new Date(einddatum));

            return matchesSearch && matchesDate;
        });
    }, [state.reserveringen, filterCriteria]);

    // Initial data fetch
    useEffect(() => {
        if (!currentAccountId || currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId");
            navigate('inlogpagina');
            return;
        }

        const fetchData = async () => {
            try {
                const bedrijfResponse = await fetch(`${apiBaseUrl}/KrijgBedrijfId?accountId=${currentAccountId}`);
                if (!bedrijfResponse.ok) throw new Error();
                const bedrijfId = await bedrijfResponse.json();

                const reserveringenResponse = await fetch(
                    `https://localhost:44318/api/Reservering/KrijgGehuurdeBedrijfsreserveringen?bedrijfsId=${bedrijfId}`
                );
                if (!reserveringenResponse.ok) throw new Error();
                const data = await reserveringenResponse.json();

                setState(prev => ({
                    ...prev,
                    reserveringen: data.$values || [],
                    loading: false
                }));
            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: "Kan voertuigen niet ophalen",
                    loading: false
                }));
            }
        };

        fetchData();
    }, [currentAccountId, navigate, apiBaseUrl]);

    // Optimized email fetching
    useEffect(() => {
        if (filteredVoertuigen.length > 0) {
            const accountIds = filteredVoertuigen
                .filter(v => v && v.accountId)
                .map(v => v.accountId);
            fetchEmails(accountIds);
        }
    }, [filteredVoertuigen, fetchEmails]);

    const handleSearchChange = useCallback((e) => {
        const { id, value } = e.target;
        setFilterCriteria(prev => ({
            ...prev,
            [id === 'searchInput' ? 'searchTerm' : id]: value
        }));
    }, []);

    const toggleDetails = useCallback((voertuigId) => {
        setState(prev => ({
            ...prev,
            showDetails: prev.showDetails === voertuigId ? null : voertuigId
        }));
    }, []);

    if (state.loading) return <div className="loading">Laden...</div>;
    if (state.error) return <div className="error">{state.error}</div>;

    return (
        <div className="voertuigen-container">
            <header className="header">
                <h1>Gehuurde autos</h1>
                <button
                    className="logout-button small"
                    onClick={() => {
                        logout();
                        navigate('Inlogpagina');
                    }}
                >
                    Log uit
                </button>
            </header>
            <div className="search-filter">
                <input
                    type="date"
                    id="begindatum"
                    placeholder="Kies begindatum"
                    className="flatpickr-calander"
                    value={filterCriteria.begindatum}
                    onChange={handleSearchChange}
                    min={new Date().toISOString().split('T')[0]}
                    max={filterCriteria.einddatum}
                />
                <input
                    type="date"
                    id="einddatum"
                    placeholder="Kies einddatum"
                    className="flatpickr-calander"
                    value={filterCriteria.einddatum}
                    onChange={handleSearchChange}
                    min={filterCriteria.begindatum || new Date().toISOString().split('T')[0]}
                />
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Zoek op merk of model"
                    value={filterCriteria.searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
            </div>
            <div className="voertuigen-grid">
                {filteredVoertuigen.length === 0 ? (
                    <div className="no-vehicles">Geen voertuigen gevonden</div>
                ) : (
                    filteredVoertuigen.map((voertuig) => (
                        <VoertuigCard
                            key={`reservation-${voertuig.reserveringId}`}
                            voertuig={voertuig}
                            email={state.emails[voertuig.accountId]}
                            showDetails={state.showDetails}
                            toggleDetails={toggleDetails}
                            formatDatum={formatDatum}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default VoertuigenComponent;