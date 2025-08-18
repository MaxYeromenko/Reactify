import generalClasses from "../_GeneralSCSSModules/_Playlist-Music.module.scss";
import Button from "../Button/Button";
import { type MediaType } from "../MusicVideoList/MusicVideoList";
import type { MessageType } from "../ToastMessage/ToastMessage";

export default function PlaybackQueueItem({
    itemId,
    onPlayVideo,
    onPlayPlaylist,
    setIdList,
    setMessage,
    setMessageType,
}: {
    itemId: string;
    onPlayVideo: (query: string) => void;
    onPlayPlaylist: (query: string) => void;
    setIdList: React.Dispatch<React.SetStateAction<string[]>>;
    setMessage: (message: string) => void;
    setMessageType: (messageType: MessageType) => void;
}) {
    let mediaType: MediaType;

    function getItemData(id: string) {
        const videoCache = localStorage.getItem("youtubeVideoCache");
        const playlistCache = localStorage.getItem(
            "youtubeVideoCache_playlists"
        );

        let parsedVideoCache: Record<string, any> = {};
        let parsedPlaylistCache: Record<string, any> = {};

        try {
            if (videoCache) parsedVideoCache = JSON.parse(videoCache);
            if (playlistCache) parsedPlaylistCache = JSON.parse(playlistCache);
        } catch {}

        if (parsedVideoCache[id]) {
            mediaType = "video";
            return parsedVideoCache[id];
        } else if (parsedPlaylistCache[id]) {
            mediaType = "playlist";
            return parsedPlaylistCache[id];
        }

        return null;
    }

    const data = getItemData(itemId)?.data;

    if (!data) {
        removeFromQueue();
        return <div className={generalClasses.playbackQueueItem}>No data.</div>;
    }

    function removeFromQueue() {
        let wasRemoved = false;

        setIdList((prev) => {
            if (prev.includes(itemId)) {
                wasRemoved = true;
                return prev.filter((id) => id !== itemId);
            }
            return prev;
        });

        if (wasRemoved) {
            setMessage("Removed from playback queue.");
            setMessageType("info");
        } else {
            setMessage("Video not found in queue!");
            setMessageType("error");
        }
    }

    return (
        <div className={generalClasses.playbackQueueItem}>
            <div
                onClick={() => {
                    if (mediaType === "video") onPlayVideo(itemId);
                    else if (mediaType === "playlist") onPlayPlaylist(itemId);
                }}
                className={generalClasses.thumbnailContainer}
            >
                <img
                    src={data.thumbnailUrl}
                    alt={data.title}
                    className={generalClasses.thumbnail}
                />
                {data.duration && (
                    <span className={generalClasses.duration}>
                        {data.duration}
                    </span>
                )}
                {data.itemCount && (
                    <span className={generalClasses.itemCount}>
                        {data.itemCount} videos
                    </span>
                )}
            </div>
            <div className={generalClasses.info}>
                <h3
                    onClick={() => {
                        if (mediaType === "video") onPlayVideo(itemId);
                        else if (mediaType === "playlist")
                            onPlayPlaylist(itemId);
                    }}
                    className={generalClasses.title}
                >
                    {data.title}
                </h3>
                <p className={generalClasses.channel}>{data.channelTitle}</p>
                <div className={generalClasses.meta}>
                    <div>
                        <Button onClick={removeFromQueue}>
                            Remove <i className="fa-solid fa-bars-staggered" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
