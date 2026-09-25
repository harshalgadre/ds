/**
 * ASCII Laboratory - Secret Message & Puzzle Algorithms Module
 * Encodes messages into ASCII binary/hex streams and provides "Decode This" puzzle challenges.
 */

import { asciiToBinary, asciiToHex, charToAscii } from './asciiEncoder';
import { decodeBinaryMessage, decodeHexMessage } from './asciiDecoder';

export const ENCODING_FORMATS = {
  BINARY: 'BINARY',
  HEX: 'HEX',
  DECIMAL: 'DECIMAL',
};

/**
 * Encodes text into a space-separated string format.
 * @param {string} text Input text
 * @param {string} format BINARY | HEX | DECIMAL
 * @returns {string} Formatted encoded string
 */
export function encodeSecretMessage(text, format = ENCODING_FORMATS.BINARY) {
  if (!text) return '';

  const charArray = text.split('');

  switch (format) {
    case ENCODING_FORMATS.HEX:
      return charArray.map(c => asciiToHex(charToAscii(c))).join(' ');
    case ENCODING_FORMATS.DECIMAL:
      return charArray.map(c => charToAscii(c)).join(' ');
    case ENCODING_FORMATS.BINARY:
    default:
      return charArray.map(c => asciiToBinary(charToAscii(c))).join(' ');
  }
}

/**
 * Decodes an encoded secret string back into original text.
 * @param {string} encodedText Space-separated encoded text
 * @param {string} format BINARY | HEX | DECIMAL
 * @returns {string} Recovered original text
 */
export function decodeSecretMessage(encodedText, format = ENCODING_FORMATS.BINARY) {
  if (!encodedText) return '';

  switch (format) {
    case ENCODING_FORMATS.HEX: {
      const res = decodeHexMessage(encodedText);
      return res.text;
    }
    case ENCODING_FORMATS.DECIMAL: {
      const parts = encodedText.trim().split(/[\s,]+/);
      return parts.map(p => {
        const val = parseInt(p, 10);
        return isNaN(val) ? '' : String.fromCharCode(val);
      }).join('');
    }
    case ENCODING_FORMATS.BINARY:
    default: {
      const res = decodeBinaryMessage(encodedText);
      return res.text;
    }
  }
}

/**
 * Pre-curated puzzles for "Decode This" challenge mode.
 */
export const PUZZLE_LIST = [
  {
    id: 'p1',
    title: 'Secret Greeting',
    encoded: '01001000 01101001',
    solution: 'Hi',
    hint: '2 letters: A common friendly English greeting.',
    category: 'Easy',
  },
  {
    id: 'p2',
    title: 'Agent Code Name',
    encoded: '01000001 01010011 01000011 01001001 01001001',
    solution: 'ASCII',
    hint: '5 letters: The name of American Standard Code for Information Interchange.',
    category: 'Medium',
  },
  {
    id: 'p3',
    title: 'Laboratory Location',
    encoded: '01001101 01000101 01000101 01010100 00100000 01000001 01010100 00100000 00110101',
    solution: 'MEET AT 5',
    hint: 'Rendezvous instructions with a number at the end.',
    category: 'Medium',
  },
  {
    id: 'p4',
    title: 'Developer Motto',
    encoded: '01000011 01101111 01100100 01100101',
    solution: 'Code',
    hint: '4 letters: What computer programmers write every day.',
    category: 'Easy',
  },
  {
    id: 'p5',
    title: 'Hex Secret',
    encoded: '4E 45 58 54 2E 4A 53',
    format: ENCODING_FORMATS.HEX,
    solution: 'NEXT.JS',
    hint: '7 characters: The modern React Framework powering this app!',
    category: 'Hard',
  }
];

/**
 * Retrieves a random puzzle from the puzzle list.
 */
export function getRandomPuzzle() {
  const index = Math.floor(Math.random() * PUZZLE_LIST.length);
  return PUZZLE_LIST[index];
}
