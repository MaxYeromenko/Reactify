import classes from "./_Main.module.scss";
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
    const token =
        "BQDLllR6MFQyzNtnn4rXQ9ovXXO7qQP7Q7MCf1Zwjs7qEsOmoKVofjIQwmTRTgvF1CgeG6BdejRTtVpmx8o0UiyMXFilQdM4ex7CoU5fjG8dLb8Lxr81YweJrCAkXPQ18E_gNT9GAf7pcE2lqZKgKbcW2LoDMu6L6oUkdGCGt5MGTddZIywmKQ1Av_LTboWOC6m26aPmKbHbvWmzcksQFcv0d8Rslh26u2iHpYvow";

    fetch(
        "https://api.spotify.com/v1/search?q=Imagine%20Dragons&type=track&limit=5",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((data) => console.log(data));

    return (
        <main className={classes.main}>
            <param></param>
        </main>
    );
}
