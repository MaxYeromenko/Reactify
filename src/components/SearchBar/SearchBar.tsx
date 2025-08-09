import Button from "../../Button/Button";
import classes from "./_SearchBar.module.scss";
import useInput from "../../hooks/useInput";

export default function SearchBar() {
    const input = useInput();

    return (
        <div className={classes.searchBar}>
            <div className={classes.container}>
                <input type="text" className={classes.input} {...input} />
                <Button>Search</Button>
            </div>
        </div>
    );
}
