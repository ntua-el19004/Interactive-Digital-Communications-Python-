/**
 * Checks if the current page is the target page by analyzing the URL path.
 * This function helps in ensuring that the custom logic only runs on the specified page.
 * The page segment '/content/Digcom_Lab' is checked in the URL path.
 * This also accounts for potential variable base paths, which may change dynamically.
 * 
 * @returns {boolean} - True if the current page matches the target path, otherwise false.
 */
function isTargetPage() {
    // Get the current page path from the window object
    const urlPath = window.location.pathname;
    
    // Check if the path includes the specified page segment
    return urlPath.includes('/content/Digcom_Lab');
}

/**
 * Hides code cells marked with a specific tag initially.
 * This function targets elements with IDs that start with 'codecell', within elements tagged '.tag_hide-code-cell'.
 * The style is set to 'none' to hide the matched elements, simulating a "collapse" behavior for code cells.
 * This is useful for controlling the visibility of specific cells at the page load time.
 */
function hideInitialCodecells() {
    // Query and loop through all elements matching the hide-code-cell tag and starting with 'codecell'
    document.querySelectorAll('.tag_hide-code-cell [id^="codecell"]').forEach(element => {
        // Hide each element by changing its display property
        element.style.display = 'none';
        // Log a message to the console for debugging purposes, indicating the element's ID
        console.log(`Element with ID ${element.id} has been initially hidden.`);
    });
}

/**
 * Custom function to hide input fields within thebelab-executed code cells.
 * Specifically targets elements that have '.thebelab-input' class, which is used to capture user input in live code cells.
 * This function hides these inputs after initial page load and during specific status changes.
 * It acts as a visual enhancement by cleaning up the interface once cells are ready to run.
 */
function customFunction() {
    // Query all code cells that match the hide-code-cell tag and start with 'codecell'
    document.querySelectorAll('.tag_hide-code-cell [id^="codecell"]').forEach(element => {
        // Look for the input field within each matched code cell (class '.thebelab-input')
        let inputElement = element.querySelector('.thebelab-input');
        
        // If such an input field exists, hide it
        if (inputElement) {
            inputElement.style.display = 'none';
            // Log a message to the console for tracking, indicating the element's ID
            console.log(`Thebelab input within ${element.id} has been hidden.`);
        }
    });
}

/**
 * Observes DOM mutations to detect when relevant code cells are "ready" for execution.
 * This function is critical for monitoring changes in the document, especially for dynamic content loaded asynchronously.
 * It specifically checks for the 'launching' status of Thebelab code cells and triggers the customFunction when the cells are ready.
 */
function observeStatusChanges() {
    // Only proceed if the current page matches the target path
    if (!isTargetPage()) return; // Exit early if not on the target page

    // Define the configuration for the observer: we watch for childList changes and text content modifications
    const config = {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false
    };

    // Define the callback function for the observer, which processes detected mutations
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            // We are interested in new child elements or changes in character data (text content)
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                // Query elements with the class 'launch_msg', which indicate a loading or status message
                let elements = document.querySelectorAll('.launch_msg');
                
                // Loop through each status message element
                elements.forEach((element) => {
                    // Check if the text indicates a ready state (e.g., launching from mybinder)
                    if (element.textContent === 'Launching from mybinder.org: ') {
                        // When the status is ready, invoke customFunction to hide thebelab input elements
                        customFunction(); 
                    }
                });
            }
        }
    };

    // Create a new MutationObserver instance, passing in the callback function defined above
    const observer = new MutationObserver(callback);

    // Begin observing the entire document body with the specified configuration
    observer.observe(document.body, config);
}

/**
 * Main initialization logic.
 * This function ensures that the custom logic only runs when the target page is loaded and the DOM is fully parsed.
 * It first hides the code cells and then sets up the mutation observer to track status changes.
 */
if (isTargetPage()) {
    document.addEventListener('DOMContentLoaded', (event) => {
        // Log a message to indicate that the custom script is starting
        console.log("starting custom code");

        // Initially hide code cells on page load
        hideInitialCodecells(); 

        // Set up an observer to track status changes and respond to them
        observeStatusChanges(); 
    });
}
