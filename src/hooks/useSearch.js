import { useState } from 'react';

const normalizeText = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const filterBySearch = (items, query, getSearchText) => {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);

  if (!items || terms.length === 0) return items;

  return items.filter((item) => {
    const text = normalizeText(getSearchText(item));
    return terms.every((term) => text.includes(term));
  });
};

const useSearch = (items, getSearchText) => {
  const [query, setQuery] = useState('');

  return {
    query,
    setQuery,
    filtered: filterBySearch(items, query, getSearchText),
    isSearching: query.trim() !== '',
  };
};

export default useSearch;
