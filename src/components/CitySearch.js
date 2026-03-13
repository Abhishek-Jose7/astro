'use client';

import { useState, useRef, useEffect } from 'react';
import { searchCities } from '@/data/cities';
import styles from './CitySearch.module.css';

export default function CitySearch({ value, onChange, error }) {
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(e) {
    const val = e.target.value;
    setQuery(val);
    setHighlightIndex(-1);

    if (val.length >= 2) {
      const matches = searchCities(val);
      setResults(matches);
      setIsOpen(matches.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }

    // Clear selection if text doesn't match current selection
    if (value && value.name !== val) {
      onChange(null);
    }
  }

  function handleSelect(city) {
    setQuery(`${city.name}, ${city.country}`);
    onChange(city);
    setIsOpen(false);
    setHighlightIndex(-1);
  }

  function handleKeyDown(e) {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <label className="oracle-label" htmlFor="city-search">Birth City</label>
      <input
        id="city-search"
        type="text"
        className={`oracle-input ${error ? 'error' : ''}`}
        placeholder="Start typing a city name..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        autoComplete="off"
      />
      {error && <div className="oracle-error">{error}</div>}

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {results.map((city, i) => (
            <li
              key={`${city.name}-${city.country}`}
              className={`${styles.item} ${i === highlightIndex ? styles.highlighted : ''}`}
              onClick={() => handleSelect(city)}
              role="option"
              aria-selected={i === highlightIndex}
            >
              <span className={styles.cityName}>{city.name}</span>
              <span className={styles.countryCode}>{city.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
