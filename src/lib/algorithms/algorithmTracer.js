/**
 * ASCII Laboratory - DSA Algorithm Tracer & Pseudocode Module
 * Provides formal pseudocode, space/time complexity explanations, and step-by-step state traces for viva defense.
 */

export const ALGORITHM_DOCS = {
  ENCODING: {
    id: 'ENCODING',
    title: 'Text to ASCII/Binary Encoding Pipeline',
    timeComplexity: 'O(N) - Linear Time',
    spaceComplexity: 'O(N) - Linear Space for Output Buffer',
    description: 'Iterates through each character in the input string, retrieves its 8-bit integer ASCII value via charCodeAt(), converts it to 8-bit binary representation using bitwise division or string padding, and formats as hexadecimal.',
    pseudocode: [
      { line: 1, text: 'ALGORITHM EncodeTextToAscii(text):' },
      { line: 2, text: '  INPUT: text string of length N' },
      { line: 3, text: '  OUTPUT: Array of {char, ascii, binary, hex}' },
      { line: 4, text: '  pipeline ← Empty List' },
      { line: 5, text: '  FOR i FROM 0 TO N - 1 DO:' },
      { line: 6, text: '    currentChar ← text[i]' },
      { line: 7, text: '    asciiCode ← OrdinalValueOf(currentChar)' },
      { line: 8, text: '    binaryStr ← ConvertToBinaryPadded(asciiCode, 8)' },
      { line: 9, text: '    hexStr ← ConvertToHexPadded(asciiCode, 2)' },
      { line: 10, text: '    APPEND {currentChar, asciiCode, binaryStr, hexStr} TO pipeline' },
      { line: 11, text: '  END FOR' },
      { line: 12, text: '  RETURN pipeline' },
    ],
  },
  BIT_DECOMPOSITION: {
    id: 'BIT_DECOMPOSITION',
    title: 'Bitwise 8-Bit Sum Decomposition',
    timeComplexity: 'O(1) - Constant Time (Always 8 Bit Positions)',
    spaceComplexity: 'O(1) - Fixed 8-element Array',
    description: 'Decomposes a decimal number (0-255) into sum of powers of two (128, 64, 32, 16, 8, 4, 2, 1) using right-shift (>>) and bitwise AND (& 1) operators.',
    pseudocode: [
      { line: 1, text: 'ALGORITHM DecomposeBitWeights(asciiValue):' },
      { line: 2, text: '  weights ← [128, 64, 32, 16, 8, 4, 2, 1]' },
      { line: 3, text: '  activeBits ← Empty List' },
      { line: 4, text: '  FOR idx FROM 0 TO 7 DO:' },
      { line: 5, text: '    bit ← (asciiValue >> (7 - idx)) AND 1' },
      { line: 6, text: '    IF bit == 1 THEN' },
      { line: 7, text: '      APPEND weights[idx] TO activeBits' },
      { line: 8, text: '    END IF' },
      { line: 9, text: '  END FOR' },
      { line: 10, text: '  RETURN activeBits' },
    ],
  },
  DECODING: {
    id: 'DECODING',
    title: 'Binary Stream to ASCII Character Decoding',
    timeComplexity: 'O(N) - Linear Time per 8-Bit Byte Chunk',
    spaceComplexity: 'O(N) - String Builder Output',
    description: 'Parses 8-bit binary chunks, evaluates base-2 positional sum (2^7*b7 + 2^6*b6 + ... + 2^0*b0), converts integer code back to ASCII character string.',
    pseudocode: [
      { line: 1, text: 'ALGORITHM DecodeBinaryToText(binaryStream):' },
      { line: 2, text: '  chunks ← SplitStreamByLengthOrSpace(binaryStream, 8)' },
      { line: 3, text: '  resultText ← ""' },
      { line: 4, text: '  FOR EACH chunk IN chunks DO:' },
      { line: 5, text: '    decimalVal ← ParseInteger(chunk, base=2)' },
      { line: 6, text: '    character ← CharacterFromCode(decimalVal)' },
      { line: 7, text: '    resultText ← resultText + character' },
      { line: 8, text: '  END FOR' },
      { line: 9, text: '  RETURN resultText' },
    ],
  },
};

/**
 * Creates step-by-step state traces for live DSA execution debugging.
 * 
 * @param {string} text Input text
 * @returns {Array<Object>} List of trace snapshots with highlight line numbers and state variables
 */
export function generateEncodingExecutionTrace(text) {
  if (!text) return [];

  const traces = [];
  const chars = text.split('');

  traces.push({
    stepIndex: 0,
    highlightLine: 4,
    description: 'Initialized empty pipeline data structure.',
    variables: { i: '-', currentChar: '-', asciiCode: '-', binaryStr: '-', hexStr: '-', pipelineLength: 0 },
  });

  let currentPipelineCount = 0;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const ascii = char.charCodeAt(0);
    const binary = ascii.toString(2).padStart(8, '0');
    const hex = ascii.toString(16).toUpperCase().padStart(2, '0');

    traces.push({
      stepIndex: traces.length,
      highlightLine: 6,
      description: `Loop iteration i = ${i}: Reading character '${char}' at index ${i}.`,
      variables: { i, currentChar: char, asciiCode: '-', binaryStr: '-', hexStr: '-', pipelineLength: currentPipelineCount },
    });

    traces.push({
      stepIndex: traces.length,
      highlightLine: 7,
      description: `Evaluated character '${char}' to ASCII decimal value ${ascii}.`,
      variables: { i, currentChar: char, asciiCode: ascii, binaryStr: '-', hexStr: '-', pipelineLength: currentPipelineCount },
    });

    traces.push({
      stepIndex: traces.length,
      highlightLine: 8,
      description: `Converted ASCII decimal ${ascii} to 8-bit binary '${binary}'.`,
      variables: { i, currentChar: char, asciiCode: ascii, binaryStr: binary, hexStr: '-', pipelineLength: currentPipelineCount },
    });

    traces.push({
      stepIndex: traces.length,
      highlightLine: 10,
      description: `Appended character item '${char}' (0x${hex}) to output pipeline list.`,
      variables: { i, currentChar: char, asciiCode: ascii, binaryStr: binary, hexStr: hex, pipelineLength: currentPipelineCount + 1 },
    });

    currentPipelineCount++;
  }

  traces.push({
    stepIndex: traces.length,
    highlightLine: 12,
    description: `Encoding pipeline complete! Total ${currentPipelineCount} characters processed.`,
    variables: { i: chars.length, currentChar: 'EOF', asciiCode: 'DONE', binaryStr: 'DONE', hexStr: 'DONE', pipelineLength: currentPipelineCount },
  });

  return traces;
}
