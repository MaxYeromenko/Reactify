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
}: PlaylistsProps) {
    function addToQueue() {
        setIdList((prev) => [...prev.filter((item) => item !== id), id]);
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
