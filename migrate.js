const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const postDir = path.join(__dirname, 'post');
const postsFile = path.join(dataDir, 'posts.json');
const newsHtmlPath = path.join(__dirname, 'news.html');

let posts = [];
if (fs.existsSync(postsFile)) {
    posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
}

function extractContent(filePath, overrideDate) {
    if (!fs.existsSync(filePath)) return null;
    const html = fs.readFileSync(filePath, 'utf8');
    
    const titleMatch = html.match(/<h1 class="article-title">(.*?)<\/h1>/);
    const authorMatch = html.match(/<i class="fa-solid fa-user"><\/i>\s*(.*?)\s*<\/span>/);
    const imageMatch = html.match(/<img src="(.*?)"[^>]*class="article-image"/);
    const contentMatch = html.match(/<div class="article-content">([\s\S]*?)<\/main>/);
    
    if (!titleMatch || !contentMatch) return null;
    
    let content = contentMatch[1].trim();
    if (content.endsWith('</div>')) {
        content = content.slice(0, -6).trim(); 
    }

    return {
        id: Date.now().toString() + Math.floor(Math.random()*1000),
        title: titleMatch[1],
        category: 'Tin công nghệ',
        author: authorMatch ? authorMatch[1] : 'Nguyễn Duy Tân',
        thumbnail: imageMatch ? imageMatch[1] : 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
        content: content,
        excerptText: content.replace(/<[^>]+>/g, '').substring(0, 150).trim() + '...',
        slug: path.basename(filePath, '.html'),
        dateStr: overrideDate,
        createdAt: Date.now()
    };
}

const p1 = extractContent(path.join(postDir, 'news-thay-doi-cach-ban-lam-viec-voi-office-365.html'), '15/06/2026');
const p2 = extractContent('news-sdwan.html', '15/06/2026');
const p3 = extractContent('news-ai.html', '10/06/2026');

if (p1 && !posts.find(p => p.slug === p1.slug)) posts.push(p1);
if (p2 && !posts.find(p => p.slug === p2.slug)) posts.push(p2);
if (p3 && !posts.find(p => p.slug === p3.slug)) posts.push(p3);

posts.sort((a, b) => {
    const da = a.dateStr.split('/').reverse().join('-');
    const db = b.dateStr.split('/').reverse().join('-');
    return db.localeCompare(da);
});

fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), 'utf8');

if (fs.existsSync('news-sdwan.html')) {
    fs.copyFileSync('news-sdwan.html', path.join(postDir, 'news-sdwan.html'));
    fs.unlinkSync('news-sdwan.html');
}
if (fs.existsSync('news-ai.html')) {
    fs.copyFileSync('news-ai.html', path.join(postDir, 'news-ai.html'));
    fs.unlinkSync('news-ai.html');
}

let newsHtml = fs.readFileSync(newsHtmlPath, 'utf8');
const cardsHtml = posts.map(post => {
    return `
      <article class="blog-card">
        <img src="${post.thumbnail}" alt="${post.title}" class="blog-thumb">
        <div class="blog-content">
          <div class="blog-meta">
            <span style="color: #2563eb; font-weight: bold;">${post.category || 'Tin công nghệ'}</span> | 
            <span><i class="fa-regular fa-calendar"></i> ${post.dateStr}</span> | 
            <span><i class="fa-solid fa-user"></i> ${post.author}</span>
          </div>
          <h2 class="blog-title">${post.title}</h2>
          <p class="blog-excerpt">${post.excerptText}</p>
          <a href="post/${post.slug}.html" class="read-more">Đọc tiếp <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </article>`;
}).join('\n');

const regex = /(<div class="blog-grid">)[\s\S]*?(<\/div>\s*<\/main>)/;
newsHtml = newsHtml.replace(regex, `$1\n${cardsHtml}\n$2`);
fs.writeFileSync(newsHtmlPath, newsHtml, 'utf8');

console.log("Migration complete.");
