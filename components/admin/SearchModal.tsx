import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { classNames } from "@/utils/tailwind";
import { SearchCircleIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/outline";
import { ArticleREST, SearchArticles200Response } from "@/interfaces/article";
import {
  DirectoryListingREST,
  SearchListings200Response,
} from "@/interfaces/listing";
import { useSearchArticle, useSearchListing } from "@/utils/article-helpers";
import { toast } from "react-toastify";
import { ListingSearchPreview } from "./ListingSearchPreview";
import { SearchResultsTable } from "./SearchResultsTable";
import { ArticleSearchPreview } from "./ArticleSearchPreview";
import React from "react";
import { SearchPaginateResults } from "@/interfaces/rest";
import Pagination from "../pagination/Pagination";

const pageSize = 20;

const toastResults = (
  data: SearchListings200Response | SearchArticles200Response,
  setIsSearching: (toggle: boolean) => void
) => {
  setIsSearching(false);
  if (!data || !data.count) {
    toast.error(`Search found zero results`, { type: "error" });
  }
};
interface PaginateProps {
  setPaginateResults: (results: SearchPaginateResults | null) => void;
  page: number;
}
interface SearchProps extends PaginateProps {
  search: string;
  setIsSearching: (toggle: boolean) => void;
}
const SearchArticles = ({
  search,
  setIsSearching,
  setPaginateResults,
  page,
}: SearchProps) => {
  setPaginateResults(null);
  const { data, isLoading, isError } = useSearchArticle({
    search: search,
    page: String(page),
    page_size: String(pageSize),
    options: { onSuccess: (data) => toastResults(data, setIsSearching) },
  });
  return (
    <SearchResults
      search={search}
      data={data}
      isError={isError}
      isLoading={isLoading}
      setPaginateResults={setPaginateResults}
    />
  );
};
const SearchListings = ({
  search,
  setIsSearching,
  setPaginateResults,
  page,
}: SearchProps) => {
  setPaginateResults(null);
  const { data, isLoading, isError } = useSearchListing({
    search: search,
    page: String(page),
    page_size: String(pageSize),
    options: { onSuccess: (data) => toastResults(data, setIsSearching) },
  });
  return (
    <SearchResults
      search={search}
      data={data}
      isError={isError}
      isLoading={isLoading}
      setPaginateResults={setPaginateResults}
    />
  );
};
type Searchable = DirectoryListingREST | ArticleREST;
interface SearchResultsProps {
  data: SearchArticles200Response | SearchListings200Response | undefined;
  search: string;
  isError: boolean;
  isLoading: boolean;
  setPaginateResults: (results: SearchPaginateResults | null) => void;
}

const SearchResults = ({
  data,
  isError,
  isLoading,
  search,
  setPaginateResults,
}: SearchResultsProps) => {
  const noResults = (
    <div className="my-4 text-center">Search Found Zero Listings</div>
  );

  if (isLoading) return <div className="my-4 text-center">Searching...</div>;
  if (
    search == "" ||
    isError ||
    !data ||
    !data.results ||
    !(data.results.length > 0)
  )
    return noResults;

  setPaginateResults(data);
  const results = data.results;
  const options =
    "headline" in results[0]
      ? {
          imageName: "Image",
          mainName: "Headline",
        }
      : {
          imageName: "Logo",
          mainName: "Organization",
        };
  return (
    <SearchResultsTable {...options}>
      {results.map((result) =>
        "headline" in result ? (
          <ArticleSearchPreview key={result.pk} article={result} />
        ) : (
          <ListingSearchPreview key={result.pk} listing={result} />
        )
      )}
    </SearchResultsTable>
  );
};

const noResultsYet = <div className="my-4 text-center">No Results</div>;
type SearchType = "article" | "listing";
type SearchDialogProps = {
  id: string;
  title: string;
  buttonName: string;
  type: SearchType;
};
export const SearchDialog = ({
  id,
  buttonName,
  title,
  type,
}: SearchDialogProps) => {
  const cancelButtonRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [paginateResults, setPaginateResults] =
    useState<SearchPaginateResults | null>(null);
  const [page, setPage] = useState(1);

  interface IFormInputs {
    search: string;
  }
  const { register, handleSubmit, resetField } = useForm<IFormInputs>();
  const searchFunction = ({ search }: IFormInputs) => {
    setIsSearching(true);
    setSearch(search);
  };
  const closeModal = () => {
    setIsOpen(false);
    setIsSearching(false);
    setPage(1);
  };
  const options = {
    setIsSearching,
    setPaginateResults,
    page,
    search,
  };
  const button = (
    <button
      type="button"
      id={id}
      onClick={(e) => setIsOpen(true)}
      className="mx-auto my-2 rounded-md border border-transparent bg-blue px-4 py-2 font-medium text-white  hover:bg-blue-700 "
    >
      <div className="flex">
        <SearchCircleIcon className="h-8 w-8 text-white" />
        <div className="pl-2 pt-1">{buttonName}</div>
      </div>
    </button>
  );
  if (!isOpen) {
    return button;
  }

  return (
    <>
      {button}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[60]"
          initialFocus={cancelButtonRef}
          onClose={() => closeModal()}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={classNames(
                    "relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl",
                    "transform transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6"
                  )}
                >
                  {/* Header */}
                  <div>
                    <div className="text-center sm:mt-2">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="my-2">
                    <form
                      className="mx-auto mb-2 sm:flex sm:items-center"
                      onSubmit={handleSubmit((data) => searchFunction(data))}
                    >
                      <div className="relative w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <SearchIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                          {...register("search")}
                          type="search"
                          id="search"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Search"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="ml-2 inline-flex rounded-lg border-blue-500 bg-blue-500 p-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none "
                      >
                        <SearchIcon className="mr-2 h-5 w-5 text-white" />
                        {isSearching ? "Searching..." : "Search"}
                      </button>
                    </form>
                  </div>

                  {/* Body */}
                  <div className="border-y-2">
                    {/* Results */}
                    {search === "" ? (
                      noResultsYet
                    ) : type === "article" ? (
                      <SearchArticles {...options} />
                    ) : (
                      <SearchListings {...options} />
                    )}
                  </div>

                  {/* Footer */}
                  <div className="sm:mt-2 sm:flex">
                    <div>
                      {paginateResults != null && (
                        <Pagination
                          paginateResults={paginateResults}
                          setPage={setPage}
                          pageSize={pageSize}
                        />
                      )}
                    </div>
                    <div className="mx-auto"></div>
                    <button
                      type="button"
                      className={classNames(
                        "rounded-md border border-gray-300 px-4 py-2 shadow-sm sm:mr-2 sm:mt-0 sm:text-sm",
                        "bg-white text-base font-medium text-gray-700 hover:bg-gray-50",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      )}
                      onClick={() => closeModal()}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
