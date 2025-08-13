import classes from "./_Main.module.scss";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";
import MusicVideoList from "../MusicVideoList/MusicVideoList";

type MainProps = {
    onPlayVideo: (query: string) => void;
    onPlayPlaylist: (id: string) => void;
    videoId: string | null;
    playlistId: string | null;
    region: string;
    language: string;
    query: string;
    search: boolean;
};

export default function Main({
    videoId,
    playlistId,
    region,
    language,
    onPlayVideo,
    onPlayPlaylist,
    query,
    search,
}: MainProps) {
    return (
        <main className={classes.main}>
            <YouTubePlayer
                videoId={videoId ?? undefined}
                playlistId={playlistId ?? undefined}
            />
            <MusicVideoList
                onPlayVideo={onPlayVideo}
                onPlayPlaylist={onPlayPlaylist}
                region={region}
                language={language}
                query={query}
                search={search}
            />
        </main>
    );
}
