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

export default function YouTubePlayer({
    videoId,
    setVideoId,
    playlistId,
    setPlaylistId,
    idList,
    setIdList,
}: {
    videoId?: string | null;
    setVideoId: (id: string | null) => void;
    playlistId?: string | null;
    setPlaylistId: (id: string | null) => void;
    idList: string[];
    setIdList: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    const playerRef = useRef<YT.Player | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(10);
    const [hidden, setHidden] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoLength, setVideoLength] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const currentId = useRef<string | null>(null);

    useEffect(() => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            if (!videoId && !playlistId) return;

            const options: YT.PlayerOptions = {
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
                        if (event.data === window.YT.PlayerState.ENDED) {
                            playNextFromQueue();
                        }
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                            setVideoLength(
                                playerRef.current?.getDuration() || 0
                            );
                        }
                    },
                    onError: () => {
                        playNextFromQueue();
                    },
                },
            };

            if (playlistId) {
                currentId.current = playlistId;
                (options.playerVars as any).listType = "playlist";
                (options.playerVars as any).list = playlistId;
                (options.playerVars as any).index = 0;
                playerRef.current = new (window as any).YT.Player(
                    "yt-player",
                    options
                );
            } else if (videoId) {
                currentId.current = videoId;
                options.videoId = videoId;
                playerRef.current = new (window as any).YT.Player(
                    "yt-player",
                    options
                );
            }
        };

        return () => {
            playerRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.stopVideo();
            if (playlistId) {
                currentId.current = playlistId;
                playerRef.current.loadPlaylist({
                    listType: "playlist",
                    list: playlistId,
                });
            } else if (videoId) {
                currentId.current = videoId;
                playerRef.current.loadVideoById(videoId);
            }
            playerRef.current.setVolume(volume);
        }
    }, [videoId, playlistId]);

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

    useEffect(() => {
        if (isSeeking) {
            playerRef.current?.pauseVideo();
        } else {
            playerRef.current?.playVideo();
        }
    }, [isSeeking]);

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

    function playMediaById(id: string) {
        currentId.current = id;
        const videoCache = JSON.parse(
            localStorage.getItem("youtubeVideoCache") || "{}"
        );
        const playlistCache = JSON.parse(
            localStorage.getItem("youtubeVideoCache_playlists") || "{}"
        );

        if (videoCache[id]) {
            setPlaylistId(null);
            setVideoId(id);
        } else if (playlistCache[id]) {
            setVideoId(null);
            setPlaylistId(id);
        } else {
            setPlaylistId(null);
            setVideoId(id);
        }
    }

    function playFromQueue(offset: number) {
        if (!playerRef.current) return;

        const playlist = playerRef.current.getPlaylist();
        const isPlaylist = !!playlist && playlist.length > 0;

        if (isPlaylist) {
            const currentIndex = playerRef.current.getPlaylistIndex();
            const newIndex = currentIndex + offset;
            if (newIndex >= 0 && newIndex < playlist.length) {
                playerRef.current.playVideoAt(newIndex);
            } else if (currentId.current) {
                const idx = idList.indexOf(currentId.current);
                const nextId =
                    idList[(idx + offset + idList.length) % idList.length];
                playMediaById(nextId);
            }
        } else {
            const currentVideoId = playerRef.current.getVideoData().video_id;

            setIdList((prev) => {
                let newList = prev.includes(currentVideoId)
                    ? [...prev]
                    : [...prev, currentVideoId];
                const currentIndex = newList.indexOf(currentVideoId);
                const newIndex =
                    (currentIndex + offset + newList.length) % newList.length;
                playMediaById(newList[newIndex]);
                return newList;
            });
        }
    }

    function playNextFromQueue() {
        playFromQueue(1);
    }

    function playPreviousFromQueue() {
        playFromQueue(-1);
    }

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
                <Button onClick={() => setHidden(!hidden)} title="Show/Hide">
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
                        title="Timeline"
                    />
                    <span>{formatTime(videoLength)}</span>
                    <Button title="Repeat">
                        <i className="fa-solid fa-repeat"></i>
                    </Button>
                </div>
            </div>
            <div className={classes.controls}>
                <Button title="Previous" onClick={playPreviousFromQueue}>
                    <i className="fa-solid fa-backward-step"></i>
                </Button>
                <Button onClick={toggleVideo} title="Start/Pause">
                    {isPlaying ? (
                        <i className="fa-solid fa-pause" />
                    ) : (
                        <i className="fa-solid fa-play"></i>
                    )}
                </Button>
                <Button title="Next" onClick={playNextFromQueue}>
                    <i className="fa-solid fa-forward-step"></i>
                </Button>
                <Button
                    title="Mute/Unmute"
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
                    title="Volume level"
                />
            </div>
        </div>
    );
}
