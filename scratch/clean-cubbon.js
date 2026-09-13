const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'src', 'lib', 'cubbon-species-data.ts');
let content = fs.readFileSync(target, 'utf8');

content = content.split('"Grey Slender Loris"').join('"Indian Giant Squirrel"');
content = content.split('"Lorises"').join('"Asian Palm Civets"');

fs.writeFileSync(target, content, 'utf8');
console.log('Successfully cleaned Cubbon species data.');
