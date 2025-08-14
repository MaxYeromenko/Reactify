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
}: PlaylistsProps) {
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
                        <Button>
                            Add <i className="fa-solid fa-bars-staggered" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
