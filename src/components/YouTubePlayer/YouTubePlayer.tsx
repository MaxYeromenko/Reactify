import Button from "../Button/Button";
import InputRange from "../InputRange/InputRange";
import classes from "./_YouTubePlayer.module.scss";
import { useState, useEffect, useRef } from "react";

declare global {
    interface Window {
        YT: typeof YT;
        onYouTubeIframeAPIReady: () => void;
    }
}

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hh = h > 0 ? String(h).padStart(2, "0") + ":" : "";
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");

    return hh + mm + ":" + ss;
}

export default function YouTubePlayer({ videoId }: { videoId: string }) {
    const playerRef = useRef<YT.Player | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(10);
    const [hidden, setHidden] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoLength, setVideoLength] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player("yt-player", {
                videoId,
                playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    disablekb: 1,
                    autoplay: 0,
                },
                events: {
                    onReady: () => {
                        if (playerRef.current) {
                            playerRef.current.setVolume(volume);
                            setVideoLength(playerRef.current.getDuration());
                        }
                    },
                    onStateChange: (event: any) => {
                        const v = event.data === window.YT.PlayerState.PLAYING;
                        setIsPlaying(v);
                        if (v) {
                            setVideoLength(
                                playerRef.current?.getDuration() || 0
                            );
                        }
                    },
                },
            });
        };

        return () => {
            playerRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.loadVideoById(videoId);
            playerRef.current.setVolume(volume);
        }
    }, [videoId]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (playerRef.current && !isSeeking) {
            setVideoLength(playerRef.current.getDuration());

            intervalId = setInterval(() => {
                const time = playerRef.current?.getCurrentTime() || 0;
                setCurrentTime(time);
            }, 500);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isPlaying, isSeeking]);

    function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentTime(Number(e.target.value));
        setIsSeeking(true);
    }

    function handleSeekCommit() {
        if (playerRef.current) {
            playerRef.current.seekTo(currentTime, true);
        }
        setIsSeeking(false);
    }

    function toggleVideo() {
        if (isPlaying) playerRef.current?.pauseVideo();
        else playerRef.current?.playVideo();
        setIsPlaying(!isPlaying);
    }

    const changeVolume = (v: number) => {
        setVolume(v);
        playerRef.current?.setVolume(v);
    };

    return (
        <div
            className={
                classes.container +
                (hidden ? " " + classes.resetAspectRatio : "")
            }
        >
            <div className={classes.playerContainer}>
                <div
                    className={
                        classes.iframeContainer +
                        (hidden ? " " + classes.hidden : "")
                    }
                >
                    <div id="yt-player" className={classes.iframe}></div>
                </div>
                <Button onClick={() => setHidden(!hidden)}>
                    {hidden ? (
                        <i className="fa-solid fa-chevron-up" />
                    ) : (
                        <i className="fa-solid fa-chevron-down" />
                    )}
                </Button>
                <div className={classes.progressBarContainer}>
                    <span>{formatTime(currentTime)}</span>
                    <InputRange
                        type="range"
                        min={0}
                        max={videoLength}
                        value={currentTime}
                        onChange={handleSeekChange}
                        onPointerUp={handleSeekCommit}
                        onTouchEnd={handleSeekCommit}
                    />
                    <span>{formatTime(videoLength)}</span>
                </div>
            </div>
            <div className={classes.controls}>
                <Button onClick={toggleVideo}>
                    {isPlaying ? (
                        <i className="fa-solid fa-pause" />
                    ) : (
                        <i className="fa-solid fa-play"></i>
                    )}
                </Button>
                <Button
                    onClick={() => {
                        changeVolume(volume === 0 ? 10 : 0);
                    }}
                >
                    {volume === 0 ? (
                        <i className="fa-solid fa-volume-xmark"></i>
                    ) : volume <= 50 ? (
                        <i className="fa-solid fa-volume-low"></i>
                    ) : (
                        <i className="fa-solid fa-volume-high"></i>
                    )}
                </Button>
                <InputRange
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                />
            </div>
        </div>
    );
}
