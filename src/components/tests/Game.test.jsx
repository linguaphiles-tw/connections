import React from 'react';
import {
  render, screen, fireEvent, waitFor, act,
} from '@testing-library/react';
import mockTilesData from '../data/mockTileData';
import Game from '../Game';

// TODO: using hard-coded mock data - change to dynamic data
let submitButton;
let getMistakesCount;

const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

beforeEach(() => {
  render(<Game tilesData={mockTilesData} />);
  submitButton = screen.getByText('Submit');
  getMistakesCount = () => screen.queryAllByTestId('mistake').length;
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

test('Game disables selection of matched tiles', async () => {
  ['Apple', 'Banana', 'Cherry', 'Date'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  // Cannot reselect matched tiles
  ['Apple', 'Banana', 'Cherry', 'Date'].forEach((word) => {
    expect(screen.getByText(word)).toHaveClass('disabled');
  });
});

test('Game reduces mistakes on incorrect match', async () => {
  ['Apple', 'Lion', 'Car', 'Pluto'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  expect(getMistakesCount()).toBe(3);
});

test('Game shows won status when all tiles are matched', async () => {
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
  expect(getMistakesCount()).toBe(4);
});

test('Game deselects all tiles correctly', async () => {
  fireEvent.click(screen.getByText('Apple'));
  fireEvent.click(screen.getByText('Banana'));
  fireEvent.click(screen.getByText('Deselect All'));

  expect(screen.getByText('Apple')).toHaveStyle('background-color: #efefe6');
  expect(screen.getByText('Banana')).toHaveStyle('background-color: #efefe6');
});

test('Game prevents tile selection when lost', async () => {
  ['Apple', 'Banana', 'Date', 'Lion'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });
  expect(getMistakesCount()).toBe(3);

  fireEvent.click(screen.getByText('Deselect All'));
  ['Cherry', 'Tiger', 'Banana', 'Elephant'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  expect(getMistakesCount()).toBe(2);
  fireEvent.click(screen.getByText('Deselect All'));

  ['Apple', 'Giraffe', 'Date', 'Earth'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });
  expect(getMistakesCount()).toBe(1);
  fireEvent.click(screen.getByText('Deselect All'));

  ['Tiger', 'Mars', 'Bus', 'Giraffe'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });
  expect(getMistakesCount()).toBe(0);

  // Try to select tile after losing
  const tile = screen.getByText('Apple');
  fireEvent.click(tile);
  expect(tile).toHaveStyle('background-color: #efefe6');
}, 9000);

test('Game selects 4 tiles, deselects, selects 4 other tiles, and submits', async () => {
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
  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  ['Earth', 'Bike', 'Mars', 'Apple'].forEach((word) => {
    expect(screen.getByText(word)).not.toHaveClass('disabled');
  });
});

test('Game prevents resubmission of previously submitted tiles', async () => {
  expect(getMistakesCount()).toBe(4);
  // Select 4 nonmatching tiles
  ['Apple', 'Banana', 'Mars', 'Bus'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  const deselectButton = screen.getByText('Deselect All');
  fireEvent.click(deselectButton);

  expect(getMistakesCount()).toBe(3);

  // Try to resubmit the same set of tiles in same order
  ['Apple', 'Banana', 'Mars', 'Bus'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  // Wait for the "Already selected!" alert to appear
  await waitFor(() => {
    const alert = screen.getByText('Already selected!');
    expect(alert).toBeInTheDocument();
  });

  expect(getMistakesCount()).toBe(3);

  ['Apple', 'Banana', 'Mars', 'Bus'].forEach((word) => {
    expect(screen.getByText(word)).not.toHaveClass('disabled');
  });

  // Try to resubmit the same set of tiles in different order
  ['Banana', 'Bus', 'Apple', 'Mars'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  // Wait for the "Already selected!" alert to appear
  await waitFor(() => {
    const alert = screen.getByText('Already selected!');
    expect(alert).toBeInTheDocument();
  });

  expect(getMistakesCount()).toBe(3);

  ['Apple', 'Banana', 'Mars', 'Bus'].forEach((word) => {
    expect(screen.getByText(word)).not.toHaveClass('disabled');
  });

  fireEvent.click(deselectButton);

  // Submit different set of incorrect tiles and decrement mistakes
  ['Earth', 'Venus', 'Date', 'Banana'].forEach((word) => {
    fireEvent.click(screen.getByText(word));
  });

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  expect(getMistakesCount()).toBe(2);
}, 10000);

test('Matched tiles are moved to the top of the grid immediately after being matched', async () => {
  // Select and submit a group of tiles to mark them as matched
  const matchedGroup = ['Apple', 'Banana', 'Cherry', 'Date'];
  matchedGroup.forEach((word) => fireEvent.click(screen.getByText(word)));

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  // Get the positions of all tiles after matching
  const tilesAfterMatch = screen.getAllByRole('button').map((tile) => tile.textContent);

  // Ensure matched tiles are at the top
  matchedGroup.forEach((word, index) => {
    expect(tilesAfterMatch[index]).toBe(word);
  });
});

test('Unmatched tiles remain in their positions relative to each other after a match is made', async () => {
  // Get the initial positions of all tiles
  const initialTiles = screen.getAllByRole('button').map((tile) => tile.textContent);

  // Select and submit a group of tiles to mark them as matched
  const matchedGroup = ['Apple', 'Banana', 'Cherry', 'Date'];
  matchedGroup.forEach((word) => fireEvent.click(screen.getByText(word)));

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  // Get the positions of all tiles after matching
  const tilesAfterMatch = screen.getAllByRole('button').map((tile) => tile.textContent);

  // Ensure unmatched tiles remain in their positions relative to each other
  const unmatchedTilesInitial = initialTiles.filter((word) => !matchedGroup.includes(word));
  const unmatchedTilesAfterMatch = tilesAfterMatch.slice(matchedGroup.length);
  expect(unmatchedTilesAfterMatch).toEqual(unmatchedTilesInitial);
});

test('Shuffling only affects unmatched tiles and keeps matched tiles at the top', async () => {
  // Select and submit a group of tiles to mark them as matched
  const matchedGroup = ['Apple', 'Banana', 'Cherry', 'Date'];
  matchedGroup.forEach((word) => fireEvent.click(screen.getByText(word)));

  await act(async () => {
    fireEvent.click(submitButton);
    await delay(2000);
  });

  // Get the positions of all tiles after matching
  const tilesAfterMatch = screen.getAllByRole('button').map((tile) => tile.textContent);

  // Click the shuffle button
  const shuffleButton = screen.getByText('Shuffle');
  fireEvent.click(shuffleButton);

  // Get the positions of all tiles after shuffling
  const tilesAfterShuffle = screen.getAllByRole('button').map((tile) => tile.textContent);

  // Ensure matched tiles remain at the top
  matchedGroup.forEach((word, index) => {
    expect(tilesAfterShuffle[index]).toBe(word);
  });

  // Ensure unmatched tiles are shuffled
  const unmatchedTilesAfterMatch = tilesAfterMatch.slice(matchedGroup.length);
  const unmatchedTilesAfterShuffle = tilesAfterShuffle.slice(matchedGroup.length);
  expect(unmatchedTilesAfterShuffle).not.toEqual(unmatchedTilesAfterMatch);
});

/* TODO tests
- can't submit less than 4 tiles
- tiles can be submitted on enter/space
*/
