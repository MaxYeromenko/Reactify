import classes from "./_Main.module.scss";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";
import MusicVideoList from "../MusicVideoList/MusicVideoList";

type MainProps = {
    videoId: string;
    region: string;
    language: string;
};

export default function Main({ videoId, region, language }: MainProps) {
    return (
        <main className={classes.main}>
            <YouTubePlayer videoId={videoId} />
            <MusicVideoList region={region} language={language} />
        </main>
    );
}
