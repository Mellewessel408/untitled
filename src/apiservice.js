// apiService.js
import axios from 'axios';

// Functie die een POST-aanroep doet naar de backend
export const postData = async (data) => {
    try {
        const response = await axios.post('http://localhost:5173/api/registreer', data);
        return response; // Hier kun je de server respons verwerken
    } catch (error) {
        console.error('Fout bij het versturen van data:', error);
        throw error; // Error doorgeven voor verdere verwerking
    }
};
