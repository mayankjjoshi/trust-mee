const fs = require('fs');

function fixHtml(file) {
    let html = fs.readFileSync(file, 'utf8');
    // Remove the locationPickerModal completely
    html = html.replace(/<!-- Location Picker Modal -->[\s\S]*?<\/div>\s*<\/div>/g, '');
    // Remove leaflet scripts
    html = html.replace(/<!-- Leaflet JS -->[\s\S]*?<script src="js\/app\.min\.js" defer><\/script>/g, '<script src="js/app.min.js" defer></script>');
    fs.writeFileSync(file, html);
}

fixHtml('index.html');
fixHtml('contact.html');

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
        inputField.placeholder = 'Detecting location...';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    try {
                        const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lng}&zoom=18&addressdetails=1\`);
                        const data = await res.json();
                        
                        if (data && data.display_name) {
                            inputField.value = data.display_name;
                            inputField.dataset.lat = lat;
                            inputField.dataset.lng = lng;
                            btn.innerHTML = '<i class="fas fa-check" style="color: #10b981;"></i>';
                            setTimeout(() => btn.innerHTML = originalHtml, 2000);
                            
                            if(window.Utils) window.Utils.showToast('Location detected successfully', 'success');
                        }
                    } catch (error) {
                        btn.innerHTML = originalHtml;
                        inputField.placeholder = 'Address / Share Location';
                        if(window.Utils) window.Utils.showToast('Could not fetch address details', 'error');
                    }
                },
                (err) => {
                    btn.innerHTML = originalHtml;
                    inputField.placeholder = 'Address / Share Location';
                    if(window.Utils) window.Utils.showToast('Location access denied or unavailable', 'error');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            btn.innerHTML = originalHtml;
            if(window.Utils) window.Utils.showToast('Geolocation is not supported by your browser', 'error');
        }
    }
};
`;

appJs = appJs.replace(/window\.LocationPicker = \{[\s\S]*?reverseGeocode[\s\S]*?\}\n    \}\n\};/g, newLogic);
appJs = appJs.replace(/LocationPicker\.init\(\);/g, 'LocationHandler.init();');

// Also fix the app.js location buttons listener inside Form module if it exists
appJs = appJs.replace(/setupLocationButtons\(\) \{[\s\S]*?if \(window\.LocationPicker\) \{[\s\S]*?\}\n        \}\);/g, '');

fs.writeFileSync('js/app.js', appJs);
