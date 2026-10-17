export const GRID_CONFIG = {
  ROWS: 5,
  COLS: 9,
  BOARD_WIDTH: 900,
  BOARD_HEIGHT: 500,
  CELL_WIDTH: 100,
  CELL_HEIGHT: 100,
  LAWN_START_X: 50,
  LAWN_START_Y: 0,
};

export function getCellCenter(row, col) {
  return {
    x: GRID_CONFIG.LAWN_START_X + col * GRID_CONFIG.CELL_WIDTH + GRID_CONFIG.CELL_WIDTH / 2,
    y: GRID_CONFIG.LAWN_START_Y + row * GRID_CONFIG.CELL_HEIGHT + GRID_CONFIG.CELL_HEIGHT / 2,
  };
}

export function getGridFromPixel(x, y) {
  const col = Math.floor((x - GRID_CONFIG.LAWN_START_X) / GRID_CONFIG.CELL_WIDTH);
  const row = Math.floor((y - GRID_CONFIG.LAWN_START_Y) / GRID_CONFIG.CELL_HEIGHT);

  if (row >= 0 && row < GRID_CONFIG.ROWS && col >= 0 && col < GRID_CONFIG.COLS) {
    return { row, col };
  }
  return null;
}
