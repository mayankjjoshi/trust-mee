const fs = require('fs');

function removeProblemField(file) {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<div class="form-group">\s*<textarea\s+id="(?:heroProblem|problem)"[\s\S]*?<\/textarea>\s*<div class="form-input-border"><\/div>\s*<\/div>/g, '');
    fs.writeFileSync(file, html);
}

removeProblemField('index.html');
removeProblemField('contact.html');
