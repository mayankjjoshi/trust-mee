const fs = require('fs');

function addStreetAddress(file, formPrefix) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Create new field HTML
    const newField = `
                                  <div class="form-group">
                                      <input 
                                          type="text" 
                                          id="${formPrefix}Street" 
                                          name="streetAddress" 
                                          placeholder="House/Flat No, Building, Street Address" 
                                          required 
                                          class="form-input"
                                      >
                                      <div class="form-input-border"></div>
                                  </div>
`;
    // Find the Map Link field and insert before it
    const mapLinkPattern = new RegExp(`(<div class="form-group" style="position: relative;">\\s*<input[^>]*id="${formPrefix}Address"[^>]*>)`);
    
    // Also change placeholder of map link
    html = html.replace(new RegExp(`(id="${formPrefix}Address"[^>]*)placeholder="Address / Share Location"`), `$1placeholder="Google Maps Link"`);
    
    html = html.replace(mapLinkPattern, newField + "$1");
    
    fs.writeFileSync(file, html);
}

addStreetAddress('index.html', 'hero');
addStreetAddress('contact.html', 'contact');
