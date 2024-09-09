const API_KEY = "tMZvYcuU6yA8Vbjkp-Ae2DPau5c";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));



// Wire up our button(status) - 1st function to fetch the data,2nd to display it
// We're not using the "e"(event), but its good practice to pass the event object into 
// our handler function

document.getElementById("status").addEventListener("click", e => getStatus(e));
//Code to wire up our Run Checks button:
document.getElementById("submit").addEventListener("click", e => postForm(e));

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
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    //To show the Modal istelf use:
    resultsModal.show();
}

//Make a POST request to the API:
//Firstly, a function to make the request. And secondly, a function to display the data.

//Wire up "Run Checks" button - see above event listener, then check our API instructions on what to do to make a POST request:
// JavaScript provides a very helpful  
// interface to help us do that and appropriately  enough it's called the FormData interface.  
// What does this do for us? Well, it can capture all of the fields  
// in a HTML form and return it as an object. Now this is very cool because we can then  
// give this object to "fetch", and we  don't need to do any other processing.  
async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));//id of form in html is checksform
    // if you want to confirm  that the form has captured correctly. 
    // Then the formData object has several default  methods that allow us to manipulate the data. 
    // One of these, is the entries method. Which  we can iterate through to see the form entries.
    // for (let e of form.entries()) { //this will iterate through each  of the form entries putting it in 'e',

    //     //Note: the variable "e" in this for loop is not the same "e" event object that we pass
    //     // into the function. It would probably be better to use a different temporary variable name here
    //     //such as "el" or "entry".
    //     console.log(e);DONT NEED THE FOR LOOP, USED JUST TO TEST!
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "authorization": API_KEY,
        },
        body: form, // send the form  data to the API. this will make a POST  request to the API, authorize it with the API key
    });
    // Just like our GET status function, now we need to turn the response into json and then call the  
    //appropriate function or throw an error if the response doesn't return okay.
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors:<span class="error_count">${data.total_errors}</span></div>`;
        //iterate through each of the errors:
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`; //pass in the error text that's coming back from our json.
        }
    }



    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    //To show the Modal istelf use:
    resultsModal.show();
}