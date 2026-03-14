import React from 'react';
import PropTypes from 'prop-types';

function GameSelector({ setLevel, levels }) {
  return (
    <div className="game-selector flex flex-col items-center">
      <span className="font-bold text-lg text-gray-700 mr-2">關卡選擇</span>
      <div className="levels flex gap-2 justify-center my-4">
        { levels.map((levelName, i) => (
          <button
            // key={`level-${i}`}
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setLevel(i)}
          >
            { }
            第
            {i + 1}
            關
            { }
            {levelName ?? ''}
          </button>
        )) }
      </div>
    </div>
  );
}

GameSelector.propTypes = {
  setLevel: PropTypes.func.isRequired,
  levels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default GameSelector;
