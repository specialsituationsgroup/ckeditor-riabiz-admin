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
import AsyncSelect from "react-select/async";
import { API_ENDPOINT } from "utils/api";
import { Controller } from "react-hook-form";

export function AdminSectionsDropdown({
  control,
  name
}: any) {
  const loadSimpleSections = async (searchInput: string) => {
    const req = await fetch(
      searchInput
        ? `${API_ENDPOINT}api/v1/sections/simple?title=${searchInput}&page_size=20`
        : `${API_ENDPOINT}api/v1/sections/simple?page_size=20`
    );
    const data = await req.json();
    return data.results.map((item: any) => {
      return {
        value: item.slug,
        label: item.title,
        pk: item.pk,
        published: item.published,
      };
    });
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AsyncSelect
          {...field}
          cacheOptions
          isMulti
          defaultOptions
          placeholder="Search for sections"
          loadOptions={loadSimpleSections}
        />
      )}
    />
  );
}
