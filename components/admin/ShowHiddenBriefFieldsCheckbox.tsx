import React from "react";

interface Props {
    setShowHiddenBriefFields: (show: boolean) => void;
    showHiddenBriefFields: boolean;
}
export function ShowHiddenBriefFieldsCheckbox({
    setShowHiddenBriefFields,
    showHiddenBriefFields
}: Props) {
    return (
        <fieldset className="">
            <div className="relative flex items-start">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="showHiddenBriefFieldCheckbox"
                        onClick={() => setShowHiddenBriefFields(!showHiddenBriefFields)}
                        checked={showHiddenBriefFields}
                        className="w-6 h-6 text-indigo-600 border-gray-300 rounded form-checkbox"
                    />
                </div>
                <div className="ml-3 space-x-3 text-base">
                    <label
                        htmlFor="featured"
                        className="font-semibold text-gray-500"
                    >
                        Show hidden fields?
                    </label>
                    <span id="comments-description" className="text-gray-500">
                        Show all the article detail fields?
                    </span>
                </div>
            </div>
        </fieldset>
    );
}
