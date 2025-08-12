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

type MediaType = "video" | "playlist";

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

    async function fetchMediaByIds(
        ids: string[],
        apiKey: string,
        type: MediaType
    ) {
        const URL_PATTERN = "https://www.googleapis.com/youtube/v3/";
        const url =
            type === "video"
                ? `${URL_PATTERN}videos?part=snippet,
                contentDetails,statistics&id=${ids.join(",")}&key=${apiKey}`
                : `${URL_PATTERN}playlists?part=snippet,
                contentDetails&id=${ids.join(",")}&key=${apiKey}`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    useEffect(() => {
        const caches = [
            { key: CACHE_KEY, ref: videosCacheRef },
            { key: CACHE_KEY + "_playlists", ref: playlistsCacheRef },
        ];

        caches.forEach(({ key, ref }) => {
            const savedCache = localStorage.getItem(key);
            if (savedCache) {
                try {
                    ref.current = JSON.parse(savedCache);
                } catch {
                    ref.current = {};
                }
            }
        });
    }, []);

    async function fetchAndCache({
        ids,
        cacheRef,
        cacheKey,
        type,
        parseItem,
    }: {
        ids: string[];
        cacheRef: React.RefObject<Record<string, any>>;
        cacheKey: string;
        type: MediaType;
        parseItem: (item: any) => any;
    }) {
        const now = Date.now();
        const idsToFetch = ids.filter(
            (id) =>
                !cacheRef.current[id] ||
                now - cacheRef.current[id].timestamp > TTL
        );

        if (idsToFetch.length > 0) {
            let data;
            try {
                data = await fetchMediaByIds(idsToFetch, apiKeyFirst, type);
            } catch {
                try {
                    data = await fetchMediaByIds(
                        idsToFetch,
                        apiKeySecond,
                        type
                    );
                } catch {
                    return [];
                }
            }

            data.items.forEach((item: any) => {
                cacheRef.current[item.id] = {
                    data: parseItem(item),
                    timestamp: now,
                };
            });

            localStorage.setItem(cacheKey, JSON.stringify(cacheRef.current));
        }

        return ids.map((id) => cacheRef.current[id]?.data).filter(Boolean);
    }

    useEffect(() => {
        const videoIds = ["M7lc1UVf-VE", "dQw4w9WgXcQ", "kxopViU98Xo"];
        const playlistIds = [
            "PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
            "PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI",
        ];
        async function init() {
            const videosList = await fetchAndCache({
                ids: videoIds,
                cacheRef: videosCacheRef,
                cacheKey: CACHE_KEY,
                type: "video",
                parseItem: (item) => ({
                    id: item.id,
                    title: item.snippet.title,
                    channelTitle: item.snippet.channelTitle,
                    thumbnailUrl: item.snippet.thumbnails.medium.url,
                    duration: formatDuration(item.contentDetails.duration),
                    publishedAt: new Date(
                        item.snippet.publishedAt
                    ).toLocaleDateString(),
                    viewCount: Number(item.statistics.viewCount),
                    likeCount: Number(item.statistics.likeCount),
                }),
            });

            const playlistsList = await fetchAndCache({
                ids: playlistIds,
                cacheRef: playlistsCacheRef,
                cacheKey: CACHE_KEY + "_playlists",
                type: "playlist",
                parseItem: (item) => ({
                    id: item.id,
                    title: item.snippet.title,
                    channelTitle: item.snippet.channelTitle,
                    thumbnailUrl: item.snippet.thumbnails.medium.url,
                    publishedAt: new Date(
                        item.snippet.publishedAt
                    ).toLocaleDateString(),
                    itemCount: item.contentDetails.itemCount,
                }),
            });

            setVideos(videosList ?? []);
            setPlaylists(playlistsList ?? []);
        }

        init();
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
