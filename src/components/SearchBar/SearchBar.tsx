import Button from "../Button/Button";
import classes from "./_SearchBar.module.scss";
import { useState, useEffect, useRef } from "react";

export default function SearchBar({
    query,
    setQuery,
    setSearch,
}: {
    query: string;
    setQuery: (q: string) => void;
    setSearch: (search: boolean) => void;
}) {
    let [suggestions, setSuggestions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            const res = await fetch(
                `/api/suggestions?q=${encodeURIComponent(query)}`
            );
            const data = await res.json();
            setSuggestions(data.suggestions || []);
        };

        const delay = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(delay);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setSuggestions([]);
                setIsFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim() !== "") {
            setSearch(true);
            setSuggestions([]);
        }
    }

    return (
        <>
            <form
                ref={containerRef}
                className={classes.searchBar}
                onSubmit={handleSubmit}
                onFocus={() => setIsFocused(true)}
            >
                <div className={classes.container}>
                    <input
                        type="text"
                        className={classes.input}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for your favorite tracks..."
                    />
                    <Button type="submit">Search</Button>
                </div>
                {isFocused && suggestions.length > 0 && (
                    <ul className={classes.suggestionList}>
                        {suggestions.map((s, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    setQuery(s);
                                    setSuggestions([]);
                                    setIsFocused(false);
                                }}
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </>
    );
}
