const { expect, describe } = require('@jest/globals');
const {
    lookupDistance,
    makeOutput,
    calculateCost,
    makeErrorResponse,
    makeSuccessResponse } = require('../public/deliverycost.js');

// var input = {
//     dealerPostcode: "SW155PU",
//     customerPostcode: "GU15 1AX",
//     costPerMile: 10,
//     freeDistance: 5,
//     minimumCost: 200,
//     blnDeductFreeDistance: true,
//     maximumDistance: 400
// };

var testInput = {
    dealerPostcode: 'GU153HL',
    // customerPostcode:,
    costPerMile: 2.5,
    freeDistance: 20,
    minimumCost: 100,
    blnDeductFreeDistance: true,
    maximumDistance: 300
};

test('makeErrorResponse returns correct object on 400 error', () => {
    const err = makeErrorResponse(400);

    expect(err.hasResult).toEqual(false);
    expect(err.canDeliver).toEqual(false);

    expect(err.errors).toEqual({ error: "Invalid postcode" });

    expect(err.totalMiles).toBeNull();
    expect(err.chargedMiles).toBeNull();
    expect(err.costEstimate).toBeNull();
    expect(err.usedMinimumCost).toBeNull();
    
});

test('makeErrorResponse returns correct object on 500 error', () => {
    const err = makeErrorResponse(500);

    expect(err.hasResult).toEqual(false);
    expect(err.canDeliver).toEqual(false);

    expect(err.errors).toEqual({ error: "Failed to calculate cost" });

    expect(err.totalMiles).toBeNull();
    expect(err.chargedMiles).toBeNull();
    expect(err.costEstimate).toBeNull();
    expect(err.usedMinimumCost).toBeNull();
    
});


describe('blnDeductFreeDistance is true', () => {

    const blnDeductFreeDistance = true;

    test('calculateCost returns correct result when within the free delivery radius', () => {
        const totalMiles = 19;
        const costPerMile = 1;
        const freeDistance = 20;
        const minimumCost = 50;
        
        const expectedCostEstimate = 0;
        const expectedChargedMiles = 0;
        const expectedUsedMinimumCost = false;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    });

    test('calculateCost returns correct result when on the free delivery radius', () => {
        const totalMiles = 20;
        const costPerMile = 1;
        const freeDistance = 20;
        const minimumCost = 50;
        
        const expectedCostEstimate = 0;
        const expectedChargedMiles = 0;
        const expectedUsedMinimumCost = false;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    });

    test('calculateCost returns correct result when over minimum cost', () => {

        const totalMiles = 100;
        const costPerMile = 2;
        const freeDistance = 20;
        const minimumCost = 50;
        
        const expectedCostEstimate = 160;
        const expectedChargedMiles = 80;
        const expectedUsedMinimumCost = false;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    });

    test('calculateCost returns correct result when under minimum cost', () => {

        const totalMiles = 49;
        const costPerMile = 1;
        const freeDistance = 20;
        const minimumCost = 50;
        
        const expectedCostEstimate = 50;
        const expectedChargedMiles = 29;
        const expectedUsedMinimumCost = true;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    });

    test('calculateCost returns correct result when minimum cost is 0 and totalMiles is within free distance', () => {

        const totalMiles = 49;
        const costPerMile = 1;
        const freeDistance = 50;
        const minimumCost = 0;
        
        const expectedCostEstimate = 0;
        const expectedChargedMiles = 0;
        const expectedUsedMinimumCost = false;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    });
});

describe('apply discount is false', () => {

    const blnDeductFreeDistance = false;

    test('calculateCost returns correct result when within the free delivery radius', () => {
        const totalMiles = 19;
        const costPerMile = 1;
        const freeDistance = 20;
        const minimumCost = 50;
        
        const expectedCostEstimate = 0;
        const expectedChargedMiles = 0;
        const expectedUsedMinimumCost = false;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    });

    test('calculateCost returns correct result when on the free delivery radius', () => {
        const totalMiles = 20;
        const costPerMile = 1;
        const freeDistance = 20;
        const minimumCost = 50;
        
        const expectedCostEstimate = 0;
        const expectedChargedMiles = 0;
        const expectedUsedMinimumCost = false;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    });

    test('calculateCost returns correct result when over minimum cost', () => {

        const totalMiles = 100;
        const costPerMile = 1;
        const freeDistance = 20;
        const minimumCost = 50;
        
        const expectedCostEstimate = 100
        const expectedChargedMiles = 100;
        const expectedUsedMinimumCost = false;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    
    });

    test('calculateCost returns correct result when under minimum cost', () => {

        const totalMiles = 49;
        const costPerMile = 1;
        const freeDistance = 20;
        const minimumCost = 50;
        
        const expectedCostEstimate = 50
        const expectedChargedMiles = 49;
        const expectedUsedMinimumCost = true;
    
        const costResult = calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance);
    
        expect(costResult.costEstimate).toEqual(expectedCostEstimate);
        expect(costResult.chargedMiles).toEqual(expectedChargedMiles);
        expect(costResult.usedMinimumCost).toEqual(expectedUsedMinimumCost);
    
    });
});

// function calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance) {
//     var chargedMiles;
//     if (blnDeductFreeDistance) {
//         chargedMiles = totalMiles <= freeDistance ? 0 : totalMiles - freeDistance;
//     } else {
//         chargedMiles = totalMiles;
//     }
//     var costEstimate = costPerMile * chargedMiles;
//     var useMinimumCost = costEstimate <= minimumCost;
//     costEstimate = useMinimumCost ? minimumCost : costEstimate;
    
//     return {
//         costEstimate: costEstimate,
//         chargedMiles: chargedMiles == 0 ? totalMiles : chargedMiles,
//         usedMinimumCost: useMinimumCost
//     }
// }
