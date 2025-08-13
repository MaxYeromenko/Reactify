import generalClasses from "../_GeneralSCSSModules/_Playlist-Music.module.scss";
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
            <div className={generalClasses.thumbnailContainer}>
                <img
                    onClick={() => onPlayPlaylist(id)}
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
                        <span className={generalClasses.type}>Playlist</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
