import React from "react";

const SearchResults = ({ results, isLoading, onSelect, searchTerm }) => {
  if (isLoading) {
    return (
      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
        <div className="p-3 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  // If there's a search term but no results, show "No results found"
  if (
    searchTerm &&
    searchTerm.trim().length > 0 &&
    (!results || results.length === 0)
  ) {
    return (
      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
        <div className="p-3 text-center text-gray-500">No results found</div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
      <ul className="py-1">
        {results.map((org) => (
          <li
            key={org._id}
            className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
            onClick={() => onSelect(org)}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {org.agencyName}
              </span>
              <span className="text-sm text-gray-500">{org.email}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
