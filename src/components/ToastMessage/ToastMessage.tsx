import classes from "./_ToastMessage.module.scss";

export type MessageType = "info" | "warning" | "error";

type ToastMessageProps = {
    message: string;
    messageType: MessageType;
};

export default function ToastMessage({
    message,
    messageType,
}: ToastMessageProps) {
    return (
        <div className={classes.toastMessage + " " + classes[messageType]}>
            <span>{message}</span>
        </div>
    );
}
