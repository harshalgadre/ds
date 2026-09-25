/**
 * ASCII Laboratory - Encoding Game & Challenge Algorithm Module
 * Powers interactive quiz challenges, distractors generation, streaks, timers, and scoring algorithms.
 */

export const QUESTION_TYPES = {
  CHAR_TO_ASCII: 'CHAR_TO_ASCII',   // Given character 'G', what is ASCII? (Answer: 71)
  ASCII_TO_CHAR: 'ASCII_TO_CHAR',   // Given ASCII 80, what character is it? (Answer: 'P')
  CHAR_TO_BINARY: 'CHAR_TO_BINARY', // Given character 'A', what is Binary? (Answer: 01000001)
  BINARY_TO_CHAR: 'BINARY_TO_CHAR', // Given Binary 01000011, what is character? (Answer: 'C')
  HEX_TO_ASCII: 'HEX_TO_ASCII',     // Given Hex 41, what is decimal ASCII? (Answer: 65)
  BIT_MATH: 'BIT_MATH',             // Given 64 + 8, what ASCII character is it? (Answer: 72 = 'H')
};

export const DIFFICULTY_LEVELS = {
  EASY: { name: 'Easy', range: [65, 90], timeSeconds: 15 },    // Uppercase A-Z
  MEDIUM: { name: 'Medium', range: [48, 122], timeSeconds: 12 },// Digits + A-Z + a-z
  HARD: { name: 'Hard', range: [33, 126], timeSeconds: 8 },     // All printable ASCII
};

/**
 * Picks a random integer between min and max inclusive.
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a random ASCII Challenge question based on difficulty level.
 * 
 * @param {string} difficulty EASY | MEDIUM | HARD
 * @returns {Object} Question object with question text, type, prompt, correctAnswer, options, explanation
 */
export function generateQuestion(difficulty = 'EASY') {
  const config = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.EASY;
  const asciiValue = getRandomInt(config.range[0], config.range[1]);
  const char = String.fromCharCode(asciiValue);

  const typeKeys = Object.keys(QUESTION_TYPES);
  const selectedType = typeKeys[getRandomInt(0, typeKeys.length - 1)];

  let questionText = '';
  let promptText = '';
  let correctAnswer = '';
  let distractors = [];
  let explanation = '';

  const binaryStr = asciiValue.toString(2).padStart(8, '0');
  const hexStr = asciiValue.toString(16).toUpperCase().padStart(2, '0');

  switch (selectedType) {
    case QUESTION_TYPES.CHAR_TO_ASCII:
      questionText = `What is the decimal ASCII value of character '${char}'?`;
      promptText = `Character: ${char}`;
      correctAnswer = String(asciiValue);
      // Generate close numbers like asciiValue - 2, asciiValue - 1, asciiValue + 1
      distractors = [
        String(asciiValue - 1),
        String(asciiValue + 1),
        String(asciiValue + 2),
      ];
      explanation = `'${char}' has decimal ASCII value ${asciiValue} (Binary: ${binaryStr}, Hex: 0x${hexStr}).`;
      break;

    case QUESTION_TYPES.ASCII_TO_CHAR:
      questionText = `Which character corresponds to ASCII decimal value ${asciiValue}?`;
      promptText = `ASCII: ${asciiValue}`;
      correctAnswer = char;
      distractors = [
        String.fromCharCode(asciiValue - 1),
        String.fromCharCode(asciiValue + 1),
        String.fromCharCode(asciiValue > 65 ? asciiValue - 2 : asciiValue + 2),
      ];
      explanation = `ASCII decimal ${asciiValue} represents character '${char}'.`;
      break;

    case QUESTION_TYPES.CHAR_TO_BINARY:
      questionText = `What is the 8-bit binary representation of character '${char}' (ASCII ${asciiValue})?`;
      promptText = `Character: ${char}`;
      correctAnswer = binaryStr;
      // Mutate single bit to create distractors
      distractors = generateBinaryDistractors(binaryStr);
      explanation = `'${char}' (ASCII ${asciiValue}) in 8-bit binary is ${binaryStr}.`;
      break;

    case QUESTION_TYPES.BINARY_TO_CHAR:
      questionText = `What character does binary code ${binaryStr} represent?`;
      promptText = `Binary: ${binaryStr}`;
      correctAnswer = char;
      distractors = [
        String.fromCharCode(Math.max(33, asciiValue - 1)),
        String.fromCharCode(Math.min(126, asciiValue + 1)),
        String.fromCharCode(Math.max(33, asciiValue - 2)),
      ];
      explanation = `Binary ${binaryStr} = Decimal ${asciiValue} = Character '${char}'.`;
      break;

    case QUESTION_TYPES.HEX_TO_ASCII:
      questionText = `What is the decimal ASCII value for Hexadecimal 0x${hexStr}?`;
      promptText = `Hex: 0x${hexStr}`;
      correctAnswer = String(asciiValue);
      distractors = [
        String(asciiValue - 1),
        String(asciiValue + 10),
        String(asciiValue - 5),
      ];
      explanation = `Hex 0x${hexStr} = (${hexStr[0]} × 16) + ${parseInt(hexStr[1], 16)} = ${asciiValue}.`;
      break;

    case QUESTION_TYPES.BIT_MATH:
    default: {
      const activeBits = [];
      const bitWeights = [128, 64, 32, 16, 8, 4, 2, 1];
      binaryStr.split('').forEach((b, idx) => {
        if (b === '1') activeBits.push(bitWeights[idx]);
      });
      const mathStr = activeBits.length > 0 ? activeBits.join(' + ') : '0';
      
      questionText = `Bit Sum Math: Which character equals bit sum (${mathStr})?`;
      promptText = `Bit Sum: ${mathStr}`;
      correctAnswer = char;
      distractors = [
        String.fromCharCode(Math.max(33, asciiValue - 1)),
        String.fromCharCode(Math.min(126, asciiValue + 1)),
        String.fromCharCode(Math.max(33, asciiValue + 2)),
      ];
      explanation = `Bit sum ${mathStr} = ${asciiValue}, which represents character '${char}'.`;
      break;
    }
  }

  // Ensure unique distractors that don't match correctAnswer
  const cleanDistractors = Array.from(
    new Set(distractors.filter(d => d !== correctAnswer && d !== undefined))
  );

  // Fill up to 3 distractors if duplicate arose
  while (cleanDistractors.length < 3) {
    const fallbackNum = asciiValue + cleanDistractors.length + 3;
    const fallbackVal = selectedType.includes('CHAR') ? String.fromCharCode(fallbackNum) : String(fallbackNum);
    if (fallbackVal !== correctAnswer && !cleanDistractors.includes(fallbackVal)) {
      cleanDistractors.push(fallbackVal);
    }
  }

  const options = shuffleArray([correctAnswer, ...cleanDistractors.slice(0, 3)]);

  return {
    id: Date.now() + Math.random(),
    type: selectedType,
    difficulty,
    questionText,
    promptText,
    correctAnswer,
    options,
    explanation,
    asciiValue,
    char,
  };
}

/**
 * Generates realistic binary distractors by flipping single bits.
 */
function generateBinaryDistractors(binaryStr) {
  const distractors = [];
  const chars = binaryStr.split('');

  // Flip bit at index 6 (weight 2)
  const clone1 = [...chars];
  clone1[6] = clone1[6] === '0' ? '1' : '0';
  distractors.push(clone1.join(''));

  // Flip bit at index 7 (weight 1)
  const clone2 = [...chars];
  clone2[7] = clone2[7] === '0' ? '1' : '0';
  distractors.push(clone2.join(''));

  // Flip bit at index 1 (weight 64)
  const clone3 = [...chars];
  clone3[1] = clone3[1] === '0' ? '1' : '0';
  distractors.push(clone3.join(''));

  return distractors;
}

/**
 * Calculates score earned for a question attempt.
 * @param {boolean} isCorrect 
 * @param {number} timeLeftSeconds 
 * @param {number} currentStreak 
 * @returns {number} Earned points
 */
export function calculateQuestionScore(isCorrect, timeLeftSeconds, currentStreak) {
  if (!isCorrect) return 0;
  const basePoints = 100;
  const timeBonus = Math.floor(timeLeftSeconds * 10);
  const streakMultiplier = 1 + (currentStreak * 0.2);
  return Math.floor((basePoints + timeBonus) * streakMultiplier);
}
