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
    setMessage,
    setMessageType,
}: VideoProps) {
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
            setMessage("The video is already in the playback queue.");
            setMessageType("warning");
        } else {
            setMessage("The video has been added to the playback queue.");
            setMessageType("info");
        }
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
