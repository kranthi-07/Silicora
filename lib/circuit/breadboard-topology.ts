/**
 * 3D Lab — Breadboard Physical & Electrical Topology
 * 30-column half-size solderless breadboard (400 tie points)
 * Hole pitch: 2.54mm (0.1 inch standard)
 */

export const BREADBOARD_PITCH = 2.54; // mm
export const BREADBOARD_COLUMNS = 30; // 1 to 30

// Breadboard Origin [0, 0, 0] is centered on the board top surface
export const BREADBOARD_WIDTH = (BREADBOARD_COLUMNS + 2) * BREADBOARD_PITCH; // ~81.3mm
export const BREADBOARD_DEPTH = 55.0; // mm (along Z)
export const BREADBOARD_HEIGHT = 8.5; // mm (along Y)

export type TerminalRowTop = 'a' | 'b' | 'c' | 'd' | 'e';
export type TerminalRowBottom = 'f' | 'g' | 'h' | 'i' | 'j';
export type PowerRailRow = '+' | '-';

export interface BreadboardHole {
  id: string; // e.g. "12c", "+top:12", "-bot:15"
  column: number;
  row: string;
  section: 'terminal_top' | 'terminal_bottom' | 'power_top' | 'power_bottom';
  busId: string; // Unique identifier for the shared internal metal spring clip
  x: number;
  y: number; // 0 is top surface
  z: number;
}

/**
 * Returns the internal spring clip bus ID for any breadboard hole.
 * Holes with identical busId are physically connected inside the breadboard!
 */
export function getBreadboardBusId(section: string, column: number, row: string): string {
  if (section === 'power_top') {
    return row === '+' ? 'BUS_PWR_TOP_POS' : 'BUS_PWR_TOP_NEG';
  }
  if (section === 'power_bottom') {
    return row === '+' ? 'BUS_PWR_BOT_POS' : 'BUS_PWR_BOT_NEG';
  }
  if (section === 'terminal_top') {
    return `BUS_COL_TOP_${column}`;
  }
  if (section === 'terminal_bottom') {
    return `BUS_COL_BOT_${column}`;
  }
  return `BUS_${section}_${column}_${row}`;
}

/**
 * Computes 3D coordinates (mm) for a hole given its column and row.
 */
export function getHolePositionMm(
  section: 'terminal_top' | 'terminal_bottom' | 'power_top' | 'power_bottom',
  column: number,
  row: string
): [number, number, number] {
  // Center column is 15.5
  const x = (column - (BREADBOARD_COLUMNS + 1) / 2) * BREADBOARD_PITCH;
  let z = 0;

  if (section === 'power_top') {
    z = row === '+' ? -22.5 : -19.5;
  } else if (section === 'terminal_top') {
    // Rows e, d, c, b, a: e is closest to center trough (z = -3.81), a is closest to power (z = -13.97)
    const rowIdx = ['e', 'd', 'c', 'b', 'a'].indexOf(row);
    z = -(3.81 + (rowIdx >= 0 ? rowIdx : 0) * BREADBOARD_PITCH);
  } else if (section === 'terminal_bottom') {
    // Rows f, g, h, i, j: f is closest to center trough (z = +3.81), j is closest to bottom power (z = +13.97)
    const rowIdx = ['f', 'g', 'h', 'i', 'j'].indexOf(row);
    z = 3.81 + (rowIdx >= 0 ? rowIdx : 0) * BREADBOARD_PITCH;
  } else if (section === 'power_bottom') {
    z = row === '+' ? 19.5 : 22.5;
  }

  return [Number(x.toFixed(2)), 0.0, Number(z.toFixed(2))];
}

/**
 * Pre-computes all 400 tie-point holes for fast raycasting and snapping.
 */
export function generateBreadboardHoles(): BreadboardHole[] {
  const holes: BreadboardHole[] = [];

  for (let col = 1; col <= BREADBOARD_COLUMNS; col++) {
    // 1. Power Top
    for (const r of ['+', '-']) {
      const [x, y, z] = getHolePositionMm('power_top', col, r);
      holes.push({
        id: `pwr_top_${r}_${col}`,
        column: col,
        row: r,
        section: 'power_top',
        busId: getBreadboardBusId('power_top', col, r),
        x,
        y,
        z,
      });
    }

    // 2. Terminal Top (a, b, c, d, e)
    for (const r of ['a', 'b', 'c', 'd', 'e']) {
      const [x, y, z] = getHolePositionMm('terminal_top', col, r);
      holes.push({
        id: `${col}${r}`,
        column: col,
        row: r,
        section: 'terminal_top',
        busId: getBreadboardBusId('terminal_top', col, r),
        x,
        y,
        z,
      });
    }

    // 3. Terminal Bottom (f, g, h, i, j)
    for (const r of ['f', 'g', 'h', 'i', 'j']) {
      const [x, y, z] = getHolePositionMm('terminal_bottom', col, r);
      holes.push({
        id: `${col}${r}`,
        column: col,
        row: r,
        section: 'terminal_bottom',
        busId: getBreadboardBusId('terminal_bottom', col, r),
        x,
        y,
        z,
      });
    }

    // 4. Power Bottom
    for (const r of ['+', '-']) {
      const [x, y, z] = getHolePositionMm('power_bottom', col, r);
      holes.push({
        id: `pwr_bot_${r}_${col}`,
        column: col,
        row: r,
        section: 'power_bottom',
        busId: getBreadboardBusId('power_bottom', col, r),
        x,
        y,
        z,
      });
    }
  }

  return holes;
}
