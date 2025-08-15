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