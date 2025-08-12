import { ModalButton } from "./AdminModalButton";

type publishButtonProps = {
    onclick: () => void;
    published: boolean;
    extraClassNames?: string;
};

export const PublishButton = ({
    onclick,
    published,
    extraClassNames,
}: publishButtonProps) => {
    return (
        <ModalButton
            onclick={onclick}
            isModeOne={published}
            modeTwoName="Unpublish"
            modeOneName="Publish"
            extraClassNames={extraClassNames}
        />
    );
};
