// Mock data for the CarbonTrace application

// 1. Mock Stats for Dashboard Cards
export const MOCK_STATS = {
  cumulativeFootprint: 1256.7,
  weeklyChange: -5.2, // percentage
  blockchainCommits: 42,
};

// 2. Mock Data for Overview Chart (last 7 days)
export const MOCK_OVERVIEW_DATA = [
  { date: '2023-10-20', co2: 12.5 },
  { date: '2023-10-21', co2: 15.2 },
  { date: '2023-10-22', co2: 8.8 },
  { date: '2023-10-23', co2: 18.1 },
  { date: '2023-10-24', co2: 10.0 },
  { date: '2023-10-25', co2: 14.7 },
  { date: '2023-10-26', co2: 11.3 },
];

// 3. Mock Data for Category Breakdown Chart
export const MOCK_CATEGORY_DATA = [
  { category: 'Transportation', co2: 350.5 },
  { category: 'Food', co2: 420.0 },
  { category: 'Electricity', co2: 280.8 },
  { category: 'Shopping', co2: 150.4 },
  { category: 'Other', co2: 55.0 },
];
