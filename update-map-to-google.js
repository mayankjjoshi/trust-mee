const fs = require('fs');
let appJs = fs.readFileSync('js/app.js', 'utf8');

const newLogic = `
window.LocationHandler = {
    init() {
        document.querySelectorAll('.get-location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.getLocation(btn);
            });
        });
    },

    getLocation(btn) {
        const inputField = btn.parentElement.querySelector('input');
        if (!inputField) return;

        // Visual feedback
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Let the user know they need to paste the link here
        if (!inputField.value) {
            inputField.placeholder = 'Paste Google Maps link here...';
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    // Open Google Maps with their exact location in a new tab
                    window.open(\`https://www.google.com/maps?q=\${lat},\${lng}\`, '_blank');
                    
                    btn.innerHTML = originalHtml;
                    if(window.Utils) window.Utils.showToast('Google Maps opened. Please copy the link and paste it here.', 'success');
                },
                (err) => {
                    // Fallback if they deny location: just open general Google Maps
                    window.open('https://www.google.com/maps', '_blank');
                    btn.innerHTML = originalHtml;
                    if(window.Utils) window.Utils.showToast('Please find your location on the map and paste the link.', 'info');
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            window.open('https://www.google.com/maps', '_blank');
            btn.innerHTML = originalHtml;
        }
    }
};
`;

// Replace the existing LocationHandler with the new one
appJs = appJs.replace(/window\.LocationHandler = \{[\s\S]*?\}\n    \}\n\};/g, newLogic);
fs.writeFileSync('js/app.js', appJs);
