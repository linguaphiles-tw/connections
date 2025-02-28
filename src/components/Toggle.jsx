/* eslint-disable jsx-a11y/label-has-associated-control */
// Inspiration: https://dev.to/abbeyperini/an-accessible-dark-mode-toggle-in-react-aop
import React, { useEffect, useState } from 'react';
import './styles/Toggle.css';

// TODO: check localStorage for theme

function Toggle() {
  const darkLabel = 'color mode toggle, dark mode';
  const lightLabel = 'color mode toggle, light mode';
  // false = dark mode
  const [active, setActive] = useState(false);
  // the opposite, for screenreaders
  const [ariaActive, setAriaActive] = useState(true);
  const [ariaLabel, setAriaLabel] = useState(darkLabel);

  const changeTheme = () => {
    if (document.body.classList.contains('dark-mode')) {
      document.body.classList.remove('dark-mode');
      setActive(true);
      setAriaActive(false);
      setAriaLabel(lightLabel);
    } else {
      document.body.classList.add('dark-mode');
      setActive(false);
      setAriaActive(true);
      setAriaLabel(darkLabel);
    }
  };

  const handleOnClick = () => {
    changeTheme();
  };

  const handleKeypress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      changeTheme();
    }
  };

  useEffect(() => {
    if (document.body.classList.contains('dark-mode')) {
      setActive(false);
      setAriaActive(true);
      setAriaLabel(darkLabel);
    } else {
      setActive(true);
      setAriaActive(false);
      setAriaLabel(lightLabel);
    }
  }, []);

  return (
    <div className="container--toggle" title="color mode toggle">
      <input
        role="switch"
        aria-checked={ariaActive}
        onKeyDown={handleKeypress}
        type="checkbox"
        id="toggle"
        className="toggle--checkbox"
        onClick={handleOnClick}
        checked={active}
        readOnly
      />
      <label htmlFor="toggle" className="toggle--label" aria-label={ariaLabel}>
        <span className="toggle--label-background" />
      </label>
    </div>
  );
}

export default Toggle;
