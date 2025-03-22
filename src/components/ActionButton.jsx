/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import './styles/ActionButton.css';

function ActionButton({
  onClick, disabled, children, ariaLabel,
}) {
  return (
    <button
      type="button"
      className={`action_button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
};

export default ActionButton;
