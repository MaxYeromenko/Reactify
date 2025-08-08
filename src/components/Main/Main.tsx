import classes from "./_Main.module.scss";
import getSpotifyToken from "../../ts/GetSpotifyAccessToken";
// import { createMusicFetcher } from "../../ts/musicApi";

export default function Main() {
    async function example() {
        const token = await getSpotifyToken();
        const res = await fetch(
            "https://api.spotify.com/v1/search?q=Imagine%20Dragons&type=track&limit=5",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();

        console.log(token, data);
    }

    example();

    return (
        <main className={classes.main}>
            <param></param>
        </main>
    );
}
