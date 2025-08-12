type ErrorProps = {
    messages: string[],
}
const ErrorToast: React.FC<ErrorProps> = ({ messages }) => {
    return (
        <>
            <p><strong>Action required</strong></p>
            <ul className="list-disc list-inside">{messages.map((msg, idx) => <li key={idx}>{msg}</li>)}</ul>
        </>
    );
};

export default ErrorToast;