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
