import Button from "../Button/Button";
import classes from "./_SearchBar.module.scss";
import { useState, useEffect } from "react";

export default function SearchBar({
    onSearch,
}: {
    onSearch: (q: string) => void;
}) {
    const [input, setInput] = useState("");
    let [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (!input.trim()) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            const res = await fetch(
                `/api/suggestions?q=${encodeURIComponent(input)}`
            );
            const data = await res.json();
            setSuggestions(data.suggestions || []);
        };

        const delay = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(delay);
    }, [input]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (input.trim() !== "") {
            onSearch(input.trim());
        }
    }

    return (
        <>
            <form className={classes.searchBar} onSubmit={handleSubmit}>
                <div className={classes.container}>
                    <input
                        type="text"
                        className={classes.input}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit">Search</Button>
                </div>
                {/* Проблема 1: не прячется окно с подсказками.*/}
                {suggestions.length > 0 && (
                    <ul className={classes.suggestionList}>
                        {suggestions.map((s, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    setInput(s);
                                    onSearch(s);
                                    setSuggestions([]);
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
