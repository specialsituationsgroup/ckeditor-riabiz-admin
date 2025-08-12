import React, { useCallback } from "react";
import AsyncSelect from "react-select/async";
import { API_ENDPOINT } from "utils/api";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { ArticleEditorFormType, AuthorFormType } from "pages/admin/a/[...slug]";
import slugify from "slugify";
import AsyncCreatableSelect from "react-select/async-creatable";
type AuthorDropdownProps = {
  name: string;
  placeholder: string;
  control: Control;
  setValue: UseFormSetValue<ArticleEditorFormType>;
};
interface SimpleAuthorType {
  slug: string;
  name: string;
  pk: number;
}
export function AdminAuthorsDropdown({
  control,
  name,
  placeholder,
  setValue,
}: AuthorDropdownProps) {
  const loadSimpleAuthors = async (
    searchInput: string
  ): Promise<AuthorFormType[]> => {
    const req = await fetch(
      searchInput
        ? `${API_ENDPOINT}api/v1/authors/simple?name=${searchInput}&page_size=20`
        : `${API_ENDPOINT}api/v1/authors/simple?page_size=20`
    );
    const { results } = await req.json();
    return results.map((item: SimpleAuthorType) => {
      return {
        value: item.slug,
        label: item.name,
        pk: item.pk,
      };
    });
  };
  const handleCreate = useCallback((inputValue, authors) => {
    const newValue = {
      value: slugify(inputValue.toLowerCase()),
      label: inputValue,
    };
    setValue("authors", [...authors, newValue]);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AsyncCreatableSelect
          {...field}
          cacheOptions
          isMulti
          defaultOptions
          placeholder={placeholder}
          loadOptions={loadSimpleAuthors}
          onCreateOption={(inputValue) => handleCreate(inputValue, field.value)}
        />
      )}
    />
  );
}
