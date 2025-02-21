import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';
import ActionButton from './ActionButton';
import './styles/Game.css';

function Game({ tilesData }) {
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [mistakes, setMistakes] = useState(4);
  const [status, setStatus] = useState('playing');
  const [matchedTiles, setMatchedTiles] = useState([]);
  const [message, setMessage] = useState('');
  const [submittedSelections, setSubmittedSelections] = useState([]);
  const [shuffledTiles, setShuffledTiles] = useState([]);

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
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // Shuffle tiles upon render
  useEffect(() => {
    setShuffledTiles(shuffleTiles([...tilesData]));
  }, [tilesData]);

  /*
  Allow tile to be selected if not a matched tile
  and less than 4 tiles have been selected
  and deselect tile if already selecte
  */
  const handleTileSelect = (tile) => {
    if (status === 'lost') return;

    if (selectedTiles.includes(tile)) {
      setSelectedTiles(selectedTiles.filter((t) => t !== tile));
    } else if (!matchedTiles.includes(tile)) {
      if (selectedTiles.length < 4) {
        setSelectedTiles([...selectedTiles, tile]);
      }
    }
  };

  // TODO: handle case when 3/4 tiles are matching
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

  // TODO: display theme of matched tiles
  const reorderTiles = (matched, unmatched) => [...matched, ...unmatched];

  const checkSelection = () => {
    if (selectedTiles.length === 4) {
      // Check if the current selection has already been submitted
      if (submittedSelections.some((selection) => arraysEqual(selection, selectedTiles))) {
        setMessage('already selected!');
        setSelectedTiles([]);
        return;
      }

      if (isCorrectMatch(selectedTiles)) {
        const newMatchedTiles = [...matchedTiles, ...selectedTiles];
        setMatchedTiles(newMatchedTiles);
        const unmatchedTiles = shuffledTiles.filter((tile) => !newMatchedTiles.includes(tile));
        setShuffledTiles(reorderTiles(newMatchedTiles, unmatchedTiles));

        // if all tiles are matched, game is won
        if (newMatchedTiles.length === tilesData.length) {
          setStatus('won');
        }
      } else {
        setMistakes((prevMistakes) => {
          const newMistakes = prevMistakes - 1;
          if (newMistakes === 0) {
            setStatus('lost');
          }
          return newMistakes;
        });
      }
      setSubmittedSelections([...submittedSelections, selectedTiles]);
      setSelectedTiles([]);
      setMessage('');
    }
  };

  // Action button handling (Submit, Shuffle, Deselect all)
  const handleShuffle = () => {
    const unmatchedTiles = shuffledTiles.filter((tile) => !matchedTiles.includes(tile));
    const shuffledUnmatched = shuffleTiles(unmatchedTiles);
    setShuffledTiles(reorderTiles(matchedTiles, shuffledUnmatched));
  };

  const handleDeselectAll = () => {
    setSelectedTiles([]);
  };

  // Change color of tiles when selected
  const getTileColors = (tile) => {
    if (matchedTiles.includes(tile)) {
      return tile.colors;
    }
    if (selectedTiles.includes(tile)) {
      return ['#5a594e', '#fff'];
    }
    return ['#efefe6', '#000'];
  };

  return (
    <div className="container">
      <h1 className="game_title">Clonections</h1>
      <div>
        Create four groups of four!
      </div>
      {/* Grid of word tiles */}
      <div className="grid">
        {shuffledTiles.map((tile) => (
          <Tile
            key={tile.word}
            word={tile.word}
            colors={getTileColors(tile)}
            onSelect={() => handleTileSelect(tile)}
            disabled={matchedTiles.includes(tile) || status === 'lost'}
          />
        ))}
      </div>

      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', left: '580px' }}>Mistakes Remaining:&nbsp;</div>
        <div style={{ display: 'flex', marginLeft: '150px' }}>
          {Array.from({ length: mistakes }, (_, index) => (
            <span key={index} className="circle" />
          ))}
        </div>
      </div> */}

      <div className="mistakesWrapper">
        <div className="mistakesContent">
          Mistakes Remaining:&nbsp;
          <span className="mistakesRemaining">
            {Array.from({ length: mistakes }, (_, index) => (
              <span key={index} className="circle" />
            ))}
          </span>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
      {/* Shuffle, Deselect all, and Submit */}
      <div className="actionButtonGrid">
        <ActionButton
          onClick={handleShuffle}
          disabled={status !== 'playing'}
        >
          Shuffle
        </ActionButton>
        <ActionButton
          onClick={handleDeselectAll}
          className="deselect_all_button"
          disabled={selectedTiles.length < 1 || status === 'lost'}
        >
          Deselect All
        </ActionButton>
        <ActionButton
          onClick={checkSelection}
          disabled={selectedTiles.length !== 4 || status === 'lost'}
        >
          Submit
        </ActionButton>
      </div>
      {/* TODO: add button to move to next game */}
    </div>
  );
}

Game.propTypes = {
  tilesData: PropTypes.arrayOf(
    PropTypes.shape({
      word: PropTypes.string.isRequired,
      theme: PropTypes.string.isRequired,
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
};

export default Game;
