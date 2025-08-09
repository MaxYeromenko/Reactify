import { type PropsWithChildren, type ButtonHTMLAttributes } from "react";
import classes from "./_Button.module.scss";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export default function Button({ children, ...props }: ButtonProps) {
    return (
        <button className={classes.button} {...props}>
            {children}
        </button>
    );
}
