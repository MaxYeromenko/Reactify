import classes from "./_Main.module.scss";
import getSpotifyToken from "../../ts/GetSpotifyAccessToken";
import { useState, useEffect } from "react";

type Artist = {
    name: string;
};

type AlbumImage = {
    url: string;
};

type Album = {
    images: AlbumImage[];
    name: string;
};

type Track = {
    id: string;
    name: string;
    artists: Artist[];
    album: Album;
    url: string | null;
};

export default function Main() {
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        async function getTrack() {
            const token = await getSpotifyToken();
            const res = await fetch(
                "https://api.spotify.com/v1/search?q=Imagine%20Dragons&type=track&limit=5",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            setTracks(data.tracks.items); // записываем массив треков в состояние
        }

        getTrack();
    }, []); // пустой массив зависимостей — вызов один раз при монтировании

    return (
        <main className={classes.main}>
            {tracks.map((track) => (
                <div key={track.id}>
                    <img
                        src={track.album.images[0]?.url}
                        alt={track.name}
                        width={100}
                    />
                    <h3>
                        {track.name} {track.url}
                    </h3>
                    <p>{track.artists.map((a) => a.name).join(", ")}</p>
                    {track.url && (
                        <audio controls src={track.url}>
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </div>
            ))}
        </main>
    );
}
