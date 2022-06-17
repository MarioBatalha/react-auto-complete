import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const Auto = () => {
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  const handleClickOutSide = e => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(e.target)) {
      setDisplay(false);
    }
  };

  const handleUpdatePokeDex = poke => {
    setSearch(poke);
    setDisplay(false);
  };

  useEffect(() => {
    const pokemon = [];
    const promises = new Array(20)
      .fill()
      .map((value, index) =>
        fetch(`https://pokeapi.co/api/v2/pokemon-form/${index + 1}`)
      );
    Promise.all(promises).then((pokemonArray) => {
      return pokemonArray.map((value) =>
        value
          .json()
          .then(({ name, sprites: { front_default: sprite } }) =>
            pokemon.push({ name, sprite })
          )
      );
    });
    setOptions(pokemon);
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutSide);
    return () => {
      window.removeEventListener("mousedown", handleClickOutSide);
    };
  });

  return (
    <div ref={wrapperRef} className="flex-container flex-column pos-rel">
      <input
        id="auto"
        placeholder="type to search"
        value={search}
        onClick={() => setDisplay(!display)}
        onChange={e => setSearch(e.target.value)}
      />
      {display && (
        <div className="autoContainer">
          {options
            .filter(({ name }) => name.indexOf(search.toLowerCase()) > -1)
            .map((value, index) => {
              return (
                <div
                  key={index}
                  tabIndex="0"
                  className="option"
                  onClick={() => handleUpdatePokeDex(value.name)}
                >
                  <span>{value.name}</span>
                  <img src={value.sprite} alt="pokemon" />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <h1>Custom AutoComplete React</h1>
      <div className="logo"></div>
      <div className="auto-container">
        <Auto />
      </div>
    </div>
  );
};

export default App;
