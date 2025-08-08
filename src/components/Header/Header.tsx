import classes from "./_Header.module.scss";
import SearchBar from "../SearchBar/SearchBar";

export default function Header() {
    return (
        <header className={classes.header}>
            <div className={classes.container}>
                <p className={classes.logo}>
                    <a href="/">Reactify</a>
                </p>
            </div>
            <SearchBar></SearchBar>
        </header>
    );
}
