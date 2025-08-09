import classes from "./_Header.module.scss";
import SearchBar from "../SearchBar/SearchBar";

export default function Header({
    onSearch,
}: {
    onSearch: (q: string) => void;
}) {
    return (
        <header className={classes.header}>
            <div className={classes.container}>
                <p className={classes.logo}>
                    <a href="/">Reactify</a>
                </p>
            </div>
            <SearchBar onSearch={onSearch}></SearchBar>
        </header>
    );
}
