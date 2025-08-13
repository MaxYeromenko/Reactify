import classes from "./_Main.module.scss";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";
import MusicVideoList from "../MusicVideoList/MusicVideoList";

type MainProps = {
    onSearch: (query: string) => void;
    videoId: string;
    region: string;
    language: string;
};

export default function Main({
    videoId,
    region,
    language,
    onSearch,
}: MainProps) {
    return (
        <main className={classes.main}>
            <YouTubePlayer videoId={videoId} />
            <MusicVideoList
                onSearch={onSearch}
                region={region}
                language={language}
            />
        </main>
    );
}
