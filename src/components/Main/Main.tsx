import classes from "./_Main.module.scss";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";

export default function Main() {
    return (
        <main className={classes.main}>
            <YouTubePlayer></YouTubePlayer>
        </main>
    );
}
