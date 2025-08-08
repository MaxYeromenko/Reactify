const clientId = '8af7e6a0f01d451e99384343267c7f5d';
const clientSecret = '6c10d4383c994b43a9b8d7994f8c63b8';

const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
})
    .then(res => res.json())
    .then(data => {
        console.log('Access Token:', data.access_token);
    })
    .catch(console.error);
