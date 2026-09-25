/**
 * ASCII Laboratory - ASCII Art Generator Algorithms Module
 * Generates ASCII art banners from text strings and processes canvas image pixel brightness to ASCII art density grids.
 */

/**
 * Custom ASCII block font dictionary for fast client-side rendering.
 */
const BANNER_FONTS = {
  BLOCKS: {
    'A': [
      ' █████╗ ',
      '██╔══██╗',
      '███████║',
      '██╔══██║',
      '██║  ██║',
      '╚═╝  ╚═╝',
    ],
    'B': [
      '██████╗ ',
      '██╔══██╗',
      '██████╔╝',
      '██╔══██╗',
      '██████╔╝',
      '╚═════╝ ',
    ],
    'C': [
      ' ██████╗',
      '██╔════╝',
      '██║     ',
      '██║     ',
      '╚██████╗',
      ' ╚═════╝',
    ],
    'D': [
      '██████╗ ',
      '██╔══██╗',
      '██║  ██║',
      '██║  ██║',
      '██████╔╝',
      '╚═════╝ ',
    ],
    'E': [
      '███████╗',
      '██╔════╝',
      '█████╗  ',
      '██╔══╝  ',
      '███████╗',
      '╚══════╝',
    ],
    'F': [
      '███████╗',
      '██╔════╝',
      '█████╗  ',
      '██╔══╝  ',
      '██║     ',
      '╚═╝     ',
    ],
    'G': [
      ' ██████╗',
      '██╔════╝',
      '██║  ███╗',
      '██║   ██║',
      '╚██████╔╝',
      ' ╚═════╝',
    ],
    'H': [
      '██╗  ██╗',
      '██║  ██║',
      '███████║',
      '██╔══██║',
      '██║  ██║',
      '╚═╝  ╚═╝',
    ],
    'I': [
      '██╗',
      '██║',
      '██║',
      '██║',
      '██║',
      '╚═╝',
    ],
    'J': [
      '     ██╗',
      '     ██║',
      '     ██║',
      '██   ██║',
      '╚█████╔╝',
      ' ╚════╝ ',
    ],
    'K': [
      '██╗  ██╗',
      '██║ ██╔╝',
      '█████═╝ ',
      '██╔═██╗ ',
      '██║  ██╗',
      '╚═╝  ╚═╝',
    ],
    'L': [
      '██╗     ',
      '██║     ',
      '██║     ',
      '██║     ',
      '███████╗',
      '╚══════╝',
    ],
    'M': [
      '███╗   ███╗',
      '████╗ ████║',
      '██╔████╔██║',
      '██║╚██╔╝██║',
      '██║ ╚═╝ ██║',
      '╚═╝     ╚═╝',
    ],
    'N': [
      '███╗   ██╗',
      '████╗  ██║',
      '██╔██╗ ██║',
      '██║╚██╗██║',
      '██║ ╚████║',
      '╚═╝  ╚═══╝',
    ],
    'O': [
      ' ██████╗ ',
      '██╔═══██╗',
      '██║   ██║',
      '██║   ██║',
      '╚██████╔╝',
      ' ╚═════╝ ',
    ],
    'P': [
      '██████╗ ',
      '██╔══██╗',
      '██████╔╝',
      '██╔═══╝ ',
      '██║     ',
      '╚═╝     ',
    ],
    'Q': [
      ' ██████╗ ',
      '██╔═══██╗',
      '██║   ██║',
      '██║ █╗██║',
      '╚██████╔╝',
      ' ╚═══██╗',
    ],
    'R': [
      '██████╗ ',
      '██╔══██╗',
      '██████╔╝',
      '██╔══██╗',
      '██║  ██║',
      '╚═╝  ╚═╝',
    ],
    'S': [
      '███████╗',
      '██╔════╝',
      '███████╗',
      '╚════██║',
      '███████║',
      '╚══════╝',
    ],
    'T': [
      '████████╗',
      '╚══██╔══╝',
      '   ██║   ',
      '   ██║   ',
      '   ██║   ',
      '   ╚═╝   ',
    ],
    'U': [
      '██╗  ██╗',
      '██║  ██║',
      '██║  ██║',
      '██║  ██║',
      '╚██████╔╝',
      ' ╚═════╝ ',
    ],
    'V': [
      '██╗   ██╗',
      '██║   ██║',
      '██║   ██║',
      '██║   ██║',
      '╚██╗ ██╔╝',
      ' ╚═██╔╝ ',
    ],
    'W': [
      '██╗     ██╗',
      '██║     ██║',
      '██║  █╗ ██║',
      '██║███╗██║',
      '╚███╔███╔╝',
      ' ╚══╝╚══╝ ',
    ],
    'X': [
      '██╗  ██╗',
      '╚██╗██╔╝',
      ' ╚███╔╝ ',
      ' ██╔██╗ ',
      '██╔╝ ██╗',
      '╚═╝  ╚═╝',
    ],
    'Y': [
      '██╗   ██╗',
      '╚██╗ ██╔╝',
      ' ╚████╔╝ ',
      '  ╚██╔╝  ',
      '   ██║   ',
      '   ╚═╝   ',
    ],
    'Z': [
      '███████╗',
      '╚════██║',
      '   ██╔═╝',
      '  ██╔╝  ',
      ' ███████╗',
      ' ╚══════╝',
    ],
    ' ': [
      '    ',
      '    ',
      '    ',
      '    ',
      '    ',
      '    ',
    ],
    '0': [
      ' ██████╗ ',
      '██╔═████╗',
      '██║██╔██║',
      '████╔╝██║',
      '╚██████╔╝',
      ' ╚═════╝ ',
    ],
    '1': [
      '██╗',
      '██║',
      '██║',
      '██║',
      '██║',
      '╚═╝',
    ],
    '!': [
      '██╗',
      '██║',
      '██║',
      '╚═╝',
      '██╗',
      '╚═╝',
    ],
    '?': [
      '██████╗ ',
      '██╔══██╗',
      '  ████╔╝',
      '  ██╔╝  ',
      '  ██║   ',
      '  ╚═╝   ',
    ]
  }
};

/**
 * Converts input text into an ASCII Art Banner string using block letters.
 * 
 * @param {string} text Input text (e.g. "HELLO")
 * @returns {string} Multiline ASCII banner string
 */
export function generateTextAsciiArt(text) {
  if (!text) return '';

  const cleanText = text.toUpperCase().slice(0, 10); // Limit to 10 chars to avoid wrap
  const rows = ['', '', '', '', '', ''];

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const letterGlyph = BANNER_FONTS.BLOCKS[char] || BANNER_FONTS.BLOCKS['?'];

    for (let r = 0; r < 6; r++) {
      rows[r] += letterGlyph[r] + ' ';
    }
  }

  return rows.join('\n');
}

/**
 * Converts image pixel RGBA array into ASCII density characters.
 * Standard luminance equation: Y = 0.299*R + 0.587*G + 0.114*B
 * 
 * @param {Uint8ClampedArray} pixels RGBA image pixel data
 * @param {number} width 
 * @param {number} height 
 * @param {string} charset Character set density string (dark to light)
 * @returns {string} Multiline ASCII image representation
 */
export function convertImagePixelsToAscii(pixels, width, height, charset = '@#S%?*+;:,. ') {
  if (!pixels || width <= 0 || height <= 0) return '';

  const chars = charset.split('');
  const numChars = chars.length;
  let asciiArt = '';

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const r = pixels[offset];
      const g = pixels[offset + 1];
      const b = pixels[offset + 2];

      // Luminance formula
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      const charIdx = Math.floor((brightness / 255) * (numChars - 1));

      line += chars[charIdx];
    }
    asciiArt += line + '\n';
  }

  return asciiArt;
}
