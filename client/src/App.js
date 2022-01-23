import logo from "./logo.svg";
import "./App.css";
import { Helmet } from "react-helmet";
import react, { useEffect, useState } from "react";
import Hangman from "./components/Hangman.js";
import axios from "axios";

function App() {
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [guesses, setGuesses] = useState(7);
  const [word, setWord] = useState("");
  const [guess, setGuess] = useState("");

  const getRandomWord = async () => {
    try {
      const resp = await axios.get(
        "https://random-word-api.herokuapp.com/word?number=1"
      );
      const word = resp.data[0];
      setWord(word);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

    getRandomWord();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (word.includes(guess)) {
        setWins(wins + 1);
        setGuesses(guesses + 1);
        setGuess("");
      } else {

        setLosses(losses + 1);
        setGuesses(guesses - 1);
        setGuess("");
      }
    }



  return (
    <>
      <Helmet>
        <title>Hangman SMS</title>
      </Helmet>
      <div className="App">
        {!isGameOver ? (
          <>
            <p>Try to guess the random word</p>
            <p>
              The more tries it takes the more body parts will be added to the
              hangman
            </p>
            <p>You have {guesses} guesses</p>
            <Hangman guesses={guesses} />
            <p>Secret word: {word}</p>
            <br />
            <form>
              <label>
                Guess:
                </label>
              <input onSubmit = {handleSubmit} onChange = {(e) => {setGuess(e.target.value)}} />
            </form>
            <p>Wins: {wins}</p>
            <p>Losses: {losses}</p>{" "}
          </>
        ) : (
          <p>Game over</p>
        )}
      </div>
    </>
  );
}

export default App;
