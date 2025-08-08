import classes from "./_Main.module.scss";
import getSpotifyToken from "../../ts/GetSpotifyAccessToken";
// import { createMusicFetcher } from "../../ts/musicApi";

export default function Main() {
    // const searchDeezer = createMusicFetcher("deezer");
    // const searchJamendo = createMusicFetcher("jamendo", 1);

    // (async () => {
    //     const d = await searchDeezer("Imagine Dragons");
    //     console.log("Deezer:", d);

    //     const j = await searchJamendo("Imagine Dragons");
    //     console.log("Jamendo:", j);
    // })();
    // const token = fetch("/api/spotify-token");
    // fetch(
    //     "https://api.spotify.com/v1/search?q=Imagine%20Dragons&type=track&limit=5",
    //     {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     }
    // )
    //     .then((res) => res.json())
    //     .then((data) => console.log(data));
    async function example() {
        const token = await getSpotifyToken();
        console.log(token);
    }

    example();

    return (
        <main className={classes.main}>
            <param></param>
        </main>
    );
}
