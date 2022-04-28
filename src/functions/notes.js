const axios = require('axios');

export function getNotes() {
    return axios.get('https://majedra.tk/api/notes')
        .then(response => response.data)
        .catch(error => {
            console.error(`Error fetching notes: ${error}`);
        })
}

export function setOneNote(note) {
    return axios('https://majedra.tk/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note })
    })
        .then(response => response.data)
}