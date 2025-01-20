import {useEffect, useState} from "react";
import './Accountsbeheren.css';
import VoegMedewerkerToe from "../ZakelijkBeheerder/VoegMedewerkerToe.jsx";
import {useNavigate} from "react-router-dom";

function AccountsBeheren() {

    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null); // Voor het wijzigen
    const [isEditing, setIsEditing] = useState(false);
    const [selectedType, setSelectedType] = useState(null);



    async function fetchAccounts() {
        try {
            const response = await fetch(`https://localhost:44319/api/account/getall?accountType=frontoffice`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Er is een fout opgetreden: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Fout bij het ophalen van de accounts:', error);
        }
    }

// 2. useEffect met lege dependency array voor eenmalige uitvoering
    useEffect(() => {
        fetchAccounts();
    }, []);

// Aanroepen van de functie


        const AccountWijzigen = (account) => {
        setSelectedAccount(account);
        setIsEditing(true);
    };
    const VoegMedewerkerToe = () => {
        navigate("voegMedewerkertoe");
    };

    const AccountVerwijderen = async (id) => {
        try {
            const response = await fetch(`https://localhost:44319/api/account/delete?id=${id}`, {
                method: 'DELETE',
            });
            // Update de lokale state na succesvolle verwijdering
            if (response.ok) {
                setAccounts(accounts.filter(account => account.accountId !== id));
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };

    const handleSaveChanges = async (updatedAccount) => {
        try {
            const response = await fetch(`https://localhost:44319/api/account/update?id=${updatedAccount.accountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAccount)
            });

            if (response.ok) {
                // Update de lokale state
                setAccounts(accounts.map(account =>
                    account.accountId === updatedAccount.accountId ? updatedAccount : account
                ));
                setIsEditing(false);
                setSelectedAccount(null);
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het wijzigen!');
        }
    };

    return (
        <div className="accounts-container">
            <h2 className="text-2xl font-bold mb-4">Medewerkers Overzicht</h2>
            <button onClick={VoegMedewerkerToe}>Medewerker toevoegen</button>
            <div className="accounts-grid">
                {accounts.map((account) => (

                    <div key={account.accountId} className="account-card">
                        <div className="account-header">
                            <div className="account-title">{account.accountType}</div>
                        </div>
                        <div className="account-content">
                            <div className="account-info">
                                <div className="info-row">
                                    <span className="font-medium">Account ID:</span>
                                    <span>{account.accountId}</span>
                                </div>
                                <div className="info-row">
                                    <span className="font-medium">Email:</span>
                                    <span>{account.email}</span>
                                </div>

                                <div className="button-group">
                                    <button
                                        className="action-button delete"
                                        onClick={() => AccountVerwijderen(account.accountId)}>
                                        Verwijderen
                                    </button>
                                    <button
                                        className="action-button edit"
                                        onClick={() => AccountWijzigen(account)}>
                                        Wijzigen
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && selectedAccount && (
                <div className="edit-overlay">
                    <div className="edit-modal">
                        <h3>Account Wijzigen</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault(); // Voorkom standaard form submit
                            const updatedAccount = {
                                ...selectedAccount,
                                accountType: selectedType // Voeg het geselecteerde type toe aan het account
                            };
                            handleSaveChanges(updatedAccount); // Geef het bijgewerkte account mee
                        }}>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={selectedAccount.email}
                                    onChange={(e) => setSelectedAccount({
                                        ...selectedAccount,
                                        email: e.target.value
                                    })}
                                />
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="p-2 border rounded-md"
                                >
                                    <option value="FrontofficeAccount">Frontoffice Medewerkers</option>
                                    <option value="BackofficeAccount">Backoffice Medewerkers</option>
                                </select>
                            </div>

                            <div className="button-group">
                                <button type="submit" className="action-button save">
                                    Opslaan
                                </button>
                                <button
                                    type="button"
                                    className="action-button cancel"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setSelectedAccount(null);
                                    }}
                                >
                                    Annuleren
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountsBeheren;