type MusicService = "deezer" | "jamendo";

interface FetcherConfig {
    baseUrl: string;
    clientId?: string;
    limit?: number;
}

export function createMusicFetcher(service: MusicService, limit?: number) {
    let config: FetcherConfig;

    switch (service) {
        case "deezer":
            config = {
                baseUrl: import.meta.env.VITE_URL_DEEZER,
            };
            break;

        case "jamendo":
            config = {
                baseUrl: import.meta.env.VITE_URL_JAMENDO,
                clientId: import.meta.env.VITE_JAMENDO_CLIENT_ID,
                limit: limit,
            };
            break;

        default:
            throw new Error(`Unknown service: ${service}`);
    }

    return async (query: string) => {
        let url = "";

        if (service === "deezer") {
            url = `${config.baseUrl}/search?
            q=${encodeURIComponent(query)}
            &limit=${config.limit}`;
        }
        else if (service === "jamendo") {
            url = `${config.baseUrl}/tracks/?
            client_id=${config.clientId}
            &format=json&limit=${config.limit}
            &search=${encodeURIComponent(query)}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error fetching from ${service}: ${res.status}`);
        }
        return res.json();
    };
}
