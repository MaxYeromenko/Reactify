export default async function getSpotifyToken() {
    const res = await fetch("/src/api/spotify-token");
    const data = await res.json();
    return data.access_token;
}
