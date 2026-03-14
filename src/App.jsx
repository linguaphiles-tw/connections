import React, { useState } from 'react';
import Game from './components/Game';
// import mockTilesData from './components/data/mockTileData';
import GameSelector from './components/GameSelector';
import chineseTileData from './components/data/chineseTileData';

function App() {
  const [levelNum, setLevelNum] = useState(undefined);
  const allLevels = chineseTileData;
  const allLevelNames = allLevels.map((level) => level.levelName);
  return (
    <div className="App">
      {
        levelNum === undefined
          ? <GameSelector setLevel={setLevelNum} levels={allLevelNames} />
          : <Game allLevels={allLevels} level={levelNum} />
      }
    </div>
  );
}

export default App;
