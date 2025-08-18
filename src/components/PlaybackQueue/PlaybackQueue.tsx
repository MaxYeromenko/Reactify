import PlaybackQueueItem from "../PlaybackQueueItem/PlaybackQueueItem";
import type { MessageType } from "../ToastMessage/ToastMessage";
import classes from "./_PlaybackQueue.module.scss";

import type { HTMLAttributes } from "react";

type PlaybackQueueProps = HTMLAttributes<HTMLElement> & {
    idList: string[];
    onPlayVideo: (query: string) => void;
    onPlayPlaylist: (query: string) => void;
    setIdList: React.Dispatch<React.SetStateAction<string[]>>;
    setMessage: (message: string) => void;
    setMessageType: (messageType: MessageType) => void;
};

export default function PlaybackQueue({
    idList,
    onPlayVideo,
    onPlayPlaylist,
    setIdList,
    setMessage,
    setMessageType,
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
                    setMessage={setMessage}
                    setMessageType={setMessageType}
                />
            ))}
        </div>
    );
}
