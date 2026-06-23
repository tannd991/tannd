const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.vercel')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.html') && !file.includes('admin\\index.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(__dirname);
const cacheVersion = '?v=' + Date.now();

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    // Replace href="style.css" with href="style.css?v=..."
    if (content.includes('href="style.css"')) {
        content = content.replace(/href="style\.css"/g, `href="style.css${cacheVersion}"`);
        fs.writeFileSync(f, content);
        console.log('Cache busted style.css in: ' + f);
    }
});

console.log('Cache busting complete.');
