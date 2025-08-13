import generalClasses from "../_GeneralSCSSModules/_Playlist-Music.module.scss";
import type { VideoProps } from "../MusicVideoList/MusicVideoList";

export default function MusicVideoItem({
    id,
    title,
    channelTitle,
    thumbnailUrl,
    duration,
    publishedAt,
    viewCount,
    likeCount,
    onPlayVideo,
}: VideoProps) {
    function handleClick() {
        if (id.trim() !== "") {
            onPlayVideo(id.trim());
        }
    }

    return (
        <div className={generalClasses.musicVideoItem}>
            <div className={generalClasses.thumbnailContainer}>
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className={generalClasses.thumbnail}
                />
                {duration && (
                    <span className={generalClasses.duration}>{duration}</span>
                )}
            </div>
            <div className={generalClasses.info}>
                <h3 onClick={handleClick} className={generalClasses.title}>
                    {title}
                </h3>
                <p className={generalClasses.channel}>{channelTitle}</p>
                <div className={generalClasses.meta}>
                    <div>
                        <span>Published: {publishedAt}</span>
                        {viewCount !== undefined && (
                            <span>Views: {viewCount.toLocaleString()}</span>
                        )}
                        {likeCount !== undefined && (
                            <span>Likes: {likeCount.toLocaleString()}</span>
                        )}
                    </div>
                    <div>
                        <span className={generalClasses.type}>Video</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
