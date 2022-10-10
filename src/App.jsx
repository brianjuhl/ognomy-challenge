import './index.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import flagNotFound from './flag-not-found.svg';

const states = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};

const App = () => {
  const [brokenFlags, setBrokenFlags] = useState([]);
  const [countries, setCountries] = useState([]);
  const [displayCount, setDisplayCount] = useState(8);
  const [state, setState] = useState(states.LOADING);
  const [query, setQuery] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v2/all ');
        if (!!response.data.length) {
          setCountries(response.data);
        }
        setState(states.LOADED);
      } catch (e) {
        setState(states.ERROR);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (displayCount !== 8) {
      setDisplayCount(8);
    }
  }, [query]);

  const renderHeroMessage = () => {
    if (state === states.LOADING) {
      return 'Loading...';
    }

    if (state === states.ERROR) {
      return 'Something went wrong.';
    }

    if (state === states.LOADED) {
      return `Currently we have ${countries.length} countries`;
    }

    return '';
  };

  const filteredCountries = query
    ? countries.filter((country) => {
        const searchString = `${country.name} ${
          country.capital
        } ${country.languages
          .map((language) => language.name)
          .join(' ')}`.toLowerCase();
        return searchString.includes(query);
      })
    : countries;

  return (
    <main>
      <section className="hero">
        <h1>World Countries Data</h1>
        <p>{renderHeroMessage()}</p>
      </section>
      {state === states.LOADED && (
        <>
          <section className="search">
            <input
              onChange={(e) => {
                if (e.target.value !== '') {
                  setQuery(e.target.value.toLowerCase());
                } else {
                  setQuery(null);
                }
              }}
              type="text"
              placeholder="Search countries by name, capital or languages"
            />
          </section>
          <section className="countries">
            {filteredCountries.slice(0, displayCount).map((country, index) => (
              <div className="country" key={index}>
                <div className="country-entry">
                  <img
                    className="flag"
                    src={
                      brokenFlags.includes(country.name)
                        ? flagNotFound
                        : country.flag
                    }
                    onError={() => {
                      setBrokenFlags([...brokenFlags, country.name]);
                    }}
                    alt={`Flag of ${country.name}`}
                  />
                  <div className="name">{country.name}</div>
                </div>
                <div className="country-details">
                  <div>
                    <span>Capital:</span> {country.capital}
                  </div>
                  <div>
                    <span>
                      Language{country.languages.length > 1 ? 's' : ''}:
                    </span>{' '}
                    {country.languages.map((language, index) => (
                      <span key={language.name}>
                        {language.name}
                        {country.languages.length - 1 !== index ? ',' : ''}{' '}
                      </span>
                    ))}
                  </div>
                  <div>
                    <span>Population:</span>{' '}
                    {country.population.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            ))}
          </section>
          {filteredCountries.length > 8 &&
            filteredCountries.length > displayCount && (
              <section className="pagination">
                <button
                  onClick={() => {
                    setDisplayCount(displayCount + 8);
                  }}
                >
                  Load More
                </button>
              </section>
            )}
        </>
      )}
    </main>
  );
};

export default App;
