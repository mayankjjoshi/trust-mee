const fs = require('fs');

let appJs = fs.readFileSync('js/app.js', 'utf8');

// Update Form.handleSubmit payload
const payloadTarget = `
            const payload = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                lat: form.querySelector('input[name="address"]')?.dataset.lat || null,
                lng: form.querySelector('input[name="address"]')?.dataset.lng || null,
                problem: formData.get('problem') || formData.get('message') || formData.get('service'),
            };`;

const payloadReplacement = `
            const streetAddr = formData.get('streetAddress') || '';
            const mapLink = formData.get('address') || '';
            const fullAddress = streetAddr ? \`\${streetAddr}\\nMap Link: \${mapLink}\` : mapLink;

            const payload = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: fullAddress,
                lat: form.querySelector('input[name="address"]')?.dataset.lat || null,
                lng: form.querySelector('input[name="address"]')?.dataset.lng || null,
                problem: formData.get('problem') || formData.get('message') || formData.get('service'),
            };`;

appJs = appJs.replace(payloadTarget.trim(), payloadReplacement.trim());

// Update Hero form submission logic
appJs = appJs.replace(
    "const address = document.getElementById('heroAddress').value.trim();",
    "const streetAddress = document.getElementById('heroStreet').value.trim();\n            const address = document.getElementById('heroAddress').value.trim();"
);

appJs = appJs.replace(
    "if (!name || !phone || !service || !address) {",
    "if (!name || !phone || !service || !streetAddress || !address) {"
);

appJs = appJs.replace(
    "address: address,",
    "address: streetAddress ? `${streetAddress}\\nMap Link: ${address}` : address,"
);

appJs = appJs.replace(
    /Address: \$\{address\}\$\{mapsLink\}/,
    "Street Address: ${streetAddress}\\nMap Link: ${address}"
);

fs.writeFileSync('js/app.js', appJs);
