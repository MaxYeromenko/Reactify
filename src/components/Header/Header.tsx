import classes from "./_Header.module.scss";
import SearchBar from "../SearchBar/SearchBar";

type HeaderProps = {
    onSearch: (query: string) => void;
    region: string;
    setRegion: (region: string) => void;
    setLanguage: (language: string) => void;
};

type Region = {
    value: string;
    content: string;
    language: string;
};

export default function Header({
    onSearch,
    region,
    setRegion,
    setLanguage,
}: HeaderProps) {
    const regionCodes: (Region & { language: string })[] = [
        { value: "UA", content: "UA (Ukraine)", language: "музика" },
        { value: "US", content: "US (USA)", language: "music" },
        { value: "GB", content: "GB (United Kingdom)", language: "music" },
        { value: "DE", content: "DE (Germany)", language: "Musik" },
        { value: "FR", content: "FR (France)", language: "musique" },
        { value: "PL", content: "PL (Poland)", language: "muzyka" },
        { value: "IT", content: "IT (Italy)", language: "musica" },
        { value: "ES", content: "ES (Spain)", language: "música" },
        { value: "JP", content: "JP (Japan)", language: "音楽" },
        { value: "KR", content: "KR (South Korea)", language: "음악" },
        { value: "BR", content: "BR (Brazil)", language: "música" },
        { value: "IN", content: "IN (India)", language: "संगीत" },
        { value: "RU", content: "RU (Russia)", language: "музыка" },
        { value: "CA", content: "CA (Canada)", language: "music" },
        { value: "AU", content: "AU (Australia)", language: "music" },
    ];

    return (
        <header className={classes.header}>
            <div className={classes.container}>
                <p className={classes.logo}>
                    <a href="/">Reactify</a>
                </p>
            </div>
            <SearchBar onSearch={onSearch}></SearchBar>
            <div className={classes.region}>
                <select
                    id="region"
                    value={region}
                    onChange={(e) => {
                        setRegion(e.target.value);
                        const selectedRegion = regionCodes.find(r => r.value === e.target.value);
                        if (selectedRegion) {
                            setLanguage(selectedRegion.language);
                        }
                    }}
                >
                    {regionCodes.map((region) => (
                        <option key={region.value} value={region.value}>
                            {region.content}
                        </option>
                    ))}
                </select>
            </div>
        </header>
    );
}
