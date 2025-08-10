import type { InputHTMLAttributes } from "react";
import classes from "./_InputRange.module.scss";
type InputRangeProps = InputHTMLAttributes<HTMLInputElement>;

export default function InputRange({ ...props }: InputRangeProps) {
    return <input {...props} className={classes.input} />;
}
