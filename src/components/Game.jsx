import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';
import ActionButton from './ActionButton';
import './styles/Game.css';

function Game({ tilesData }) {
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [lives, setLives] = useState(5);
  const [status, setStatus] = useState('playing');
  const [matchedTiles, setMatchedTiles] = useState([]);
  const [submittedSelections, setSubmittedSelections] = useState([]);
  const [shuffledTiles, setShuffledTiles] = useState(tilesData);

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

  const isCorrectMatch = (tiles) => {
    if (tiles.length !== 4) return false;
    const { theme } = tiles[0];

    for (let index = 1; index < tiles.length; index += 1) {
      if (tiles[index].theme !== theme) return false;
    }
    return true;
  };

  const checkSelection = () => {
    if (selectedTiles.length === 4) {
      if (isCorrectMatch(selectedTiles)) {
        setMatchedTiles([...matchedTiles, ...selectedTiles]);
        if (matchedTiles.length + 4 === tilesData.length) {
          setStatus('won');
        }
      } else {
        setLives((prevLives) => {
          const newLives = prevLives - 1;
          if (newLives === 0) {
            setStatus('lost');
          }
          return newLives;
        });
      }
      setSubmittedSelections([...submittedSelections, selectedTiles]);
      setSelectedTiles([]);
    }
  };

  const handleSubmit = () => {
    checkSelection();
  };

  const handleShuffle = () => {
    const unmatchedTiles = shuffledTiles.filter((tile) => !matchedTiles.includes(tile));
    const shuffledUnmatched = unmatchedTiles.sort(() => Math.random() - 0.5);
    setShuffledTiles([...matchedTiles, ...shuffledUnmatched]);
  };

  const handleDeselectAll = () => {
    setSelectedTiles([]);
  };

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
      <div>
        Mistakes Remaining:&nbsp;
        {lives}
      </div>
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
          onClick={handleSubmit}
          disabled={selectedTiles.length !== 4 || status === 'lost'}
        >
          Submit
        </ActionButton>
      </div>
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
