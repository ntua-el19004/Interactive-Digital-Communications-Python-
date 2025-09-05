function isTargetPage() {
    // Check if the URL path contains the specific page segment, accounting for variable base paths
    const urlPath = window.location.pathname;
    return urlPath.includes('/content/Digcom_Lab');
}


function hideInitialCodecells() {
    document.querySelectorAll('.tag_hide-code-cell [id^="codecell"]').forEach(element => {
        element.style.display = 'none';
        console.log(`Element with ID ${element.id} has been initially hidden.`);
    });
}

function customFunction() {
    document.querySelectorAll('.tag_hide-code-cell [id^="codecell"]').forEach(element => {
        let inputElement = element.querySelector('.thebelab-input');
        if (inputElement) {
            inputElement.style.display = 'none';
            console.log(`Thebelab input within ${element.id} has been hidden.`);
        }
    });
}

function observeStatusChanges() {
    if (!isTargetPage()) return; // Exit if not on the target page

    const config = {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false
    };

    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                let elements = document.querySelectorAll('.launch_msg');
                elements.forEach((element) => {
                    if (element.textContent === 'Launching from mybinder.org: ') {
                        customFunction(); // Hide '.thebelab-input' in relevant codecells when status is 'ready'
                    }
                });
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
}

if (isTargetPage()) {
    document.addEventListener('DOMContentLoaded', (event) => {
        console.log("starting custom code");
        hideInitialCodecells(); // Initially hide relevant codecells
        observeStatusChanges(); // Start observing for changes to '.status' elements
    });
}