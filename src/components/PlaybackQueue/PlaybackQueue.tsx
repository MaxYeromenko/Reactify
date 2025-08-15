import PlaybackQueueItem from "../PlaybackQueueItem/PlaybackQueueItem";
import classes from "./_PlaybackQueue.module.scss";

import type { HTMLAttributes } from "react";

type PlaybackQueueProps = HTMLAttributes<HTMLElement> & {
    idList: string[];
    onPlayVideo: (query: string) => void;
    onPlayPlaylist: (query: string) => void;
    setIdList: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function PlaybackQueue({
    idList,
    onPlayVideo,
    onPlayPlaylist,
    setIdList,
}: PlaybackQueueProps) {
    return (
        <div className={classes.playbackQueue}>
            {idList.map((item) => (
                <PlaybackQueueItem
                    key={item}
                    itemId={item}
                    onPlayVideo={onPlayVideo}
                    onPlayPlaylist={onPlayPlaylist}
                    setIdList={setIdList}
                />
            ))}
        </div>
    );
}
