import classes from "./_SearchBar.module.scss";

export default function SearchBar() {
    return (
        <div className={classes.searchBar}>
            <div className={classes.container}>
                <input type="text" className={classes.input} />
                <button className={classes.button}>Search</button>
            </div>
        </div>
    );
}
