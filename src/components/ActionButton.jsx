/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import './styles/ActionButton.css';

function ActionButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      className={`action_button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ActionButton;
