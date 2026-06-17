const fs = require('fs');

function fixHtml(file, isIndex) {
    let html = fs.readFileSync(file, 'utf8');

    // 1. Add Location Input to Form
    if (isIndex) {
        const heroFormHtml = '<input type="text" id="heroAddress" name="address" class="form-input" placeholder="Enter your address or share location" style="padding-right: 40px;" required>\n                            <button type="button" class="get-location-btn" title="Get Current Location" style="position: absolute; right: 10px; top: 38px; background: none; border: none; cursor: pointer; color: var(--primary-blue); font-size: 1.2rem;">\n                                <i class="fas fa-map-marker-alt"></i>\n                            </button>';
        html = html.replace(/<input type="text" id="heroAddress" name="address" class="form-input" placeholder="Enter your address or location" required>/g, heroFormHtml);
    }
    
    // Fix regular forms
    const regularFormHtml = '<input type="text" id="address" name="address" class="form-input" placeholder="Enter your address or share location" style="padding-right: 40px;" required>\n                            <button type="button" class="get-location-btn" title="Get Current Location" style="position: absolute; right: 10px; top: 38px; background: none; border: none; cursor: pointer; color: var(--primary-blue); font-size: 1.2rem;">\n                                <i class="fas fa-map-marker-alt"></i>\n                            </button>';
    html = html.replace(/<input type="text" id="address" name="address" class="form-input" placeholder="Enter your address or location" required>/g, regularFormHtml);

    // Remove existing modal if any
    html = html.replace(/<!-- Location Picker Modal -->[\s\S]*?<\/div>\s*<\/div>/g, '');
    html = html.replace(/<!-- Leaflet JS -->[\s\S]*?<script src="js\/app\.min\.js" defer><\/script>/g, '');

    // 2. Add Modal before </body>
    const modalHtml = `
    <!-- Location Picker Modal -->
    <div class="modal-backdrop" id="locationPickerBackdrop"></div>
    <div class="modal" id="locationPickerModal" style="max-width: 600px; width: 95%; padding: 0; overflow: hidden; border-radius: 12px; z-index: 2001;">
        <div class="modal-header" style="padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: white; margin-bottom: 0;">
            <h3 style="margin: 0; font-size: 1.2rem;">Select Location</h3>
            <button class="modal-close" id="locationPickerClose" style="position: static; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; width: auto; height: auto;"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body" style="padding: 0;">
            <div style="padding: 15px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; gap: 10px;">
                <input type="text" id="mapSearchInput" class="form-input" placeholder="Search for a place..." style="flex: 1; margin-bottom: 0;">
                <button type="button" id="mapSearchBtn" class="btn btn-primary" style="padding: 0.8rem 1.2rem;"><i class="fas fa-search"></i></button>
                <button type="button" id="mapCurrentLocBtn" class="btn btn-white" style="padding: 0.8rem 1.2rem; border: 1px solid #cbd5e1; color: var(--primary-blue);" title="Use Current Location"><i class="fas fa-crosshairs"></i></button>
            </div>
            <div id="mapPicker" style="height: 350px; width: 100%; z-index: 1;"></div>
            <div style="padding: 15px; background: #fff;">
                <p id="mapSelectedAddress" style="font-size: 0.9rem; color: #475569; margin-bottom: 15px; min-height: 40px; display: flex; align-items: center;"><i class="fas fa-map-marker-alt" style="color: var(--primary-blue); margin-right: 8px;"></i> <span>Move the pin or search to select a location.</span></p>
                <button type="button" id="mapConfirmBtn" class="btn btn-primary" style="width: 100%;" disabled>Confirm Location</button>
            </div>
        </div>
    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="js/app.min.js" defer></script>`;

    html = html.replace('</body>', modalHtml + '\n</body>');
    fs.writeFileSync(file, html);
}

fixHtml('index.html', true);
fixHtml('contact.html', false);
