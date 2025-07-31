// services/emailservice.js
import axios from 'axios';
export async function envoyerEmailAlerte(idveh, email) {
  return axios.post('/api/send-alert-email/', {
    idveh: idveh,
    email: email
  });
}
