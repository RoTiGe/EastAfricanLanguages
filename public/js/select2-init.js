// Select2 CDN integration for language dropdowns
// This script initializes Select2 on all language <select> elements

document.addEventListener('DOMContentLoaded', function() {
    // Load Select2 CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css';
    document.head.appendChild(link);

    // Load Select2 JS
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js';
    script.onload = function() {
        // Initialize Select2 on language dropdowns
        if (window.jQuery) {
            // For translate.ejs
            $('#sourceLanguage').select2({
                width: '100%',
                placeholder: 'Select your language...'
            });
            $('#targetLanguage').select2({
                width: '100%',
                placeholder: 'Select target language...'
            });

            // For other pages
            $('#nativeLanguage').select2({
                width: '100%',
                placeholder: 'Choose your native language...'
            });
            $('#learningLanguage').select2({
                width: '100%',
                placeholder: 'Choose language to learn...'
            });
            $('#quickLanguage').select2({
                width: '100%',
                placeholder: 'Select Language'
            });
        }
    };
    document.body.appendChild(script);

    // Load jQuery if not present (use jsdelivr to comply with CSP)
    if (!window.jQuery) {
        var jq = document.createElement('script');
        jq.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
        jq.onload = function() {
            document.body.appendChild(script);
        };
        document.body.appendChild(jq);
    }
});
