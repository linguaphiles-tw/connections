/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import './styles/SolvedCategory.css';

function SolvedCategory({ tile, className }) {
  return (
    <div
      className={`solvedCategory ${className}`}
      data-category={tile.category}
    >
      <div className="font-bold">{tile.theme}</div>
      <div>
        {tile.words.join(', ')}
      </div>
    </div>
  );
}

SolvedCategory.propTypes = {
  tile: PropTypes.shape({
    category: PropTypes.number.isRequired,
    theme: PropTypes.string.isRequired,
    words: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default SolvedCategory;
