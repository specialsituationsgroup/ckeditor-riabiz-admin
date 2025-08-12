import React from "react";

export function FullArticleCheckbox({
    register
}: any) {
    return (
        <fieldset className="">
            <div className="relative flex items-start">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="featured"
                        {...register}
                        className="w-6 h-6 text-indigo-600 border-gray-300 rounded form-checkbox"
                    />
                </div>
                <div className="ml-3 space-x-3 text-base">
                    <label htmlFor="featured" className="font-semibold text-gray-500">
                        Featured?
                    </label>
                    <span id="comments-description" className="text-gray-500">
                        Is this a new move article to be included on the homepage?
                    </span>
                </div>
            </div>
        </fieldset>
    )
}