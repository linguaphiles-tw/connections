import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import mockTilesData from '../data/mockTileData';
import Game from '../Game';

test('Game renders tiles correctly', () => {
  render(<Game tilesData={mockTilesData} />);

  const tile = screen.getByText('Apple');
  expect(tile).toBeInTheDocument();
});

test('Game updates selected tiles correctly', () => {
  render(<Game tilesData={mockTilesData} />);

  const tile = screen.getByText('Apple');
  fireEvent.click(tile);

  expect(tile).toHaveStyle('background-color: #5a594e');
});

test('Game disables selection of matched tiles', () => {
  render(<Game tilesData={mockTilesData} />);

  const tile1 = screen.getByText('Apple');
  const tile2 = screen.getByText('Banana');
  const tile3 = screen.getByText('Cherry');
  const tile4 = screen.getByText('Date');

  fireEvent.click(tile1);
  fireEvent.click(tile2);
  fireEvent.click(tile3);
  fireEvent.click(tile4);

  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);

  // Cannot reselect matched tiles
  expect(tile1).toHaveClass('disabled');
  expect(tile2).toHaveClass('disabled');
  expect(tile3).toHaveClass('disabled');
  expect(tile4).toHaveClass('disabled');
});

test('Game reduces mistakes on incorrect match', () => {
  render(<Game tilesData={mockTilesData} />);

  const tile1 = screen.getByText('Apple');
  const tile2 = screen.getByText('Lion');
  const tile3 = screen.getByText('Car');
  const tile4 = screen.getByText('Pluto');

  fireEvent.click(tile1);
  fireEvent.click(tile2);
  fireEvent.click(tile3);
  fireEvent.click(tile4);

  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);

  const mistakesText = screen.getByText(/Mistakes Remaining:/i);
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');
});

test('Game shows won status when all tiles are matched', () => {
  render(<Game tilesData={mockTilesData} />);

  const tile1 = screen.getByText('Apple');
  const tile2 = screen.getByText('Banana');
  const tile3 = screen.getByText('Cherry');
  const tile4 = screen.getByText('Date');
  const tile5 = screen.getByText('Lion');
  const tile6 = screen.getByText('Tiger');
  const tile7 = screen.getByText('Elephant');
  const tile8 = screen.getByText('Giraffe');
  const tile9 = screen.getByText('Car');
  const tile10 = screen.getByText('Bus');
  const tile11 = screen.getByText('Bike');
  const tile12 = screen.getByText('Truck');
  const tile13 = screen.getByText('Pluto');
  const tile14 = screen.getByText('Mars');
  const tile15 = screen.getByText('Earth');
  const tile16 = screen.getByText('Venus');

  fireEvent.click(tile1);
  fireEvent.click(tile2);
  fireEvent.click(tile3);
  fireEvent.click(tile4);

  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);
  fireEvent.click(tile5);
  fireEvent.click(tile6);
  fireEvent.click(tile7);
  fireEvent.click(tile8);
  fireEvent.click(submitButton);

  fireEvent.click(tile9);
  fireEvent.click(tile10);
  fireEvent.click(tile11);
  fireEvent.click(tile12);
  fireEvent.click(submitButton);

  fireEvent.click(tile13);
  fireEvent.click(tile14);
  fireEvent.click(tile15);
  fireEvent.click(tile16);
  fireEvent.click(submitButton);

  // No mistakes made
  const mistakesText = screen.getByText(/Mistakes Remaining:/i);
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 5');
});

test('Game shuffles only unmatched tiles correctly', () => {
  render(<Game tilesData={mockTilesData} />);

  const initialTiles = screen.getAllByRole('button').map((tile) => tile.textContent);

  const shuffleButton = screen.getByText('Shuffle');
  fireEvent.click(shuffleButton);

  const shuffledTiles = screen.getAllByRole('button').map((tile) => tile.textContent);

  expect(shuffledTiles).not.toEqual(initialTiles);
});

test('Game deselects all tiles correctly', () => {
  render(<Game tilesData={mockTilesData} />);

  const tile1 = screen.getByText('Apple');
  const tile2 = screen.getByText('Banana');

  fireEvent.click(tile1);
  fireEvent.click(tile2);

  const deselectButton = screen.getByText('Deselect All');
  fireEvent.click(deselectButton);

  expect(tile1).toHaveStyle('background-color: #efefe6');
  expect(tile2).toHaveStyle('background-color: #efefe6');
});

test('Game prevents tile selection when lost', () => {
  render(<Game tilesData={mockTilesData} />);

  const tile1 = screen.getByText('Apple');
  const tile2 = screen.getByText('Banana');
  const tile3 = screen.getByText('Cherry');
  const tile4 = screen.getByText('Date');
  const tile5 = screen.getByText('Lion');
  const tile6 = screen.getByText('Tiger');
  const tile7 = screen.getByText('Elephant');
  const tile8 = screen.getByText('Giraffe');
  const tile10 = screen.getByText('Bus');
  const tile11 = screen.getByText('Bike');
  const tile12 = screen.getByText('Truck');
  const tile14 = screen.getByText('Mars');
  const tile15 = screen.getByText('Earth');

  // Losing all lives
  fireEvent.click(tile1);
  fireEvent.click(tile2);
  fireEvent.click(tile4);
  fireEvent.click(tile5);

  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);

  const mistakesText = screen.getByText(/Mistakes Remaining:/i);
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');

  fireEvent.click(tile3);
  fireEvent.click(tile6);
  fireEvent.click(tile2);
  fireEvent.click(tile7);
  fireEvent.click(submitButton);

  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 3');

  fireEvent.click(tile1);
  fireEvent.click(tile8);
  fireEvent.click(tile4);
  fireEvent.click(tile15);
  fireEvent.click(submitButton);

  fireEvent.click(tile6);
  fireEvent.click(tile14);
  fireEvent.click(tile10);
  fireEvent.click(tile8);
  fireEvent.click(submitButton);

  fireEvent.click(tile11);
  fireEvent.click(tile5);
  fireEvent.click(tile7);
  fireEvent.click(tile12);
  fireEvent.click(submitButton);

  // Lost
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 0');

  // Try to select tile after losing
  fireEvent.click(tile1);
  expect(tile1).toHaveStyle('background-color: #efefe6'); // No change in color
});

test('Game selects 4 tiles, deselects, selects 4 other tiles, and submits', () => {
  render(<Game tilesData={mockTilesData} />);

  const tile1 = screen.getByText('Apple');
  const tile2 = screen.getByText('Lion');
  const tile3 = screen.getByText('Bike');
  const tile4 = screen.getByText('Bus');
  fireEvent.click(tile1);
  fireEvent.click(tile2);
  fireEvent.click(tile3);
  fireEvent.click(tile4);

  // Deselect all tiles
  const deselectButton = screen.getByText('Deselect All');
  fireEvent.click(deselectButton);
  expect(tile1).toHaveStyle('background-color: #efefe6');
  expect(tile2).toHaveStyle('background-color: #efefe6');
  expect(tile3).toHaveStyle('background-color: #efefe6');
  expect(tile4).toHaveStyle('background-color: #efefe6');

  // Reselect and deselect same tiles
  fireEvent.click(tile1);
  fireEvent.click(tile2);
  fireEvent.click(tile3);
  fireEvent.click(tile4);
  fireEvent.click(deselectButton);

  // Select 4 other tiles
  const tile5 = screen.getByText('Earth');
  const tile6 = screen.getByText('Bike');
  const tile7 = screen.getByText('Mars');
  const tile8 = screen.getByText('Bus');

  fireEvent.click(tile5);
  fireEvent.click(tile6);
  fireEvent.click(tile7);
  fireEvent.click(tile8);

  // Click last tile again to deselect
  fireEvent.click(tile8);

  // Select a previously selected tile
  fireEvent.click(tile1);

  // Submit the (incorrect) selected tiles
  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);
  expect(tile5).not.toHaveClass('disabled');
  expect(tile6).not.toHaveClass('disabled');
  expect(tile7).not.toHaveClass('disabled');
  expect(tile1).not.toHaveClass('disabled');
});

test('Game prevents resubmission of previously submitted tiles', () => {
  render(<Game tilesData={mockTilesData} />);

  const mistakesText = screen.getByText(/Mistakes Remaining:/i);
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 5');
  // Select 4 nonmatching tiles
  const tile1 = screen.getByText('Apple');
  const tile2 = screen.getByText('Banana');
  const tile3 = screen.getByText('Mars');
  const tile4 = screen.getByText('Bus');

  fireEvent.click(tile1);
  fireEvent.click(tile2);
  fireEvent.click(tile3);
  fireEvent.click(tile4);
  const submitButton = screen.getByText('Submit');
  fireEvent.click(submitButton);

  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');

  // Try to resubmit the same set of tiles in same order
  fireEvent.click(tile1);
  fireEvent.click(tile2);
  fireEvent.click(tile3);
  fireEvent.click(tile4);
  fireEvent.click(submitButton);

  // Check for the "already selected!" message
  const message = screen.getByText('already selected!');
  expect(message).toBeInTheDocument();

  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');

  expect(tile1).not.toHaveClass('disabled');
  expect(tile2).not.toHaveClass('disabled');
  expect(tile3).not.toHaveClass('disabled');
  expect(tile4).not.toHaveClass('disabled');

  // Try to resubmit the same set of tiles in different order
  fireEvent.click(tile2);
  fireEvent.click(tile4);
  fireEvent.click(tile1);
  fireEvent.click(tile3);
  fireEvent.click(submitButton);

  expect(message).toBeInTheDocument();
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 4');

  expect(tile1).not.toHaveClass('disabled');
  expect(tile2).not.toHaveClass('disabled');
  expect(tile3).not.toHaveClass('disabled');
  expect(tile4).not.toHaveClass('disabled');

  // Submit different set of incorrect tiles
  const tile5 = screen.getByText('Earth');
  const tile6 = screen.getByText('Venus');
  const tile7 = screen.getByText('Date');

  fireEvent.click(tile7);
  fireEvent.click(tile6);
  fireEvent.click(tile2);
  fireEvent.click(tile5);
  fireEvent.click(submitButton);

  expect(message).not.toBeInTheDocument();
  expect(mistakesText).toHaveTextContent('Mistakes Remaining: 3');
});
