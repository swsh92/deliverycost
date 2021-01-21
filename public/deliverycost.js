// this is example input
//   var input = {
//       dealerPostcode: "SW155PU",
//       customerPostcode: "GU15 1AX",
//       costPerMile: 10, // IN POUNDS, so e.g. 10 pounds 75 pence = 10.75, or 62 pence = 0.62
//       freeDistance: 15, // (the discounted miles and initial free radius)
//       minimumCost: 60, // IN POUNDS, as above. Set this to 0 when there is no minimum cost available.
//       blnDeductFreeDistance: true, // should we deduct the freeDistance from charged miles starting outside of the free radius zone
//       maximumDistance: 400 // in miles
//   };


/*******************************
Call `lookupDistance` with two arguments. The first argument is the input object, as shown above. The second argument is a callback which will be invoked with the response as its argument. Example response shapes are shown below.

================================================================================================
EXAMPLE USAGE
 
<button id="test">test</button>

document.getElementById("test").addEventListener("click", function() {
    lookupDistance(input, (res) => console.log(res));
});
================================================================================================
EXAMPLE RESPONSE SHAPES
 
{   
    hasResult: true,
    canDeliver: true,
    errors: null,
    totalMiles: 71.2,
    chargedMiles: 50
    costEstimate: 120,
    usedMinimumCost: false,
    errorCode: null
};

{   
    hasResult: true,
    canDeliver: false,
    errors: null,
    totalMiles: 71.2,
    chargedMiles: 50,
    costEstimate: 120,
    usedMinimumCost: false,
    errorCode: null
};

{   
    hasResult: true,
    canDeliver: true,
    errors: null,
    totalMiles: 10,
    chargedMiles: 10,
    costEstimate: 25,
    usedMinimumCost: true,
    errorCode: null
};

{   
    hasResult: false,
    canDeliver: false,
    errors: { error: "Failed to calculate cost" },
    totalMiles: null,
    chargedMiles: null,
    costEstimate: null,
    usedMinimumCost: null,
    errorCode: 500
};

{   
    hasResult: false,
    canDeliver: false,
    errors: { error: "Invalid postcode" },
    totalMiles: null,
    chargedMiles: null,
    costEstimate: null,
    usedMinimumCost: null,
    errorCode: 400
};
*******************************/

// var devUrl = "http://localhost:55329/api/vehicle-delivery-distance";
var prodUrl = "https://app.autohub.uk/api/vehicle-delivery-distance";

function lookupDistance(input, callback) {
  $.ajax({
    url: prodUrl,
    type: "POST",
    crossDomain: true,
    dataType: "json",
    data: {
      DealerAddress: { Postcode: input.dealerPostcode },
      CustomerAddress: { Postcode: input.customerPostcode }
    },
    success: function (dataRes) {
      callback(makeOutput(dataRes, input));
    },
    error: function (xhr) {
      callback(makeErrorResponse(xhr.status));
    }
  });
}

function makeOutput(data, params) {
  if (data.Miles === null || data.Miles === undefined) {
    return makeErrorResponse(400);
  }

  var totalMiles = parseFloat(data.Miles);
  if (!Number.isNaN(totalMiles)) {
    var costResult = calculateCost(totalMiles, params.costPerMile, params.freeDistance, params.minimumCost, params.blnDeductFreeDistance);

    return totalMiles >= params.maximumDistance ?
      makeSuccessResponse(false, totalMiles, costResult) : makeSuccessResponse(true, totalMiles, costResult);
  }

  return makeErrorResponse(500);
}

function makeSuccessResponse(canDeliver, totalMiles, costResult) {
  return {
    hasResult: true,
    canDeliver: canDeliver,
    errors: null,
    totalMiles: totalMiles,
    chargedMiles: costResult.chargedMiles,
    costEstimate: costResult.costEstimate,
    usedMinimumCost: costResult.usedMinimumCost,
    errorCode: null
  };
}

function makeErrorResponse(errorCode) {
  // a 500 errorCode means Starkwood couldn't connect with the Google API
  // a 400 errorCode, invalid postcodes, non-existent addresses or no geographical route between them
  var errorString = errorCode == 500 ? "Failed to calculate cost" : "Invalid postcode";
  return {
    hasResult: false,
    canDeliver: false,
    errors: { error: errorString },
    totalMiles: null,
    chargedMiles: null,
    costEstimate: null,
    usedMinimumCost: null,
    errorCode: errorCode
  };
}

function calculateCost(totalMiles, costPerMile, freeDistance, minimumCost, blnDeductFreeDistance) {
  // if the customer is within free delivery radius, do not charge
  if (totalMiles <= freeDistance) {
    return {
      costEstimate: 0,
      chargedMiles: 0,
      usedMinimumCost: false
    };
  }
  // if we get down to here, we are outside the free delivery radius and totalMiles > freeDistance
  var chargedMiles = totalMiles;

  if (blnDeductFreeDistance) {
    chargedMiles -= freeDistance;
  }

  var costEstimate = costPerMile * chargedMiles;

  if (costEstimate < minimumCost) {
    return {
      costEstimate: minimumCost,
      chargedMiles: chargedMiles,
      usedMinimumCost: true
    };
  }

  return {
    costEstimate: costEstimate,
    chargedMiles: chargedMiles,
    usedMinimumCost: false
  };
}

// front-end team must comment out the remaining lines, i.e. the module.exports, which is only needed to export the functions for Jest testing

module.exports = {
    lookupDistance,
    makeOutput,
    makeErrorResponse,
    makeSuccessResponse,
    calculateCost
};