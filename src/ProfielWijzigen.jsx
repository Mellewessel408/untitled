import React from "react";
import './ProfielWijzigen.css';

function ProfielWijzigen(){

    const Wijzigen = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const naam = formData.get('naam');
        const email = fromData.get('email');
        const telefoonnummer = formData.get('telefoonnummer');
        const postcode = formData.get('postcode');
        const huisnummer = formData.get('Huisnummer');
        const wachtwoord = formData.get('wachtwoord');
        const herhaalwachtwoord = formData.get('herhaalwachtwoord');
    }
}
export default ProfielWijzigen;