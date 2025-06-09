import React from 'react';
import Game from './components/Game';
import mockTilesData from './components/data/mockTileData';

function App() {
  const tilesData = mockTilesData.flatMap((theme) => theme.words.map((word) => ({
    word,
    theme: theme.theme,
    category: theme.category,
    colors: theme.colors,
  })));
  return (
    <div className="App">
      <Game tilesData={tilesData} />
    </div>
  );
}

export default App;
