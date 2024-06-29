document.addEventListener('DOMContentLoaded', function () {
    // Function to show the overlay with spinner
    function showOverlay() {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('main-content').classList.add('blurred');
        document.body.style.overflow = 'hidden'; // Disable scrolling
    }

    // Function to hide the overlay
    function hideOverlay() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('main-content').classList.remove('blurred');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Show overlay on form submission
    document.querySelectorAll('form').forEach(function (form) {
        form.addEventListener('submit', function () {
            showOverlay();
        });
    });

    // Ensure the overlay is hidden when the page loads
    hideOverlay();

    // Hide overlay when the window is loaded completely
    window.addEventListener('load', function () {
        hideOverlay();
    });

    // Hide overlay on pageshow event
    window.addEventListener('pageshow', function (event) {
        hideOverlay();
    });

    // Hide overlay on popstate event (triggers on back/forward navigation)
    window.addEventListener('popstate', function () {
        hideOverlay();
    });
});
