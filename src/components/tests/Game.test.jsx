import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import mockTilesData from '../data/mockTileData';
import Game from '../Game';

// TODO: using hard-coded mock data - change to dynamic data
let submitButton;
let mistakesText;

beforeEach(() => {
  render(<Game tilesData={mockTilesData} />);
  submitButton = screen.getByText('Submit');
  mistakesText = screen.getByText(/Mistakes Remaining:/i);
});

test('Game renders tiles correctly', () => {
  const tile = screen.getByText('Apple');
  expect(tile).toBeInTheDocument();
});

test('Game updates selected tiles correctly', () => {
  const tile = screen.getByText('Apple');
  fireEvent.click(tile);
  expect(tile).toHaveStyle('background-color: #5a594e');
});

test('Game disables selection of matched tiles', () => {
  ['Apple', 'Banana', 'Cherry', 'Date'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);

  // Cannot reselect matched tiles
  ['Apple', 'Banana', 'Cherry', 'Date'].forEach((word) => {
    expect(screen.getByText(word)).toHaveClass('disabled');
  });
});

test('Game reduces mistakes on incorrect match', () => {
  ['Apple', 'Lion', 'Car', 'Pluto'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);

  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');
});

test('Game shows won status when all tiles are matched', () => {
  const groups = [
    ['Apple', 'Banana', 'Cherry', 'Date'],
    ['Lion', 'Tiger', 'Elephant', 'Giraffe'],
    ['Car', 'Bus', 'Bike', 'Truck'],
    ['Pluto', 'Mars', 'Earth', 'Venus'],
  ];

  groups.forEach((group) => {
    group.forEach((word) => fireEvent.click(screen.getByText(word)));
    fireEvent.click(screen.getByText('Submit'));
  });

  // No mistakes made
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 5');
});

test('Game deselects all tiles correctly', () => {
  fireEvent.click(screen.getByText('Apple'));
  fireEvent.click(screen.getByText('Banana'));

  fireEvent.click(screen.getByText('Deselect All'));

  expect(screen.getByText('Apple')).toHaveStyle('background-color: #efefe6');
  expect(screen.getByText('Banana')).toHaveStyle('background-color: #efefe6');
});

test('Game prevents tile selection when lost', () => {
  ['Apple', 'Banana', 'Date', 'Lion'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');

  ['Cherry', 'Tiger', 'Banana', 'Elephant'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 3');

  ['Apple', 'Giraffe', 'Date', 'Earth'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 2');

  ['Tiger', 'Mars', 'Bus', 'Giraffe'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 1');

  ['Bike', 'Lion', 'Elephant', 'Truck'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);

  // Lost
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 0');

  // Try to select tile after losing
  const tile = screen.getByText('Apple');
  fireEvent.click(tile);
  expect(tile).toHaveStyle('background-color: #efefe6');
});

test('Game selects 4 tiles, deselects, selects 4 other tiles, and submits', () => {
  ['Apple', 'Lion', 'Bike', 'Bus'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  // Deselect all tiles
  const deselectButton = screen.getByText('Deselect All');
  fireEvent.click(deselectButton);

  ['Apple', 'Lion', 'Bike', 'Bus'].forEach((word) => {
    expect(screen.getByText(word)).toHaveStyle('background-color: #efefe6');
  });

  // Reselect and deselect same tiles
  ['Apple', 'Lion', 'Bike', 'Bus'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });
  fireEvent.click(deselectButton);

  // Select 4 other tiles
  ['Earth', 'Bike', 'Mars', 'Bus'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  // Click last tile again to deselect
  fireEvent.click(screen.getByText('Bus'));

  // Select a previously selected tile
  fireEvent.click(screen.getByText('Apple'));

  // Submit the (incorrect) selected tiles
  fireEvent.click(submitButton);
  ['Earth', 'Bike', 'Mars', 'Apple'].forEach((word) => {
    expect(screen.getByText(word)).not.toHaveClass('disabled');
  });
});

test('Game prevents resubmission of previously submitted tiles', () => {
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 5');
  // Select 4 nonmatching tiles
  ['Apple', 'Banana', 'Mars', 'Bus'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);

  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');

  // Try to resubmit the same set of tiles in same order
  ['Apple', 'Banana', 'Mars', 'Bus'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);

  // Check for the "already selected!" message
  const message = screen.getByText('already selected!');
  expect(message).toBeInTheDocument();

  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');

  ['Apple', 'Banana', 'Mars', 'Bus'].forEach((word) => {
    expect(screen.getByText(word)).not.toHaveClass('disabled');
  });

  // Try to resubmit the same set of tiles in different order
  ['Banana', 'Bus', 'Apple', 'Mars'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);

  expect(message).toBeInTheDocument();
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');

  ['Apple', 'Banana', 'Mars', 'Bus'].forEach((word) => {
    expect(screen.getByText(word)).not.toHaveClass('disabled');
  });

  // Submit different set of incorrect tiles
  ['Earth', 'Venus', 'Date', 'Banana'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  fireEvent.click(submitButton);

  expect(message).not.toBeInTheDocument();
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 3');
});

// TODO: test shuffle functionality
// TODO: test matched tiles moving to top of grid
