import generalClasses from "../_GeneralSCSSModules/_Playlist-Music.module.scss";
import Button from "../Button/Button";
import type { PlaylistsProps } from "../MusicVideoList/MusicVideoList";

export default function MusicVideoItem({
    id,
    title,
    channelTitle,
    thumbnailUrl,
    itemCount,
    publishedAt,
    onPlayPlaylist,
    setIdList,
    setMessage,
    setMessageType,
}: PlaylistsProps) {
    function addToQueue() {
        let isDuplicate = false;

        setIdList((prev) => {
            if (prev.includes(id)) {
                isDuplicate = true;
                return prev;
            }
            return [...prev, id];
        });

        if (isDuplicate) {
            setMessage("The playlist is already in the playback queue.");
            setMessageType("warning");
        } else {
            setMessage("The playlist has been added to the playback queue.");
            setMessageType("info");
        }
    }

    return (
        <div className={generalClasses.playlistItem}>
            <div
                onClick={() => onPlayPlaylist(id)}
                className={generalClasses.thumbnailContainer}
            >
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className={generalClasses.thumbnail}
                />
                {itemCount && (
                    <span className={generalClasses.itemCount}>
                        {itemCount} videos
                    </span>
                )}
            </div>
            <div className={generalClasses.info}>
                <h3
                    onClick={() => onPlayPlaylist(id)}
                    className={generalClasses.title}
                >
                    {title}
                </h3>
                <p className={generalClasses.channel}>{channelTitle}</p>
                <div className={generalClasses.meta}>
                    <div>
                        <span>Published: {publishedAt}</span>
                    </div>
                    <div>
                        <Button onClick={addToQueue}>
                            Add <i className="fa-solid fa-bars-staggered" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
