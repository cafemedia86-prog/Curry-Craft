
// Mock Order Data
const mockOrders = [
    { id: '1', status: 'Pending', date: new Date(Date.now() - 1000 * 60 * 5).toISOString() }, // 5 mins ago
    { id: '2', status: 'Confirmed', date: new Date(Date.now() - 1000 * 60 * 20).toISOString() }, // 20 mins ago
    { id: '3', status: 'Preparing', date: new Date(Date.now() - 1000 * 60 * 10).toISOString() }, // 10 mins ago
    { id: '4', status: 'Ready', date: new Date(Date.now() - 1000 * 60 * 30).toISOString() }, // 30 mins ago
    { id: '5', status: 'Confirmed', date: new Date(Date.now() - 1000 * 60 * 2).toISOString() }, // 2 mins ago (Newest Confirmed)
];

console.log("--------------- KDS Logic Simulation ---------------");

// 1. Test Filtering (Should only show Confirmed and Preparing)
const activeOrders = mockOrders.filter(o =>
    ['Confirmed', 'Preparing'].includes(o.status)
).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

console.log("\n1. Testing Filtering Logic:");
const expectedIds = ['2', '3', '5']; // 2 (oldest), 3, 5 (newest) - wait, sorting is ascending OLD to NEW?
// Code says: .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
// Oldest date (smallest timestamp) comes first.
// Order 2: 20 mins ago (Smallest TS)
// Order 3: 10 mins ago
// Order 5: 2 mins ago (Largest TS)
// Expected Order: 2, 3, 5.

const actualIds = activeOrders.map(o => o.id);
const filterPass = JSON.stringify(actualIds) === JSON.stringify(['2', '3', '5']);

console.log(`   [${filterPass ? 'PASS' : 'FAIL'}] Filtering & Sorting`);
if (!filterPass) {
    console.log(`     Expected: 2, 3, 5`);
    console.log(`     Got: ${actualIds.join(', ')}`);
}

// 2. Test Timer Logic
console.log("\n2. Testing Timer Color Logic:");

function getTimerColor(dateStr) {
    const startTime = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const elapsed = Math.floor((now - startTime) / 60000); // Minutes

    if (elapsed > 25) return 'RED';
    if (elapsed > 15) return 'YELLOW';
    return 'GREEN';
}

// Order 2 is 20 mins ago -> Expect YELLOW
// Order 3 is 10 mins ago -> Expect GREEN
// Order 5 is 2 mins ago -> Expect GREEN
// Let's add a simulated VERY OLD order
const oldOrder = { id: '6', status: 'Preparing', date: new Date(Date.now() - 1000 * 60 * 30).toISOString() }; // 30 mins

const testCases = [
    { id: '2', expected: 'YELLOW', minutes: 20 },
    { id: '3', expected: 'GREEN', minutes: 10 },
    { id: '5', expected: 'GREEN', minutes: 2 },
    { id: '6', expected: 'RED', minutes: 30 }
];

let timerPasses = 0;
testCases.forEach(t => {
    // We recreate the date based on 'mock' relative time for stability
    const date = new Date(Date.now() - 1000 * 60 * t.minutes).toISOString();
    const color = getTimerColor(date);
    const passed = color === t.expected;
    if (passed) timerPasses++;
    console.log(`   [${passed ? 'PASS' : 'FAIL'}] Id ${t.id} (${t.minutes} mins) -> Expected ${t.expected}, Got ${color}`);
});

console.log(`\n----------------------------------------------------`);
console.log(`Simulation Completed.`);
