import Button from "../Button/Button";
import PlaybackQueueItem from "../PlaybackQueueItem/PlaybackQueueItem";
import type { MessageType } from "../ToastMessage/ToastMessage";
import classes from "./_PlaybackQueue.module.scss";

import type { HTMLAttributes } from "react";

type PlaybackQueueProps = HTMLAttributes<HTMLElement> & {
    idList: string[];
    setIdList: React.Dispatch<React.SetStateAction<string[]>>;
    onPlayVideo: (query: string) => void;
    onPlayPlaylist: (query: string) => void;
    setMessage: (message: string) => void;
    setMessageType: (messageType: MessageType) => void;
};

export default function PlaybackQueue({
    idList,
    setIdList,
    onPlayVideo,
    onPlayPlaylist,
    setMessage,
    setMessageType,
}: PlaybackQueueProps) {
    function clearPlaybackQueue() {
        let wasCleared = false;

        if (idList.length > 0) {
            wasCleared = true;
            setIdList([]);
        }

        if (wasCleared) {
            setMessage("The playback queue has been cleared.");
            setMessageType("info");
        } else {
            setMessage("The playback queue is already empty.");
            setMessageType("warning");
        }
    }

    return (
        <div className={classes.playbackQueue}>
            <Button onClick={clearPlaybackQueue} disabled={idList.length === 0}>
                Clear playback queue
            </Button>
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
