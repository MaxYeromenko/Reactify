import generalClasses from "../_GeneralSCSSModules/_Playlist-Music.module.scss";
import type { PlaylistsProps } from "../MusicVideoList/MusicVideoList";

export default function MusicVideoItem({
    title,
    channelTitle,
    thumbnailUrl,
    itemCount,
    publishedAt,
}: PlaylistsProps) {
    return (
        <div className={generalClasses.playlistItem}>
            <div className={generalClasses.thumbnailContainer}>
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className={generalClasses.thumbnail}
                />
                {itemCount && (
                    <span className={generalClasses.itemCount}>{itemCount} videos</span>
                )}
            </div>
            <div className={generalClasses.info}>
                <h3 className={generalClasses.title}>{title}</h3>
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
