/**
 * ASCII Laboratory - Decoding Algorithms Module
 * Handles Binary/Hex/Octal/Decimal to ASCII Character conversion and validation.
 */

/**
 * Non-printable ASCII character label mapping for readable output.
 */
export const CONTROL_CHAR_MAP = {
  0: '[NUL] Null',
  1: '[SOH] Start of Heading',
  2: '[STX] Start of Text',
  3: '[ETX] End of Text',
  4: '[EOT] End of Transmission',
  5: '[ENQ] Enquiry',
  6: '[ACK] Acknowledge',
  7: '[BEL] Bell',
  8: '[BS] Backspace',
  9: '[TAB] Horizontal Tab',
  10: '[LF] Line Feed',
  11: '[VT] Vertical Tab',
  12: '[FF] Form Feed',
  13: '[CR] Carriage Return',
  27: '[ESC] Escape',
  32: '[SPACE]',
  127: '[DEL] Delete',
};

/**
 * Converts a decimal ASCII code to its string representation.
 * @param {number} code ASCII code (0-255)
 * @returns {string} Character or descriptive label if non-printable
 */
export function asciiToChar(code) {
  const num = Math.floor(Number(code));
  if (isNaN(num) || num < 0 || num > 255) return '';
  if (CONTROL_CHAR_MAP[num]) {
    return num === 32 ? ' ' : String.fromCharCode(num);
  }
  return String.fromCharCode(num);
}

/**
 * Formats character display for UI labels.
 * @param {number} code 
 * @returns {string} Readable display string
 */
export function getFormattedCharLabel(code) {
  const num = Math.floor(Number(code));
  if (CONTROL_CHAR_MAP[num]) {
    return CONTROL_CHAR_MAP[num];
  }
  return `'${String.fromCharCode(num)}'`;
}

/**
 * Converts a single 8-bit binary string to decimal ASCII code.
 * @param {string} binaryStr 8-bit binary string (e.g. "01000001")
 * @returns {number} Decimal ASCII code
 */
export function binaryToAscii(binaryStr) {
  const cleanStr = binaryStr.replace(/[^01]/g, '');
  if (!cleanStr) return 0;
  return parseInt(cleanStr, 2);
}

/**
 * Decodes a space-separated or chunked Binary message into plain text.
 * Example input: "01001000 01100101 01101100 01101100 01101111" -> "Hello"
 * 
 * @param {string} input Binary string
 * @returns {Object} { text: string, tokens: Array<Object>, isValid: boolean, error: string|null }
 */
export function decodeBinaryMessage(input) {
  if (!input || typeof input !== 'string') {
    return { text: '', tokens: [], isValid: true, error: null };
  }

  const rawInput = input.trim();
  let chunks = [];

  if (rawInput.includes(' ')) {
    chunks = rawInput.split(/\s+/);
  } else {
    // If no spaces, split into 8-bit chunks automatically
    const cleanBits = rawInput.replace(/[^01]/g, '');
    for (let i = 0; i < cleanBits.length; i += 8) {
      chunks.push(cleanBits.slice(i, i + 8));
    }
  }

  const tokens = [];
  let decodedText = '';
  let isValid = true;
  let errorMsg = null;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const cleanChunk = chunk.replace(/[^01]/g, '');

    if (cleanChunk.length === 0) continue;

    if (cleanChunk.length > 8) {
      isValid = false;
      errorMsg = `Chunk ${i + 1} ("${chunk}") exceeds 8 bits.`;
    }

    const ascii = parseInt(cleanChunk, 2);
    const char = String.fromCharCode(ascii);

    tokens.push({
      original: chunk,
      cleanBinary: cleanChunk.padStart(8, '0'),
      ascii,
      hex: ascii.toString(16).toUpperCase().padStart(2, '0'),
      char,
      isValid: !isNaN(ascii) && cleanChunk.length <= 8,
    });

    decodedText += char;
  }

  return {
    text: decodedText,
    tokens,
    isValid,
    error: errorMsg,
  };
}

/**
 * Decodes Hexadecimal formatted text into plain text.
 * Example input: "48 65 6C 6C 6F" or "48656C6C6F" -> "Hello"
 * 
 * @param {string} hexInput 
 * @returns {Object} { text: string, tokens: Array<Object> }
 */
export function decodeHexMessage(hexInput) {
  if (!hexInput) return { text: '', tokens: [] };

  const cleanHex = hexInput.replace(/[^0-9a-fA-F]/g, '');
  const tokens = [];
  let text = '';

  for (let i = 0; i < cleanHex.length; i += 2) {
    const hexPair = cleanHex.slice(i, i + 2);
    if (hexPair.length < 2) continue;

    const ascii = parseInt(hexPair, 16);
    const char = String.fromCharCode(ascii);
    const binary = ascii.toString(2).padStart(8, '0');

    tokens.push({
      hex: hexPair.toUpperCase(),
      ascii,
      binary,
      char,
    });

    text += char;
  }

  return { text, tokens };
}

/**
 * Auto-detects whether an input string is Binary, Hex, or Decimal and decodes it.
 * 
 * @param {string} input Raw text input
 * @returns {Object} Decoded result with format metadata
 */
export function autoDecode(input) {
  if (!input || !input.trim()) {
    return { type: 'unknown', text: '', tokens: [] };
  }

  const trimmed = input.trim();
  const binaryOnly = /^[01\s]+$/;
  const hexOnly = /^[0-9a-fA-F\s]+$/;
  const decimalOnly = /^[0-9\s,]+$/;

  if (binaryOnly.test(trimmed) && (trimmed.includes('0') || trimmed.includes('1'))) {
    const res = decodeBinaryMessage(trimmed);
    return { type: 'binary', text: res.text, tokens: res.tokens };
  }

  if (decimalOnly.test(trimmed)) {
    const nums = trimmed.split(/[\s,]+/).filter(Boolean);
    let text = '';
    const tokens = nums.map(n => {
      const ascii = Math.min(255, Math.max(0, parseInt(n, 10) || 0));
      const char = String.fromCharCode(ascii);
      text += char;
      return {
        ascii,
        binary: ascii.toString(2).padStart(8, '0'),
        hex: ascii.toString(16).toUpperCase().padStart(2, '0'),
        char,
      };
    });
    return { type: 'decimal', text, tokens };
  }

  if (hexOnly.test(trimmed)) {
    const res = decodeHexMessage(trimmed);
    return { type: 'hex', text: res.text, tokens: res.tokens };
  }

  return { type: 'text', text: trimmed, tokens: [] };
}
