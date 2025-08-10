import classes from "./_MusicVideoItem.module.scss";
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
}: VideoProps) {
    return (
        <div className={classes.musicVideoItem}>
            <div className={classes.thumbnailContainer}>
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className={classes.thumbnail}
                />
                {duration && (
                    <span className={classes.duration}>{duration}</span>
                )}
            </div>
            <div className={classes.info}>
                <h3 className={classes.title}>{title}</h3>
                <p className={classes.channel}>{channelTitle}</p>
                <div className={classes.meta}>
                    <span>Published: {publishedAt}</span>
                    {viewCount !== undefined && (
                        <span>Views: {viewCount.toLocaleString()}</span>
                    )}
                    {likeCount !== undefined && (
                        <span>Likes: {likeCount.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
