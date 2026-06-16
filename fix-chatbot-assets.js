const fs = require('fs');

const files = ['about.html', 'services.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('href="style.css"')) {
        content = content.replace('</head>', '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n  <link rel="stylesheet" href="style.css" />\n</head>');
    }
    
    if (!content.includes('script.js')) {
        content = content.replace('</body>', '  <script src="script.js"></script>\n</body>');
    }

    fs.writeFileSync(file, content);
});

console.log("Fixed missing CSS and JS on about and services.");
