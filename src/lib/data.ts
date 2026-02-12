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

// 4. Mock Data for Recent Activities Table (on Dashboard)
export const MOCK_RECENT_ACTIVITIES = [
  { id: 1, activityName: 'Morning Commute', category: 'transportation', co2e: 4.5, date: '2023-10-26' },
  { id: 2, activityName: 'Lunch (Chicken Salad)', category: 'food_consumption', co2e: 1.2, date: '2023-10-26' },
  { id: 3, activityName: 'Work from Home', category: 'electricity_usage', co2e: 2.8, date: '2023-10-26' },
  { id: 4, activityName: 'Bought a new T-shirt', category: 'shopping_lifestyle', co2e: 6.0, date: '2023-10-25' },
  { id: 5, activityName: 'Evening Train Ride', category: 'transportation', co2e: 0.8, date: '2023-10-25' },
];

// 5. Mock Data for Full History Table
export const MOCK_ALL_ACTIVITIES = [
  { id: 1, activityName: 'Morning Commute', details: '15km drive in petrol car', category: 'transportation', co2e: 4.5, date: 'Oct 26, 2023', status: 'Committed', txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b' },
  { id: 2, activityName: 'Lunch (Chicken Salad)', details: '150g chicken breast', category: 'food_consumption', co2e: 1.2, date: 'Oct 26, 2023', status: 'Pending' },
  { id: 3, activityName: 'Work from Home', details: '8 hours laptop usage', category: 'electricity_usage', co2e: 2.8, date: 'Oct 26, 2023', status: 'Pending' },
  { id: 4, activityName: 'Bought a new T-shirt', details: '1 cotton t-shirt', category: 'shopping_lifestyle', co2e: 6.0, date: 'Oct 25, 2023', status: 'Committed', txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e' },
  { id: 5, activityName: 'Evening Train Ride', details: '10km commute', category: 'transportation', co2e: 0.8, date: 'Oct 25, 2023', status: 'Pending' },
  { id: 6, activityName: 'Weekly Groceries', details: 'Mixed items', category: 'shopping_lifestyle', co2e: 15.5, date: 'Oct 24, 2023', status: 'Pending' },
  { id: 7, activityName: 'Flight to Conference', details: '500km short-haul flight', category: 'transportation', co2e: 125.0, date: 'Oct 23, 2023', status: 'Committed', txHash: '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b' },
  { id: 8, activityName: 'Dinner (Beef Steak)', details: '200g beef steak', category: 'food_consumption', co2e: 12.0, date: 'Oct 22, 2023', status: 'Pending' },
];
