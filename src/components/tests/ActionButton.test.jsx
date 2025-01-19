import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from '../ActionButton';

test('ActionButton renders correctly', () => {
  render(<ActionButton onClick={() => {}}>Click Me</ActionButton>);
  const button = screen.getByText('Click Me');
  expect(button).toBeInTheDocument();
});

test('ActionButton can be clicked', () => {
  const handleClick = jest.fn();
  render(<ActionButton onClick={handleClick}>Click Me</ActionButton>);
  const button = screen.getByText('Click Me');
  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('ActionButton cannot be clicked when disabled', () => {
  const handleClick = jest.fn();
  render(<ActionButton onClick={handleClick} disabled>Click Me</ActionButton>);
  const button = screen.getByText('Click Me');
  fireEvent.click(button);
  expect(handleClick).not.toHaveBeenCalled();
});

test('ActionButton handles empty children correctly', () => {
  render(<ActionButton onClick={() => {}}> </ActionButton>);
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});

test('ActionButton handles rapid clicks correctly', () => {
  const handleClick = jest.fn();
  render(<ActionButton onClick={handleClick}>Click Me</ActionButton>);
  const button = screen.getByText('Click Me');
  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(3);
});
