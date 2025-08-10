import classes from "./_MusicVideoList.module.scss";
import { useEffect, useState, useRef } from "react";
import MusicVideoItem from "../MusicVideoItem/MusicVideoItem";

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
    const cacheRef = useRef<Record<string, CachedVideo>>({});

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
                cacheRef.current = JSON.parse(savedCache);
            } catch {
                cacheRef.current = {};
            }
        }
    }, []);

    useEffect(() => {
        async function fetchVideos() {
            const ids = ["M7lc1UVf-VE", "dQw4w9WgXcQ", "kxopViU98Xo"];
            const now = Date.now();
            const idsToFetch = ids.filter(
                (id) =>
                    !cacheRef.current[id] ||
                    now - cacheRef.current[id].timestamp > TTL
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
                    cacheRef.current[item.id] = {
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
                    JSON.stringify(cacheRef.current)
                );
            }

            setVideos(
                ids.map((id) => cacheRef.current[id]?.data).filter(Boolean)
            );
        }

        fetchVideos();
    }, []);

    return (
        <div className={classes.musicVideoList}>
            {videos.map((video) => (
                <MusicVideoItem key={video.id} {...video} />
            ))}
        </div>
    );
}
