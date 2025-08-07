import classes from "./_Header.module.scss";
import SearchBar from "../SearchBar/SearchBar";

export default function Header() {
    return (
        <header className={classes.header}>
            <SearchBar></SearchBar>
        </header>
    );
}
