import classes from "./_Footer.module.scss";

export default function Footer() {
    return (
        <footer className={classes.footer}>
            <span>&copy; {new Date().getFullYear()}, Maksym Yeromenko</span>
        </footer>
    );
}
