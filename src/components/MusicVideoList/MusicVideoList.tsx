import classes from "./_MusicVideoList.module.scss";
import { useEffect, useState, useRef } from "react";
import MusicVideoItem from "../MusicVideoItem/MusicVideoItem";
import PlaylistItem from "../PlaylistItem/PlaylistItem";

export type VideoProps = {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    duration?: string;
    publishedAt: string;
    viewCount?: number;
    likeCount?: number;
};

type CachedVideo = {
    data: VideoProps;
    timestamp: number;
};

export type PlaylistsProps = {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    itemCount?: number;
    publishedAt: string;
};

type CachedPlaylist = {
    data: PlaylistsProps;
    timestamp: number;
};

const TTL = 6 * 60 * 60 * 1000;

function formatDuration(isoDuration: string) {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match?.[1] ? parseInt(match[1]) : 0;
    const minutes = match?.[2] ? parseInt(match[2]) : 0;
    const seconds = match?.[3] ? parseInt(match[3]) : 0;

    return [
        hours > 0 ? String(hours).padStart(2, "0") : null,
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
    ]
        .filter(Boolean)
        .join(":");
}

export default function MusicVideoList() {
    const CACHE_KEY = "youtubeVideoCache";

    const [videos, setVideos] = useState<VideoProps[]>([]);
    const videosCacheRef = useRef<Record<string, CachedVideo>>({});

    const [playlists, setPlaylists] = useState<PlaylistsProps[]>([]);
    const playlistsCacheRef = useRef<Record<string, CachedPlaylist>>({});

    const apiKeyFirst = import.meta.env.VITE_YOUTUBE_API_KEY;
    const apiKeySecond = import.meta.env.VITE_YOUTUBE_API_KEY_SECOND;

    async function fetchVideosByIds(ids: string[], apiKey: string) {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${ids.join(
            ","
        )}&key=${apiKey}`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    useEffect(() => {
        const savedCache = localStorage.getItem(CACHE_KEY);
        if (savedCache) {
            try {
                videosCacheRef.current = JSON.parse(savedCache);
            } catch {
                videosCacheRef.current = {};
            }
        }
    }, []);

    useEffect(() => {
        async function fetchVideos() {
            const ids = ["M7lc1UVf-VE", "dQw4w9WgXcQ", "kxopViU98Xo"];
            const now = Date.now();
            const idsToFetch = ids.filter(
                (id) =>
                    !videosCacheRef.current[id] ||
                    now - videosCacheRef.current[id].timestamp > TTL
            );

            if (idsToFetch.length > 0) {
                let data;
                try {
                    data = await fetchVideosByIds(idsToFetch, apiKeyFirst);
                } catch {
                    try {
                        data = await fetchVideosByIds(idsToFetch, apiKeySecond);
                    } catch {
                        return;
                    }
                }

                data.items.forEach((item: any) => {
                    videosCacheRef.current[item.id] = {
                        data: {
                            id: item.id,
                            title: item.snippet.title,
                            channelTitle: item.snippet.channelTitle,
                            thumbnailUrl: item.snippet.thumbnails.medium.url,
                            duration: formatDuration(
                                item.contentDetails.duration
                            ),
                            publishedAt: new Date(
                                item.snippet.publishedAt
                            ).toLocaleDateString(),
                            viewCount: Number(item.statistics.viewCount),
                            likeCount: Number(item.statistics.likeCount),
                        },
                        timestamp: now,
                    };
                });
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify(videosCacheRef.current)
                );
            }

            setVideos(
                ids
                    .map((id) => videosCacheRef.current[id]?.data)
                    .filter(Boolean)
            );
        }

        fetchVideos();
    }, []);

    async function fetchPlaylistsByIds(ids: string[], apiKey: string) {
        const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${ids.join(
            ","
        )}&key=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    useEffect(() => {
        async function fetchPlaylists() {
            const ids = [
                "PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
                "PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI",
            ];
            const now = Date.now();

            const idsToFetch = ids.filter(
                (id) =>
                    !playlistsCacheRef.current[id] ||
                    now - playlistsCacheRef.current[id].timestamp > TTL
            );

            if (idsToFetch.length > 0) {
                let data;
                try {
                    data = await fetchPlaylistsByIds(idsToFetch, apiKeyFirst);
                } catch {
                    try {
                        data = await fetchPlaylistsByIds(
                            idsToFetch,
                            apiKeySecond
                        );
                    } catch {
                        return;
                    }
                }

                data.items.forEach((item: any) => {
                    playlistsCacheRef.current[item.id] = {
                        data: {
                            id: item.id,
                            title: item.snippet.title,
                            channelTitle: item.snippet.channelTitle,
                            thumbnailUrl: item.snippet.thumbnails.medium.url,
                            publishedAt: new Date(
                                item.snippet.publishedAt
                            ).toLocaleDateString(),
                            itemCount: item.contentDetails.itemCount,
                        },
                        timestamp: now,
                    };
                });

                localStorage.setItem(
                    CACHE_KEY + "_playlists",
                    JSON.stringify(playlistsCacheRef.current)
                );
            }

            setPlaylists(
                ids
                    .map((id) => playlistsCacheRef.current[id]?.data)
                    .filter(Boolean)
            );
        }

        fetchPlaylists();
    }, []);

    useEffect(() => {
        const savedCache = localStorage.getItem(CACHE_KEY + "_playlists");
        if (savedCache) {
            try {
                playlistsCacheRef.current = JSON.parse(savedCache);
            } catch {
                playlistsCacheRef.current = {};
            }
        }
    }, []);

    return (
        <>
            <div className={classes.divider}>
                <h1>Videos</h1>
            </div>
            <div className={classes.musicVideoList}>
                {videos.map((video) => (
                    <MusicVideoItem key={video.id} {...video} />
                ))}
            </div>
            <div className={classes.divider}>
                <h1>Playlists</h1>
            </div>
            <div className={classes.playlistList}>
                {playlists.map((playlist) => (
                    <PlaylistItem key={playlist.id} {...playlist} />
                ))}
            </div>
        </>
    );
}
