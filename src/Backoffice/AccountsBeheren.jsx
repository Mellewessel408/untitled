import { useState } from "react";
import './Accountsbeheren.css';
import VoegMedewerkerToe from "../ZakelijkBeheerder/VoegMedewerkerToe.jsx";
import {useNavigate} from "react-router-dom";

function AccountsBeheren() {
    const mockAccounts = [{
        id: "ACC001",
        name: "Jan de Vries",
        email: "jan.devries@email.com",
        phone: "06-12345678",
        active: true,
        type: "Particulier",
        lastLogin: "2024-01-10T08:30:00",
        address: {
            street: "Hoofdstraat 123",
            city: "Amsterdam",
            postalCode: "1011 AB"
        },
        registrationDate: "2023-05-15"
    },
        {
            id: "ACC002",
            name: "Marie van Dijk",
            email: "marie.vandijk@email.com",
            phone: "06-23456789",
            active: true,
            type: "Zakelijk",
            lastLogin: "2024-01-12T14:20:00",
            address: {
                street: "Kerkweg 45",
                city: "Rotterdam",
                postalCode: "3011 CD"
            },
            registrationDate: "2023-08-22"
        },
        {
            id: "ACC003",
            name: "Peter Bakker",
            email: "peter.bakker@email.com",
            phone: "06-34567890",
            active: false,
            type: "Particulier",
            lastLogin: "2023-12-28T11:15:00",
            address: {
                street: "Dorpsstraat 78",
                city: "Utrecht",
                postalCode: "3511 EF"
            },
            registrationDate: "2023-03-10"
        },
        {
            id: "ACC004",
            name: "Sophie Visser",
            email: "sophie.visser@email.com",
            phone: "06-45678901",
            active: true,
            type: "Zakelijk",
            lastLogin: "2024-01-13T09:45:00",
            address: {
                street: "Stationsweg 256",
                city: "Den Haag",
                postalCode: "2511 GH"
            },
            registrationDate: "2023-11-30"
        },
        {
            id: "ACC005",
            name: "Mohammed El Hassan",
            email: "m.elhassan@email.com",
            phone: "06-56789012",
            active: true,
            type: "Particulier",
            lastLogin: "2024-01-11T16:50:00",
            address: {
                street: "Marktplein 12",
                city: "Eindhoven",
                postalCode: "5611 IJ"
            },
            registrationDate: "2023-09-05"
        }
    ];
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState(mockAccounts);
    const [selectedAccount, setSelectedAccount] = useState(null); // Voor het wijzigen
    const [isEditing, setIsEditing] = useState(false);

    const AccountWijzigen = (account) => {
        setSelectedAccount(account);
        setIsEditing(true);
    };
    const VoegMedewerkerToe = () => {
        navigate("voegMedewerkertoe");
    };

    const AccountVerwijderen = async (id) => {
        try {
            const response = await fetch(`https://localhost:44318/api/account/delete?id=${id}`, {
                method: 'DELETE',
            });
            // Update de lokale state na succesvolle verwijdering
            if (response.ok) {
                setAccounts(accounts.filter(account => account.id !== id));
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch('https://localhost:44318/api/account/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedAccount)
            });

            if (response.ok) {
                // Update de lokale state
                setAccounts(accounts.map(account =>
                    account.id === selectedAccount.id ? selectedAccount : account
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
                    <div key={account.id} className="account-card">
                        <div className="account-header">
                            <div className="account-title">{account.name || 'Account'}</div>
                        </div>
                        <div className="account-content">
                            <div className="account-info">
                                <div className="info-row">
                                    <span className="font-medium">Account ID:</span>
                                    <span>{account.id}</span>
                                </div>
                                <div className="info-row">
                                    <span className="font-medium">Email:</span>
                                    <span>{account.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="font-medium">Status:</span>
                                    <span className={`status-badge ${account.active ? 'status-active' : 'status-inactive'}`}>
                                        {account.active ? 'Actief' : 'Inactief'}
                                    </span>
                                </div>
                                <div className="button-group">
                                    <button
                                        className="action-button delete"
                                        onClick={() => AccountVerwijderen(account.id)}>
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
                        <form onSubmit={handleSaveChanges}>
                            <div className="form-group">
                                <label>Naam:</label>
                                <input
                                    type="text"
                                    value={selectedAccount.name}
                                    onChange={(e) => setSelectedAccount({
                                        ...selectedAccount,
                                        name: e.target.value
                                    })}
                                />
                            </div>
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
                            </div>
                            <div className="form-group">
                                <label>Status:</label>
                                <select
                                    value={selectedAccount.active}
                                    onChange={(e) => setSelectedAccount({
                                        ...selectedAccount,
                                        active: e.target.value === 'true'
                                    })}
                                >
                                    <option value="true">Actief</option>
                                    <option value="false">Inactief</option>
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