import React, {useEffect, useState} from 'react';
import './InlogPagina.css';
import './KiesGebruiker.jsx';
import { useNavigate } from 'react-router-dom';
import {AccountProvider, useAccount} from "./AccountProvider.jsx";

function InlogPagina() {
    const [email, setEmail] = useState('');
    const [wachtwoord, setWachtwoord] = useState('');

    const navigate = useNavigate();
    const { login } = useAccount();
    const [gebruiker, setGebruiker] = useState('Particulier');

    const [isOpen, setIsOpen] = useState(false);

    const privacyPolicyText = 'Wij hechten grote waarde aan de bescherming van uw persoonsgegevens en zorgen ervoor dat uw gegevens op een veilige en verantwoorde manier worden behandeld. Deze verklaring legt uit hoe wij omgaan met uw persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG), ISO 27001, en andere relevante wet- en regelgeving.\n' +
        '\n' +
        '1. Doel van Gegevensverwerking\n' +
        'Wij verwerken persoonsgegevens uitsluitend voor de volgende doeleinden:\n' +
        '\n' +
        'Dienstverlening: Het leveren van onze diensten aan u, inclusief het beheren van verhuuraanvragen, het verwerken van betalingen, en het verstrekken van facturen.\n' +
        'Beveiliging en monitoring: Het waarborgen van de veiligheid van onze systemen en het monitoren van ongeautoriseerde toegang.\n' +
        'Wet- en regelgeving: Het voldoen aan wettelijke verplichtingen, waaronder belastingwetgeving en regelgeving met betrekking tot gegevensbeveiliging.\n' +
        '2. Gegevens die Wij Verzamelen\n' +
        'Wij verzamelen de volgende persoonsgegevens:\n' +
        '\n' +
        'Gebruikersgegevens: Naam, e-mailadres, telefoonnummer, adres.\n' +
        'Inloggegevens: Wachtwoord (gehasht), tijdstippen van inloggen, uitloggen, en mislukte inlogpogingen.\n' +
        'Activiteit: Wijzigingen aan toegangsrechten, boekingen, transacties, en systeembeheer (fouten en crashes).\n' +
        'Betalingsinformatie: Factuur-ID (gehasht).\n' +
        'IP-adres: Het IP-adres van de gebruiker (gehasht).\n' +
        '3. Bewaartermijnen\n' +
        'Wij bewaren uw gegevens voor de minimale periode die noodzakelijk is voor het doel waarvoor ze zijn verzameld:\n' +
        '\n' +
        'Gebruikersinformatie: Minimaal 1 jaar, maximaal 5 jaar.\n' +
        'Gebruikersactiviteit: Minimaal 1 jaar, maximaal 7 jaar.\n' +
        'Transacties: Maximaal 7 jaar.\n' +
        'Systeembeheer: Minimaal 6 maanden.\n' +
        '4. Logging en Monitoring\n' +
        'Wij loggen de volgende gegevens:\n' +
        '\n' +
        'Inlog- en gebruikersactiviteit: Tijdstip van inloggen en uitloggen, mislukte inlogpogingen, wijziging van toegangsrechten.\n' +
        'Transacties en boekingen: Alle wijzigingen aan boekingen en transactie-informatie.\n' +
        'Fouten en systeemcrashes: Gegevens over fouten en crashes in het systeem.\n' +
        'IP-adres en wachtwoorden: Deze worden gehasht om de veiligheid te waarborgen.\n' +
        'Wij voeren periodieke controles uit op logbestanden om afwijkingen of beveiligingsincidenten te detecteren. Wij gebruiken hashingtechnologie om de integriteit van gelogde bestanden te waarborgen.\n' +
        '\n' +
        '5. Gegevensbeveiliging\n' +
        'Wij nemen passende maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik, en ongeautoriseerde toegang, waaronder:\n' +
        '\n' +
        'Encryptie: Alle gevoelige gegevens worden versleuteld.\n' +
        'Authenticatie: Wij gebruiken sterke wachtwoordvereisten en tweefactorauthenticatie (2FA) waar mogelijk.\n' +
        'Beperkingen op toegang: Medewerkers hebben alleen toegang tot gegevens die zij nodig hebben om hun taken uit te voeren.\n' +
        '6. Gegevensminimalisatie en Anonimisering\n' +
        'Wij verzamelen alleen de gegevens die strikt noodzakelijk zijn voor het uitvoeren van onze diensten. Waar mogelijk anonimiseren wij gegevens om de privacy van onze gebruikers te waarborgen.\n' +
        '\n' +
        '7. Toestemming en Transparantie\n' +
        'Wij zullen nooit persoonsgegevens verwerken zonder voorafgaande toestemming van de gebruiker, tenzij dit wettelijk vereist is. U hebt altijd het recht om uw toestemming in te trekken.\n' +
        '\n' +
        '8. Uw Rechten\n' +
        'U hebt de volgende rechten met betrekking tot uw persoonsgegevens:\n' +
        '\n' +
        'Recht op inzage: U kunt op elk moment verzoeken om inzage in de gegevens die wij van u verwerken.\n' +
        'Recht op correctie: U kunt verzoeken om correctie van onjuiste of onvolledige gegevens.\n' +
        'Recht op verwijdering: U kunt verzoeken om verwijdering van uw gegevens, tenzij wij wettelijk verplicht zijn om ze te bewaren.\n' +
        'Recht op bezwaar: U kunt bezwaar maken tegen de verwerking van uw persoonsgegevens.\n' +
        '9. Gegevensdeling\n' +
        'Uw gegevens worden niet gedeeld met derden, tenzij dit nodig is voor het uitvoeren van de overeenkomst, voor wettelijke verplichtingen, of voor het verbeteren van de diensten die wij aanbieden.\n' +
        '\n' +
        '10. Beveiligingsmaatregelen en Audits\n' +
        'Wij voeren regelmatig beveiligingsaudits uit om de effectiviteit van onze beveiligingsmaatregelen te testen en te verbeteren. Tevens maken wij regelmatig back-ups van onze systemen om gegevensverlies te voorkomen.\n' +
        '\n' +
        '11. Privacy by Design en Security by Design\n' +
        'Onze systemen en processen zijn ontworpen met de bescherming van persoonsgegevens en de veiligheid van uw gegevens als kernprincipes. Wij nemen alle noodzakelijke technische en organisatorische maatregelen om ervoor te zorgen dat gegevensverwerking op een veilige en verantwoorde manier gebeurt vanaf het begin van onze ontwikkeling.\n' +
        '\n' +
        '12. Ethische Overwegingen\n' +
        'Wij nemen ethische overwegingen in acht bij de verwerking van gegevens. Wij zorgen ervoor dat persoonsgegevens niet op een manier worden gebruikt die in strijd is met de rechten van de gebruiker of die niet in overeenstemming is met ethische normen.\n' +
        '\n' +
        '13. Wijzigingen in deze Privacyverklaring\n' +
        'Wij behouden ons het recht voor om deze privacyverklaring te wijzigen. Wij zullen u tijdig informeren over belangrijke wijzigingen die invloed kunnen hebben op de manier waarop wij met uw gegevens omgaan.';

    const inlogKnop = async (event) => {
        event.preventDefault(); // Voorkomt dat het formulier standaard wordt ingediend

        const data = {
            email: email,
            wachtwoord: wachtwoord
        }

        try {
            // Verstuur het POST-verzoek naar de backend
            const response = await fetch('https://localhost:44318/api/' + gebruiker + '/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Als de request succesvol is
            if (response.ok) {
                // Lees de JSON-body van de response
                const responseData = await response.json();

                console.log("Object terughalen voor AccountId:", responseData);
                login(responseData.accountId); // Account-ID instellen vanuit de JSON-response


                console.log('Account succesvol ingelogd');
                alert('Inloggen succesvol!');
                navigate('/Hoofdscherm' + gebruiker); // Of een andere route
            } else {
                alert('Deze combinatie van inloggegevens klopt niet, probeer het A.U.B. opnieuw.');
            }
        } catch (error) {
            // Foutafhandelingslogica
            console.error('Er is een fout opgetreden:', error.message);
            alert('Er is iets misgegaan bij het inloggen! Fout details: ' + JSON.stringify(error, null, 2));
        }
    };

    const registrerenKnop = () => {
        navigate('KiesGebruiker');
    };



    return (
        <>
            <div className="container">
                <h1>Inloggen</h1>


                <label htmlFor="Kies-type-gebruiker">Kies type gebruiker</label>
                <select
                    id="Kies-type-gebruiker"
                    value={gebruiker}
                    onChange={(e) => setGebruiker(e.target.value)}
                    aria-labelledby="Kies-type-gebruiker" // Geeft extra duidelijkheid voor schermlezers
                >
                    <option value="Particulier">Particulier</option>
                    <option value="Backoffice">Backoffice</option>
                    <option value="Frontoffice">Frontoffice</option>
                    <option value="ZakelijkHuurder">Zakelijk Huurder</option>
                    <option value="ZakelijkBeheerder">Zakelijk Beheerder</option>
                </select>
                <form className="Inlogform" onSubmit={inlogKnop}>
                    <div>
                        <label htmlFor="email">E-mailadres:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Vul je emailadres in..."
                        />
                    </div>
                    <div>
                        <label htmlFor="wachtwoord">Wachtwoord: </label>
                        <input
                            type="password"
                            id="wachtwoord"
                            name="wachtwoord"
                            value={wachtwoord}
                            onChange={(e) => setWachtwoord(e.target.value)}
                            required
                            placeholder="Vul hier uw wachtwoord in..."
                        />
                    </div>
                    <button className="Inlogknop">Inloggen</button>
                </form>

                <button
                    className="Inlogknop"
                    onClick={registrerenKnop}>Registreren
                </button>

                <button
                    className="Inlogknop"
                    onClick={() => setIsOpen(true)}
                >
                    Privacybeleid
                </button>
                {isOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close-button" onClick={() => setIsOpen(false)}>
                                &times;
                            </span>
                            <p className="policy-text">{privacyPolicyText}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default InlogPagina;
