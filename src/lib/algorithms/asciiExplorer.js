/**
 * ASCII Laboratory - ASCII Explorer & Dataset Module
 * Provides comprehensive ASCII table definitions (0-127 & 128-255) and search algorithms.
 */

/**
 * Control Character descriptive mapping dictionary.
 */
export const ASCII_CONTROL_NAMES = {
  0: { codeName: 'NUL', description: 'Null character' },
  1: { codeName: 'SOH', description: 'Start of Header' },
  2: { codeName: 'STX', description: 'Start of Text' },
  3: { codeName: 'ETX', description: 'End of Text' },
  4: { codeName: 'EOT', description: 'End of Transmission' },
  5: { codeName: 'ENQ', description: 'Enquiry' },
  6: { codeName: 'ACK', description: 'Acknowledge' },
  7: { codeName: 'BEL', description: 'Bell / Alert' },
  8: { codeName: 'BS', description: 'Backspace' },
  9: { codeName: 'HT', description: 'Horizontal Tab' },
  10: { codeName: 'LF', description: 'Line Feed / Newline' },
  11: { codeName: 'VT', description: 'Vertical Tab' },
  12: { codeName: 'FF', description: 'Form Feed' },
  13: { codeName: 'CR', description: 'Carriage Return' },
  14: { codeName: 'SO', description: 'Shift Out' },
  15: { codeName: 'SI', description: 'Shift In' },
  16: { codeName: 'DLE', description: 'Data Link Escape' },
  17: { codeName: 'DC1', description: 'Device Control 1 (XON)' },
  18: { codeName: 'DC2', description: 'Device Control 2' },
  19: { codeName: 'DC3', description: 'Device Control 3 (XOFF)' },
  20: { codeName: 'DC4', description: 'Device Control 4' },
  21: { codeName: 'NAK', description: 'Negative Acknowledge' },
  22: { codeName: 'SYN', description: 'Synchronous Idle' },
  23: { codeName: 'ETB', description: 'End of Transmission Block' },
  24: { codeName: 'CAN', description: 'Cancel' },
  25: { codeName: 'EM', description: 'End of Medium' },
  26: { codeName: 'SUB', description: 'Substitute' },
  27: { codeName: 'ESC', description: 'Escape' },
  28: { codeName: 'FS', description: 'File Separator' },
  29: { codeName: 'GS', description: 'Group Separator' },
  30: { codeName: 'RS', description: 'Record Separator' },
  31: { codeName: 'US', description: 'Unit Separator' },
  32: { codeName: 'SPC', description: 'Space' },
  127: { codeName: 'DEL', description: 'Delete' },
};

/**
 * Determines category of a given ASCII decimal code.
 * @param {number} code 
 * @returns {string} Category tag
 */
export function getAsciiCategory(code) {
  if (code >= 0 && code <= 31) return 'CONTROL';
  if (code === 32) return 'CONTROL'; // Space
  if (code >= 48 && code <= 57) return 'DIGITS';
  if (code >= 65 && code <= 90) return 'UPPERCASE';
  if (code >= 97 && code <= 122) return 'LOWERCASE';
  if (code === 127) return 'CONTROL';
  if (code > 32 && code < 127) return 'SYMBOLS';
  return 'EXTENDED';
}

/**
 * Generates the complete dataset array of ASCII records (0-255).
 * @returns {Array<Object>} List of ASCII records
 */
export function generateAsciiTable() {
  const table = [];

  for (let i = 0; i <= 127; i++) {
    const category = getAsciiCategory(i);
    const binary = i.toString(2).padStart(8, '0');
    const hex = i.toString(16).toUpperCase().padStart(2, '0');
    const octal = i.toString(8).padStart(3, '0');

    let charDisplay = String.fromCharCode(i);
    let name = `Character '${charDisplay}'`;
    let codeName = charDisplay;

    if (ASCII_CONTROL_NAMES[i]) {
      codeName = ASCII_CONTROL_NAMES[i].codeName;
      name = ASCII_CONTROL_NAMES[i].description;
      charDisplay = codeName;
    }

    table.push({
      code: i,
      char: String.fromCharCode(i),
      charDisplay,
      codeName,
      name,
      category,
      binary,
      hex,
      octal,
      htmlEntity: `&#${i};`,
    });
  }

  return table;
}

/**
 * Filters the ASCII dataset by search term and category tag.
 * Implements case-insensitive matching across Decimal, Char, Binary, Hex, and Category.
 * 
 * @param {Array<Object>} table ASCII dataset array
 * @param {string} query Search input string
 * @param {string} categoryFilter Filter tag ('ALL', 'CONTROL', 'DIGITS', 'UPPERCASE', 'LOWERCASE', 'SYMBOLS')
 * @returns {Array<Object>} Filtered array
 */
export function searchAsciiTable(table, query = '', categoryFilter = 'ALL') {
  if (!table || !Array.isArray(table)) return [];

  const cleanQuery = query.trim().toLowerCase();

  return table.filter(item => {
    // Category match
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
      return false;
    }

    // Query match
    if (!cleanQuery) return true;

    const matchesCode = item.code.toString() === cleanQuery;
    const matchesChar = item.char.toLowerCase() === cleanQuery || item.charDisplay.toLowerCase() === cleanQuery;
    const matchesBinary = item.binary.includes(cleanQuery);
    const matchesHex = item.hex.toLowerCase().includes(cleanQuery);
    const matchesOctal = item.octal.includes(cleanQuery);
    const matchesName = item.name.toLowerCase().includes(cleanQuery);
    const matchesCodeName = item.codeName.toLowerCase().includes(cleanQuery);

    return matchesCode || matchesChar || matchesBinary || matchesHex || matchesOctal || matchesName || matchesCodeName;
  });
}

/**
 * Calculates category breakdown statistics for the ASCII dataset.
 * @param {Array<Object>} table 
 * @returns {Object} Category counts
 */
export function getCategoryStats(table) {
  const stats = {
    TOTAL: table.length,
    CONTROL: 0,
    DIGITS: 0,
    UPPERCASE: 0,
    LOWERCASE: 0,
    SYMBOLS: 0,
    EXTENDED: 0,
  };

  table.forEach(item => {
    if (stats[item.category] !== undefined) {
      stats[item.category]++;
    }
  });

  return stats;
}
