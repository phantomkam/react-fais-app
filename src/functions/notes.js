import config from '../config'

const axios = require('axios');

export function getNotes() {
    const conf = {
        headers:{
          authorization: sessionStorage.getItem('token'),
        }
    };
    
    return axios.get(`${config.server_url}/api/notes`, conf)
        .then(response => response.data)
        .catch(error => {
            console.error(`Error fetching notes: ${error}`);
        })
}

export function setOneNote(note) {
    return axios(`${config.server_url}/api/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note })
    })
        .then(response => response.data)
}