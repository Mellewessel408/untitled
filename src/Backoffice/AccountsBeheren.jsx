import {useEffect, useState} from "react";
import './Accountsbeheren.css';
import {useNavigate} from "react-router-dom";

function AccountsBeheren() {

    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null); // Voor het wijzigen
    const [isEditing, setIsEditing] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    async function fetchAccounts() {
        try {
            const response = await fetch(`https://localhost:44318/api/Frontoffice/Krijg alle accounts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Er is een fout opgetreden: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const frontofficeAccounts = data.$values.map((account) => ({
                ...account,
                type: 'frontoffice',
            }));
            setAccounts(frontofficeAccounts);
        } catch (error) {
            console.error('Fout bij het ophalen van de accounts:', error);
        }
    }
    async function fetchAccountsBackoffice() {
        try {
            const response = await fetch(`https://localhost:44318/api/Backoffice/Krijg alle accounts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Er is een fout opgetreden: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const backofficeAccounts = data.$values.map((account) => ({
                ...account,
                type: 'backoffice',
            }));
            setAccounts((prevAccounts) => [...prevAccounts, ...backofficeAccounts]);
        } catch (error) {
            console.error('Fout bij het ophalen van de accounts:', error);
        }
    }
    async function WijzigAccount(account) {
        try {
            const body = {
                accountId: account.accountId,
                email: account.email,
                wachtwoord: account.wachtwoord
            };
            const response = await fetch(`https://localhost:44318/api/${account.type}/UpdateAccount?id=${account.accountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
        }
        catch (error) {
            console.error('Fout bij het ophalen van de accounts:', error);
        }
    }

    useEffect(() => {
        fetchAccounts();

        fetchAccountsBackoffice();
    }, []);


        const AccountWijzigen = (account) => {
        setSelectedAccount(account);
        setIsEditing(true);

    };
    const VoegMedewerkerToe = () => {
        navigate("voegMedewerkertoe");
    };
    const wijzigMedewerker = (account) => {
        WijzigAccount(account);

    }

    const AccountVerwijderen = async (id) => {
        try {
            const response = await fetch(`https://localhost:44318/api/Backoffice/DeleteAccount?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setAccounts(accounts.filter(account => account.accountId !== id));
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan! Fout details: ' + JSON.stringify(error, null, 2));
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
                                <div className="info-row">
                                    <span className="font-medium">SoortMedewerker:</span>
                                    <span>{account.type}</span>
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
                            e.preventDefault();

                            const updatedAccount = {
                                ...selectedAccount,
                                accountType: selectedType
                            };
                            wijzigMedewerker(updatedAccount)
                        }}>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    id = "email"
                                    type="email"
                                    value={selectedAccount.email}
                                    onChange={(e) => setSelectedAccount({
                                        ...selectedAccount,
                                        email: e.target.value
                                    })}
                                />
                                <select
                                    id={"type"}
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