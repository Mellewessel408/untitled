﻿import './Login/Registreren.css';
import logo from "./assets/CarAndAll Logo.webp";
import {useAccount} from "./Login/AccountProvider.jsx";
import React from "react";

function ProfielWijzigen(){
    const { currentAccountId } = useAccount();
    const accountIdString = String(currentAccountId)


    const Wijzigen = async (event) => {
        event.preventDefault();


        const formData = new FormData(event.target);
        const naam = formData.get('naam');
        const email = formData.get('email');
        const telefoonnummer = formData.get('telefoonnummer');
        const postcode = formData.get('postcode');
        const huisnummer = formData.get('huisnummer');
        const wachtwoord = formData.get('wachtwoord');
        const herhaalWachtwoord = formData.get('herhaalWachtwoord');

        if (wachtwoord !== herhaalWachtwoord) {
            alert('Wachtwoorden komen niet overeen. Probeer het opnieuw.');
            return;
        }

        const dto = {
            email: email,
            wachtwoord: wachtwoord,
            naam: naam,
            telefoonnummer: Number(telefoonnummer),
            postcode: postcode,
            huisnummer: Number(huisnummer),
        };

        try {
            const url = new URL("https://localhost:44318/api/Particulier/UpdateAccount");
            url.searchParams.append("id", accountIdString)
            console.log(url.toString())
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dto),
            });
            if (response.ok) {

                console.log('Account succesvol geupdate');
                alert('account succesvol geupdate');
            } else {
                const errorMessage = await response.text();
                alert(`Fout: ${errorMessage}`);
            }
        }
        catch (error) {
            console.error('Fout bij het versturen van het verzoek: ', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.')
        }
    }

    return (
        <div className="container">
            <div className="Centreren">
                <img className="logo" src={logo} alt="Carandall Logo"/>
            </div>
            <h1>Wijzig Profiel</h1>

            <form onSubmit={Wijzigen}>
                <div>
                    <label htmlFor="email">Emailadres:</label>
                    <input type="email" id="email" name="email" required placeholder="Vul je emailadres in..."/>
                </div>

                <div>
                    <label htmlFor="naam">Naam:</label>
                    <input type="text" id="naam" name="naam" required
                           placeholder="Vul uw naam in"/>
                </div>

                <div>
                    <label htmlFor="wachtwoord">Wachtwoord: </label>
                    <input type="password" id="wachtwoord" name="wachtwoord" required
                           placeholder="(minimaal 8 karakters)" minLength="8"/>
                </div>

                <div>
                    <label htmlFor="herhaalWachtwoord">Herhaal wachtwoord:</label>
                    <input type="password" id="herhaalWachtwoord" name="herhaalWachtwoord" required
                           placeholder="Vul je wachtwoord in..." minLength="8"/>
                </div>

                <div>
                    <label htmlFor="postcode">Postcode:</label>
                    <input type="text" id="postcode" name="postcode" pattern="[0-9]{4}\s?[A-Z]{2}" required
                           placeholder="1111AA"/>
                </div>

                <div>
                    <label htmlFor="huisnummer">Huisnummer:</label>
                    <input type="text" id="huisnummer" name="huisnummer" required
                           placeholder="Vul je Huisnummer in..."/>
                </div>

                <div>
                    <label htmlFor="telefoonnummer">Telefoonnummer:</label>
                    <input type="tel" id="telefoonnummer" name="telefoonnummer" required
                           placeholder="Vul je Telefoonnummer in..."/>
                </div>

                <button type="submit">Wijzig</button>
            </form>
        </div>
    );
}

export default ProfielWijzigen;