import React, { useState, useEffect } from "react";

const CocktailInfo = () => {
  const [cocktail, setCocktail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Function to fetch a random cocktail
    async function getRandomCocktail() {
      try {
        const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        const data = await response.json();
        const randomCocktail = data.drinks[0];
        setCocktail(randomCocktail);
      } catch (error) {
        console.error("Error fetching random cocktail:", error);
      }
    }

    getRandomCocktail();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      const data = await response.json();

      // Check if there are search results
      if (data.drinks) {
        setCocktail(null); // Hide the random cocktail
        setSearchResults(data.drinks);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching cocktails:", error);
    }
  };

  const displayIngredients = (drink) => {
    const ingredients = [];

    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient && measure) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }

    return ingredients;
  };

  return (
    <div>
      <h1>Cocktail Finder</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search for a cocktail"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* Display search results */}
      {searchResults.length > 0 ? (
        <div>
          {searchResults.map((result) => (
            <div key={result.idDrink}>
              <h2>{result.strDrink}</h2>
              <p>{result.strInstructions}</p>
              <h3>Ingredients:</h3>
              <ul>
                {displayIngredients(result).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <img src={result.strDrinkThumb} alt={result.strDrink} />
            </div>
          ))}
        </div>
      ) : (
        <p>No cocktails found. Try a different search term.</p>
      )}

      {/* Display a random cocktail */}
      {cocktail && searchResults.length === 0 ? (
        <div>
          <h2>{cocktail.strDrink}</h2>
          <p>{cocktail.strInstructions}</p>
          <h3>Ingredients:</h3>
          <ul>
            {displayIngredients(cocktail).map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
        </div>
      ) : null}
    </div>
  );
};

export default CocktailInfo;
