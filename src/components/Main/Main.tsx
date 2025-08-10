import classes from "./_Main.module.scss";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";
import MusicVideoList from "../MusicVideoList/MusicVideoList";

export default function Main({ videoId }: { videoId: string }) {
    return (
        <main className={classes.main}>
            <YouTubePlayer videoId={videoId} />
            <MusicVideoList />
        </main>
    );
}
