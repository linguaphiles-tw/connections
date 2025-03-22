/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import './styles/Tile.css';

function Tile({
  word, colors, onSelect, disabled,
}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`tile ${disabled ? 'disabled' : ''}`}
      style={{ backgroundColor: colors[0], color: colors[1] }}
      aria-disabled={disabled}
    >
      {word}
    </div>
  );
}

Tile.propTypes = {
  word: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
};

export default Tile;
