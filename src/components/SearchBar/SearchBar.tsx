import Button from "../Button/Button";
import classes from "./_SearchBar.module.scss";
import { useState } from "react";

export default function SearchBar({
    onSearch,
}: {
    onSearch: (q: string) => void;
}) {
    const [input, setInput] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (input.trim() !== "") {
            onSearch(input.trim());
        }
    }

    return (
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
        </form>
    );
}
