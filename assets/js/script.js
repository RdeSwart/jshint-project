const API_KEY = "tMZvYcuU6yA8Vbjkp-Ae2DPau5c";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// Wire up our button(status) - 1st function to fetch the data,2nd to display it
// We're not using the "e"(event), but its good practice to pass the event object into 
// our handler function

document.getElementById("status").addEventListener("click", e => getStatus(e));

// Firstly, our getStatus function needs to make a GET request to the API_URL with the API_KEY.
// And secondly, it needs to pass this data to a function that will display it.

// When we’re handling promises, we have two ways of doing it.
// We can chain “.then”s as we did before, 
// or we can wrap the promises in  an async function - like this -
// and then await the promise coming true.

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    //await response
    const response = await fetch(queryString);

    // When the response comes back, we'll need to convert it to json.
    // Remember that the json() method also returns 
    // a promise, so we need to await that too.
    const data = await response.json();

    // At this stage in our function, we can assume that we'll have some data back.
    // It will either be our key expiry data, or it will be an error.
    if (response.ok) {
        displayStatus(data);
        // here we're using the built-in JavaScript error handler to throw a new error but you can see here where it says  
        // 'data.error' that that's the descriptive message from the json that's been returned.
    } else {
        throw new Error(data.error);
    }
}

// our displayStatus function needs to set the heading text
// to API key status, it needs to set the body  text to, "your key is valid until" and the date,  
// and it needs to show the modal.
function displayStatus(data) {
    let heading = "API Status";
    let results = `<div>Your key is valid until:</div>`;
    results += `<div class="key-status">${data.ecpiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    //To show the Modal istelf use:
    resultsModal.show();
}