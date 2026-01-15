// Function to generate random number data
const generateNumberData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    date: `2023-10-${String(i * 2 + 1).padStart(2, '0')}`,
    value: Math.floor(Math.random() * 100) + 1, // Random value between 1 and 100
  }));
};

// Function to generate random percentage data
const generatePercentageData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    date: `2023-10-${String(i * 2 + 2).padStart(2, '0')}`,
    value: Math.floor(Math.random() * 100) + 1, // Random value between 1 and 100
  }));
};

// Function to generate random duration data (in minutes)
const generateDurationData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    date: `2023-10-${String(i * 2 + 1).padStart(2, '0')}`,
    value: Math.floor(Math.random() * 180) + 1, // Random value between 1 and 180 minutes
  }));
};

// Assigning generated data to constants
export const numberData = generateNumberData();
export const percentageData = generatePercentageData();
export const durationData = generateDurationData();
