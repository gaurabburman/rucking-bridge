// IS LOGIC KO SUBMIT-ENTRY.JS MEIN REPLACE KARNA HOGA
const leaderboardEntry = {
    name: ruckingData.operatorName || 'Anonymous',
    age: ruckingData.age || '--',
    country: ruckingData.country || 'Global',
    gender: ruckingData.gender || 'Unknown',
    ruckWeight: parseFloat(ruckingData.loadWeight) || 0, // Strictly Number
    unit: ruckingData.loadWeightUnit || 'kg',
    pace: ruckingData.pace || '0:00',
    calories: parseInt(ruckingData.caloriesBurned) || 0, // Strictly Number for Sorting
    volume: parseFloat(ruckingData.volumeMoved) || 0,   // Strictly Number
    timestamp: new Date()
};
