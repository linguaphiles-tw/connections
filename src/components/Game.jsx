/* eslint-disable no-await-in-loop */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from 'reactjs-alert';
import Tile from './Tile';
import ActionButton from './ActionButton';
import Toggle from './Toggle';
import './styles/Game.css';
import SolvedCategory from './SolvedCategory';

function Game({ tilesData }) {
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [mistakes, setMistakes] = useState(4);
  const [removingMistake, setRemovingMistake] = useState(null);
  // possible statuses: playing, won, lost, wrong
  const [status, setStatus] = useState('playing');
  // TODO: remove matchedTiles at some point
  const [matchedTiles, setMatchedTiles] = useState([]);
  const [solvedCategories, setSolvedCategories] = useState([]);
  const [newSolvedTheme, setNewSolvedTheme] = useState({
    theme: '', title: '', words: [], category: '',
  });
  const [submittedSelections, setSubmittedSelections] = useState([]);
  // notify user if selection has already been submitted
  const [alert, setAlert] = useState({ type: '', status: false, title: '' });
  const [guessAnimation, setGuessAnimation] = useState({ show: false, index: -1 });
  const [shakingTiles, setShakingTiles] = useState(false);

  /*
  Note: for each submitted section, the actual game saves the following:
  - correct (bool)
  - cards (i.e. "1,2,3,4")
  - solved level (0-4)
  */

  // Fisher-Yates shuffle algorithm
  const shuffleTiles = (arr) => {
    const shuffledArray = [...arr];
    for (let i = shuffledArray.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  // Shuffle tiles upon render
  const [shuffledTiles, setShuffledTiles] = useState(() => shuffleTiles([...tilesData]));

  // Guess and wrong selection animations inspired by
  // https://github.com/srefsland/nyt-connections-clone
  const delay = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

  // Animates selected tiles from top to bottom
  // and left to right in the grid
  const animateGuess = async (tiles) => {
    // Save tiles' indices in shuffledTiles for quick lookup
    const tileIndexMap = new Map(shuffledTiles.map((tile, index) => [tile, index]));

    // Map selected tiles to indices
    const sortedSelectedTiles = tiles
      .map((tile) => ({
        tile,
        index: tileIndexMap.get(tile),
      }))
      .sort((a, b) => a.index - b.index);

    // Animate the tiles in sorted order
    for (let i = 0; i < sortedSelectedTiles.length; i += 1) {
      setGuessAnimation({ show: true, index: sortedSelectedTiles[i].index });
      // Delay between tiles
      await delay(200);
    }

    setGuessAnimation({ show: false, index: -1 });
    // Delay before next animation
    await delay(500);
  };

  const animateWrongGuess = async () => {
    setShakingTiles(true);
    await delay(225);
    setShakingTiles(false);
  };

  /*
  Allow tile to be selected if not a matched tile
  and less than 4 tiles have been selected.
  Deselect tile if already selected.
  */
  const handleTileSelect = (tile) => {
    if (status === 'lost') return;

    if (selectedTiles.includes(tile)) {
      setSelectedTiles(selectedTiles.filter((t) => t !== tile));
    } else if (!matchedTiles.includes(tile)) {
      if (selectedTiles.length < 4) {
        if (status === 'wrong') {
          setStatus('playing');
        }
        setSelectedTiles([...selectedTiles, tile]);
      }
    }
  };

  // TODO: handle case when 3/4 tiles are matching
  // Checks if all 4 files match (have the same theme)
  const isCorrectMatch = (tiles) => {
    if (tiles.length !== 4) return false;
    const { theme } = tiles[0];

    for (let index = 1; index < tiles.length; index += 1) {
      if (tiles[index].theme !== theme) return false;
    }
    return true;
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    const extractWords = (arr) => arr.map((item) => item.word);

    const sortedWords1 = extractWords(arr1).sort();
    const sortedWords2 = extractWords(arr2).sort();

    return sortedWords1.every((word, index) => word === sortedWords2[index]);
  };

  const checkSelection = async () => {
    if (selectedTiles.length === 4) {
      // Check if the current selection has already been submitted
      if (
        submittedSelections.some((selection) => arraysEqual(selection, selectedTiles))
      ) {
        setAlert({ type: 'error', status: true, title: 'Already selected!' });
        return;
      }

      await animateGuess(selectedTiles);

      if (isCorrectMatch(selectedTiles)) {
        const newMatchedTiles = [...matchedTiles, ...selectedTiles];
        setMatchedTiles(newMatchedTiles);

        const { theme } = selectedTiles[0];
        const { category } = selectedTiles[0];
        const words = selectedTiles.map((t) => t.word);

        // Check for duplicate catgeories
        setSolvedCategories((prev) => (prev.some((cat) => cat.theme === theme)
          ? prev
          : [...prev, {
            theme, title: theme, words, category,
          }]));

        // Animate pulse effect for the solved category
        setNewSolvedTheme(theme);

        setTimeout(() => {
          setNewSolvedTheme('');
        }, 300);

        const unmatchedTiles = shuffledTiles.filter(
          (tile) => !newMatchedTiles.includes(tile),
        );
        setShuffledTiles(unmatchedTiles);

        // Clear selection after a correct match
        setSelectedTiles([]);

        // If all tiles are matched, game is won
        if (newMatchedTiles.length === tilesData.length) {
          setStatus('won');
        }
      } else {
        // Wrong selection
        await animateWrongGuess(selectedTiles);

        const newMistakes = mistakes - 1;

        // Set the index of the mistake being removed
        setRemovingMistake(newMistakes);

        // Wait for animation to finish before decrementing mistakes
        // and updating status
        setTimeout(() => {
          setRemovingMistake(null);
          setMistakes(newMistakes);
        }, 300);

        if (newMistakes === 0) {
          setStatus('lost');
        } else {
          setStatus('wrong');
        }
      }
      setSubmittedSelections([...submittedSelections, selectedTiles]);
    }
  };

  // Action button handling (Submit, Shuffle, Deselect all)
  const handleShuffle = () => {
    const unmatchedTiles = shuffledTiles.filter(
      (tile) => !matchedTiles.includes(tile),
    );
    const shuffledUnmatched = shuffleTiles(unmatchedTiles);
    setShuffledTiles(shuffledUnmatched);
  };

  const handleDeselectAll = () => {
    setSelectedTiles([]);
  };

  // Change color of tiles when selected
  const getTileColors = (tile) => {
    if (selectedTiles.includes(tile)) {
      return ['#5a594e', '#fff'];
    }
    return ['#efefe6', '#000'];
  };

  // Display alert for 10 seconds when selection has already been made
  useEffect(() => {
    if (alert.status) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, status: false });
      }, 10000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [alert]);

  const handleKeyDown = (event, tile) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleTileSelect(tile);
    }
  };

  return (
    <main className="container">
      <h1 className="game_title">Clonections</h1>
      <div>Create four groups of four!</div>

      <Alert
        type={alert.type}
        status={alert.status}
        title={alert.title}
        Close={() => setAlert({ ...alert, status: false })}
      />

      {/* Grid of word tiles */}
      <div className="grid" role="grid">
        {solvedCategories.map((cat) => (
          <SolvedCategory
            key={cat.theme}
            tile={cat}
            className={`${newSolvedTheme === cat.theme ? 'animate-pulse' : ''}`}
          />
        ))}
        {shuffledTiles.map((tile) => (
          <Tile
            key={tile.word}
            word={tile.word}
            colors={getTileColors(tile)}
            onSelect={() => handleTileSelect(tile)}
            disabled={matchedTiles.includes(tile) || status === 'won' || status === 'lost'}
            className={`${shakingTiles && selectedTiles.includes(tile) ? 'animate-horizontal-shake' : ''} ${
              guessAnimation.show && guessAnimation.index === shuffledTiles.indexOf(tile) ? 'animate-guess-animation' : ''
            }`}
            aria-label={`Tile ${tile.word}`}
            tabIndex={0}
            role="button"
            onKeyDown={(event) => handleKeyDown(event, tile)}
          />
        ))}
      </div>

      <div className="mistakesWrapper">
        <div className="mistakesContent">
          Mistakes Remaining:&nbsp;
          <span className="mistakesRemaining">
            {Array.from({ length: mistakes }, (_, index) => (
              <span
                key={index}
                className={`circle ${removingMistake === index ? 'animate-fade-out' : ''}`}
                data-testid="mistake"
              />
            ))}
          </span>
        </div>
      </div>

      {/* Shuffle, Deselect all, and Submit */}
      <div className="actionButtonGrid">
        <ActionButton onClick={handleShuffle} disabled={status === 'won' || status === 'lost'} aria-label="Shuffle tiles">
          Shuffle
        </ActionButton>
        <ActionButton
          onClick={handleDeselectAll}
          className="deselect_all_button"
          disabled={selectedTiles.length < 1 || status === 'won' || status === 'lost'}
          aria-label="Deselect all tiles"
        >
          Deselect All
        </ActionButton>
        <ActionButton
          onClick={checkSelection}
          disabled={selectedTiles.length !== 4 || status === 'won' || status === 'lost' || status === 'wrong'}
          aria-label="Submit selection"
        >
          Submit
        </ActionButton>
      </div>
      <Toggle />
    </main>
  );
}

Game.propTypes = {
  tilesData: PropTypes.arrayOf(
    PropTypes.shape({
      word: PropTypes.string.isRequired,
      theme: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Game;
