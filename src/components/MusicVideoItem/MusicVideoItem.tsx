import generalClasses from "../_GeneralSCSSModules/_Playlist-Music.module.scss";
import Button from "../Button/Button";
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
    setIdList,
}: VideoProps) {
    function addToQueue() {
        setIdList((prev) => [...prev.filter((item) => item !== id), id]);
    }

    return (
        <div className={generalClasses.musicVideoItem}>
            <div
                onClick={() => onPlayVideo(id)}
                className={generalClasses.thumbnailContainer}
            >
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
                <h3
                    onClick={() => onPlayVideo(id)}
                    className={generalClasses.title}
                >
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
                        <Button onClick={addToQueue}>
                            Add <i className="fa-solid fa-bars-staggered" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
