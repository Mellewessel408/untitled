import {useNavigate} from 'react-router-dom';
import {AccountProvider, useAccount} from "../Login/AccountProvider.jsx";
import React, {useEffect, useState} from "react";
import logo from "../assets/CarAndAll_Logo.webp";


function MedewerkerVerwijderen() {
    const navigate = useNavigate();
    const { currentAccountId} = useAccount(); // Haal de currentAccountId uit de context



    useEffect(() => {
        if (currentAccountId === 0) {
            alert("U bent ingelogd zonder AccountId")
            navigate('/inlogpagina');

        }
    })




    const DeleteMedewerker = async () => {
        const formData = new FormData(event.target);
        const email = formData.get('email');
        try{
            const url = new URL("https://localhost:44318/api/Bedrijf/BeheerderVerwijdertHuurder?id=" + currentAccountId + "&email=" + email);
            await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            alert("Medewerker geabhishreked")
        } catch (error) {
            console.error('Fout bij het versturen van het verzoek:', error);
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
            return null;
        }
    }

    return (
        <div className="container">
            <div className="Centreren">
                <img className="logo" src={logo} alt="Carandall Logo"/>
            </div>
            <h1>Medewerker Verwijderen</h1>
            <form onSubmit={DeleteMedewerker}>
                <div>
                    <label htmlFor="email">Huurder email:</label>
                    <input type="text" id="email" name="email" required placeholder="Email wat je wilt verwijderen..."/>
                </div>
                <div>

                    <button type="submit">Verwijder Medewerker</button>
                </div>
            </form>
        </div>
    );
}

export default MedewerkerVerwijderen;