import classes from "./_Main.module.scss";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";

export default function Main({ videoId }: { videoId: string }) {
    return (
        <main className={classes.main}>
            <YouTubePlayer videoId={videoId}></YouTubePlayer>
        </main>
    );
}
