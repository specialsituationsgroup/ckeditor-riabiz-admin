/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

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
