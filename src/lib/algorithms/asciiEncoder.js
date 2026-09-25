/**
 * ASCII Laboratory - Encoding Algorithms Module
 * Handles Character to ASCII, Binary, Hex, Octal conversions and Bit Breakdown calculations.
 */

/**
 * Converts a single character to its ASCII decimal code.
 * @param {string} char 
 * @returns {number} Decimal ASCII code (0-255)
 */
export function charToAscii(char) {
  if (!char || char.length === 0) return 0;
  return char.charCodeAt(0);
}

/**
 * Converts a decimal ASCII number to an 8-bit binary string.
 * @param {number} asciiValue 
 * @param {number} bits Default 8
 * @returns {string} 8-bit binary string (e.g. "01000001")
 */
export function asciiToBinary(asciiValue, bits = 8) {
  const num = Math.max(0, Math.min(255, Math.floor(Number(asciiValue) || 0)));
  return num.toString(2).padStart(bits, '0');
}

/**
 * Converts a decimal ASCII number to a 2-digit uppercase Hexadecimal string.
 * @param {number} asciiValue 
 * @returns {string} Hex string (e.g. "41")
 */
export function asciiToHex(asciiValue) {
  const num = Math.max(0, Math.min(255, Math.floor(Number(asciiValue) || 0)));
  return num.toString(16).toUpperCase().padStart(2, '0');
}

/**
 * Converts a decimal ASCII number to an Octal string.
 * @param {number} asciiValue 
 * @returns {string} Octal string (e.g. "101")
 */
export function asciiToOctal(asciiValue) {
  const num = Math.max(0, Math.min(255, Math.floor(Number(asciiValue) || 0)));
  return num.toString(8).padStart(3, '0');
}

/**
 * Encodes an entire string into an array of detailed character transformation objects.
 * Useful for pipeline rendering and step-by-step visualizations.
 * 
 * @param {string} text Input string
 * @returns {Array<Object>} List of character transformation data
 */
export function encodeTextToPipeline(text) {
  if (!text) return [];

  return text.split('').map((char, index) => {
    const ascii = charToAscii(char);
    const binary = asciiToBinary(ascii);
    const hex = asciiToHex(ascii);
    const octal = asciiToOctal(ascii);
    const bitBreakdownData = bitBreakdown(ascii);

    return {
      index,
      char,
      displayChar: char === ' ' ? 'Space (␣)' : char === '\n' ? 'Newline (\\n)' : char,
      ascii,
      binary,
      hex,
      octal,
      bitBreakdown: bitBreakdownData,
    };
  });
}

/**
 * Calculates bit decomposition for a decimal ASCII value.
 * Example: 72 = 64 + 8 -> active bit weights [64, 8]
 * 
 * @param {number} asciiValue Decimal ASCII code
 * @returns {Object} Decomposition details
 */
export function bitBreakdown(asciiValue) {
  const val = Math.max(0, Math.min(255, Math.floor(Number(asciiValue) || 0)));
  const bitWeights = [128, 64, 32, 16, 8, 4, 2, 1];
  const binaryStr = val.toString(2).padStart(8, '0');
  const bits = binaryStr.split('').map(b => parseInt(b, 10));

  const activeWeights = [];
  bits.forEach((bit, idx) => {
    if (bit === 1) {
      activeWeights.push(bitWeights[idx]);
    }
  });

  const mathEquation = activeWeights.length > 0 
    ? `${activeWeights.join(' + ')} = ${val}` 
    : `0 = ${val}`;

  return {
    value: val,
    bitWeights,
    bits,
    activeWeights,
    mathEquation,
  };
}

/**
 * Reconstructs decimal ASCII from an 8-bit array (e.g. [0, 1, 0, 0, 0, 0, 0, 1]).
 * @param {Array<number>} bitArray Array of 8 zeros and ones
 * @returns {number} Calculated decimal value
 */
export function bitArrayToAscii(bitArray) {
  const bitWeights = [128, 64, 32, 16, 8, 4, 2, 1];
  return bitArray.reduce((acc, bit, idx) => acc + (bit ? bitWeights[idx] : 0), 0);
}
