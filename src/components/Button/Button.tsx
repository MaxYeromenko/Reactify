import { type PropsWithChildren, type ButtonHTMLAttributes } from "react";
import classes from "./_Button.module.scss";

type ButtonProps = PropsWithChildren<
    ButtonHTMLAttributes<HTMLButtonElement>
> & {
    active?: boolean;
};

export default function Button({ children, active, ...props }: ButtonProps) {
    return (
        <button
            className={classes.button + " " + (active ? classes.active : "")}
            {...props}
        >
            {children}
        </button>
    );
}
