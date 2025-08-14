import classes from "./_MusicVideoList.module.scss";
import { useEffect, useState, useRef } from "react";
import MusicVideoItem from "../MusicVideoItem/MusicVideoItem";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import Button from "../Button/Button";

type MusicVideoListProps = {
    onPlayVideo: (query: string) => void;
    onPlayPlaylist: (query: string) => void;
    region: string;
    language: string;
    query: string;
    search: boolean;
    setSearch: (search: boolean) => void;
    idList: string[];
    setIdList: (idList: string[]) => void;
};

export type VideoProps = {
    id: string;
    title: string;
    channelTitle: string;
    thumbnailUrl: string;
    duration?: string;
    publishedAt: string;
    viewCount?: number;
    likeCount?: number;
    onPlayVideo: (query: string) => void;
    idList: string[];
    setIdList: (idList: string[]) => void;
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
    onPlayPlaylist: (query: string) => void;
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

export default function MusicVideoList({
    region,
    language,
    onPlayVideo,
    onPlayPlaylist,
    query,
    search,
    setSearch,
    idList,
    setIdList,
}: MusicVideoListProps) {
    const CACHE_KEY = "youtubeVideoCache";
    const CACHE_KEY_PLAYLIST = CACHE_KEY + "_playlists";
    const CACHE_KEY_SEARCH = "youtubeSearchCache";
    const MEDIA_COUNT = 16;

    const [videos, setVideos] = useState<VideoProps[]>([]);
    const videosCacheRef = useRef<Record<string, CachedVideo>>({});

    const [playlists, setPlaylists] = useState<PlaylistsProps[]>([]);
    const playlistsCacheRef = useRef<Record<string, CachedPlaylist>>({});

    const apiKeyFirst = import.meta.env.VITE_YOUTUBE_API_KEY;
    const apiKeySecond = import.meta.env.VITE_YOUTUBE_API_KEY_SECOND;

    async function fetchWithFallback(urlFirst: string, urlSecond: string) {
        for (const url of [urlFirst, urlSecond]) {
            try {
                const res = await fetch(url);
                if (res.ok) return await res.json();
            } catch {}
        }
        return null;
    }

    async function fetchMediaByIds(ids: string[], type: MediaType) {
        const URL_PATTERN = "https://www.googleapis.com/youtube/v3/";
        const makeUrl = (apiKey: string) =>
            type === "video"
                ? `${URL_PATTERN}videos?part=snippet,
                contentDetails,statistics&id=${ids.join(",")}&key=${apiKey}`
                : `${URL_PATTERN}playlists?part=snippet,
                contentDetails&id=${ids.join(",")}&key=${apiKey}`;
        const data = await fetchWithFallback(
            makeUrl(apiKeyFirst),
            makeUrl(apiKeySecond)
        );
        return data ?? { items: [] };
    }

    async function fetchMediaIds(vCount: number, pCount: number) {
        const now = Date.now();

        let searchCache: Record<string, any> = {};
        try {
            searchCache = JSON.parse(
                localStorage.getItem(CACHE_KEY_SEARCH) || "{}"
            );
        } catch {
            searchCache = {};
        }

        const cacheKeyBase = `${region}_${
            search ? query : language.split("_")[1]
        }`.toLowerCase();

        const getIds = async (type: MediaType, count: number) => {
            const cacheKey = `${cacheKeyBase}_${type}`;

            if (
                searchCache[cacheKey] &&
                now - searchCache[cacheKey].timestamp < TTL
            ) {
                return searchCache[cacheKey].ids;
            }

            const makeUrl = (apiKey: string) =>
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=${type}&maxResults=${count}&regionCode=${region}&relevanceLanguage=${
                    language.split("_")[0]
                }&q=${
                    search
                        ? query
                        : language.split("_")[1] +
                          Math.random().toString(36).slice(2, 3)
                }&key=${apiKey}`.replace("%20", "");

            const data = await fetchWithFallback(
                makeUrl(apiKeyFirst),
                makeUrl(apiKeySecond)
            );
            if (!data || !data.items) return [];

            let ids =
                type === "video"
                    ? data.items
                          .map((item: any) => item.id.videoId)
                          .filter(Boolean)
                    : data.items
                          .map((item: any) => item.id.playlistId)
                          .filter(Boolean);

            if (type === "video" && ids.length) {
                const details = await fetchMediaByIds(ids, "video");
                ids = details.items
                    .filter((item: any) => {
                        const match =
                            item.contentDetails.duration.match(
                                /PT(\d+M)?(\d+S)?/
                            );
                        const minutes = match?.[1] ? parseInt(match[1]) : 0;
                        const seconds = match?.[2] ? parseInt(match[2]) : 0;
                        return (
                            minutes > 1 ||
                            (minutes === 1 && seconds > 0) ||
                            seconds > 60
                        );
                    })
                    .map((item: any) => item.id);
            }

            searchCache[cacheKey] = { ids, timestamp: now };
            localStorage.setItem(CACHE_KEY_SEARCH, JSON.stringify(searchCache));
            return ids;
        };

        const videoIds = await getIds("video", vCount);
        const playlistIds = await getIds("playlist", pCount);

        return { videoIds, playlistIds };
    }

    useEffect(() => {
        const caches = [
            { key: CACHE_KEY, ref: videosCacheRef },
            { key: CACHE_KEY_PLAYLIST, ref: playlistsCacheRef },
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

        if (!Object.keys(cacheRef.current).length) {
            try {
                const saved = localStorage.getItem(cacheKey);
                if (saved) cacheRef.current = JSON.parse(saved);
            } catch {}
        }

        const idsToFetch = ids.filter(
            (id) =>
                !cacheRef.current[id] ||
                now - cacheRef.current[id].timestamp > TTL
        );

        if (idsToFetch.length > 0) {
            const data = await fetchMediaByIds(idsToFetch, type);
            data.items.forEach((item: any) => {
                cacheRef.current[item.id] = {
                    data: parseItem(item),
                    timestamp: now,
                };
            });
        }

        localStorage.setItem(cacheKey, JSON.stringify(cacheRef.current));

        return ids.map((id) => cacheRef.current[id]?.data).filter(Boolean);
    }

    useEffect(() => {
        async function init() {
            const { videoIds, playlistIds } = await fetchMediaIds(
                Math.ceil(MEDIA_COUNT / 2),
                Math.floor(MEDIA_COUNT / 2)
            );

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
                cacheKey: CACHE_KEY_PLAYLIST,
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
        if (search) {
            init();
            setSearch(false);
        } else if (!search && query.trim() === "") {
            init();
        }
    }, [region, search]);

    function inDevelopment() {
        alert("Functionality is under development.");
    }

    return (
        <>
            <div className={classes.divider}>
                <h1>Videos</h1>
            </div>
            <div className={classes.buttonContainer}>
                <Button onClick={inDevelopment}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </Button>
                <span>Page: 1</span>
                <Button onClick={inDevelopment}>
                    <i className="fa-solid fa-arrow-right-long"></i>
                </Button>
            </div>
            <div className={classes.musicVideoList}>
                {videos.map((video) => (
                    <MusicVideoItem
                        key={video.id}
                        {...video}
                        onPlayVideo={onPlayVideo}
                        idList={idList}
                        setIdList={setIdList}
                    />
                ))}
            </div>

            <div className={classes.divider}>
                <h1>Playlists</h1>
            </div>
            <div className={classes.buttonContainer}>
                <Button onClick={inDevelopment}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </Button>
                <span>Page: 1</span>
                <Button onClick={inDevelopment}>
                    <i className="fa-solid fa-arrow-right-long"></i>
                </Button>
            </div>
            <div className={classes.playlistList}>
                {playlists.map((playlist) => (
                    <PlaylistItem
                        key={playlist.id}
                        {...playlist}
                        onPlayPlaylist={onPlayPlaylist}
                    />
                ))}
            </div>
        </>
    );
}
