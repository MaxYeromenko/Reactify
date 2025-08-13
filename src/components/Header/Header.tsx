import classes from "./_Header.module.scss";
import SearchBar from "../SearchBar/SearchBar";

type HeaderProps = {
    query: string;
    setQuery: (query: string) => void;
    region: string;
    setRegion: (region: string) => void;
    setLanguage: (language: string) => void;
    setSearch: (search: boolean) => void;
};

type Region = {
    value: string;
    content: string;
    language: string;
};

export default function Header({
    query,
    setQuery,
    region,
    setRegion,
    setLanguage,
    setSearch,
}: HeaderProps) {
    const regionCodes: (Region & { language: string })[] = [
        {
            value: "UA",
            content: "UA (Ukraine)",
            language: "uk_українська музика",
        },
        { value: "US", content: "US (USA)", language: "en_American music" },
        {
            value: "GB",
            content: "GB (United Kingdom)",
            language: "en_British music",
        },
        { value: "DE", content: "DE (Germany)", language: "de_Deutsche Musik" },
        {
            value: "FR",
            content: "FR (France)",
            language: "fr_musique française",
        },
        { value: "PL", content: "PL (Poland)", language: "pl_polska muzyka" },
        { value: "IT", content: "IT (Italy)", language: "it_musica italiana" },
        { value: "ES", content: "ES (Spain)", language: "es_música española" },
        { value: "JP", content: "JP (Japan)", language: "ja_日本の音楽" },
        { value: "KR", content: "KR (South Korea)", language: "ko_한국 음악" },
        {
            value: "BR",
            content: "BR (Brazil)",
            language: "pt_música brasileira",
        },
        { value: "IN", content: "IN (India)", language: "hi_भारतीय संगीत" },
        { value: "RU", content: "RU (Russia)", language: "ru_русская музыка" },
        { value: "CA", content: "CA (Canada)", language: "en_Canadian music" },
        {
            value: "AU",
            content: "AU (Australia)",
            language: "en_Australian music",
        },
    ];

    return (
        <header className={classes.header}>
            <div className={classes.container}>
                <p className={classes.logo}>
                    <a href="#top">Reactify</a>
                </p>
            </div>
            <SearchBar
                query={query}
                setQuery={setQuery}
                setSearch={setSearch}
            />
            <div className={classes.region}>
                <select
                    id="region"
                    value={region}
                    onChange={(e) => {
                        setRegion(e.target.value);
                        const selectedRegion = regionCodes.find(
                            (r) => r.value === e.target.value
                        );
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
