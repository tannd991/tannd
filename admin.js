const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'images');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(express.static('admin')); // Serve admin UI
app.use(express.static('.')); // Serve assets for preview if needed

// Data paths
const dataDir = path.join(__dirname, 'data');
const postDir = path.join(__dirname, 'post');
const postsFile = path.join(dataDir, 'posts.json');
const newsHtmlPath = path.join(__dirname, 'news.html');
const solutionsHtmlPath = path.join(__dirname, 'solutions.html');
const servicesHtmlPath = path.join(__dirname, 'services.html');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(postDir)) fs.mkdirSync(postDir);
if (!fs.existsSync(postsFile)) fs.writeFileSync(postsFile, '[]', 'utf8');

function getPosts() {
    return JSON.parse(fs.readFileSync(postsFile, 'utf8'));
}

function savePosts(posts) {
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), 'utf8');
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
        .replace(/đ/gi, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Rebuild HTML single post
function generateArticleHtml(post) {
    const category = post.category || 'Tin công nghệ';
    let backLink = '../news.html';
    if (category === 'Giải pháp') backLink = '../solutions.html';
    else if (category === 'Dịch vụ') backLink = '../services.html#service-news';

    const activeTinCongNghe = (category === 'Tin công nghệ' || category === 'Khác') ? 'color: #2563eb;' : 'color: #000;';
    const activeGiaiPhap = (category === 'Giải pháp') ? 'color: #2563eb;' : 'color: #000;';
    const activeDichVu = (category === 'Dịch vụ') ? 'color: #2563eb;' : 'color: #000;';

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>${post.title} - J-TECH</title>
  <link rel="stylesheet" href="../transition.css" />
  <script src="../transition.js" defer></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../style.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
    body { background: #f8fbff; color: #1f2937; line-height: 1.6; }
    header { position: sticky; top: 0; z-index: 1000; padding: 20px 8%; display: flex; justify-content: space-between; align-items: center; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; display: flex; align-items: center; gap: 10px; }
    .logo-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #2563eb; }
    .article-container { max-width: 800px; margin: 40px auto; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); }
    .article-header { margin-bottom: 30px; text-align: center; }
    .article-title { font-size: 36px; color: #2563eb; margin-bottom: 15px; }
    .article-meta { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
    .article-image { width: 100%; height: auto; border-radius: 12px; margin-bottom: 30px; }
    .article-content p { margin-bottom: 20px; font-size: 16px; color: #4b5563; line-height: 1.8; }
    .article-content h3 { color: #1f2937; margin: 30px 0 15px 0; }
    .article-content img { max-width: 100%; border-radius: 8px; }
    .back-link { display: inline-block; margin-bottom: 20px; color: #2563eb; text-decoration: none; font-weight: bold; }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="transition-overlay"></div>
  <header>
    <a href="../index.html" class="logo logo-link" style="text-decoration: none;">
      <img src="../logo.jpg" alt="J-TECH Logo" class="logo-img" />
      <span>J-TECH</span>
    </a>
    <nav style="display: flex; align-items: center; gap: 15px;">
      <a href="../index.html" style="color: #000; text-decoration: none; font-weight: bold; font-size: 15px; text-transform: uppercase;">TRANG CHỦ</a>
      <span style="color: #ccc; margin: 0 4px;">|</span>
      <a href="../about.html" style="color: #000; text-decoration: none; font-weight: bold; font-size: 15px; text-transform: uppercase;">GIỚI THIỆU</a>
      <span style="color: #ccc; margin: 0 4px;">|</span>
      <a href="../news.html" style="${activeTinCongNghe} text-decoration: none; font-weight: bold; font-size: 15px; text-transform: uppercase;">TIN CÔNG NGHỆ</a>
      <span style="color: #ccc; margin: 0 4px;">|</span>
      <a href="../solutions.html" style="${activeGiaiPhap} text-decoration: none; font-weight: bold; font-size: 15px; text-transform: uppercase;">GIẢI PHÁP <i class="fa-solid fa-angle-down" style="font-size: 12px; margin-left: 4px; color: #6b7280;"></i></a>
      <span style="color: #ccc; margin: 0 4px;">|</span>
      <a href="../services.html" style="${activeDichVu} text-decoration: none; font-weight: bold; font-size: 15px; text-transform: uppercase;">DỊCH VỤ</a>
    </nav>
  </header>

  <main class="article-container">
    <a href="${backLink}" class="back-link"><i class="fa-solid fa-arrow-left"></i> Quay lại Danh sách</a>
    <div class="article-header">
      <h1 class="article-title">${post.title}</h1>
      <div class="article-meta">
        <span style="background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; margin-right: 10px;">${post.category || 'Tin công nghệ'}</span>
        <span><i class="fa-regular fa-calendar"></i> ${post.dateStr}</span> | 
        <span><i class="fa-solid fa-user"></i> ${post.author}</span>
      </div>
      <img src="${post.thumbnail}" alt="Thumbnail" class="article-image">
    </div>
    
    <div class="article-content">
      ${post.content}
    </div>
  </main>

  <footer style="padding: 30px 8%; text-align: center; color: #6b7280;">
    © 2026 J-TECH Consultant. All rights reserved.
  </footer>
  
  <!-- Floating Chatbot Toggle Button -->
  <button id="chatbot-toggle" class="chatbot-toggle shadow-2xl" onclick="toggleChatbot()">
      <i class="fa-solid fa-robot"></i>
  </button>

  <!-- Chatbot Window -->
  <div id="chatbot-window" class="chatbot-window shadow-2xl hidden">
      <!-- Header -->
      <div class="chat-header">
          <div class="header-info">
              <div class="avatar-container">
                  <img src="https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff" alt="AI Avatar">
                  <span class="online-indicator"></span>
              </div>
              <div class="bot-info">
                  <h3>Trợ lý AI</h3>
                  <span>Luôn sẵn sàng hỗ trợ</span>
              </div>
          </div>
          <div class="header-actions">
              <button id="refresh-btn" class="icon-btn" title="Làm mới trò chuyện" onclick="refreshChat()">
                  <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button class="icon-btn" title="Đóng" onclick="toggleChatbot()">
                  <i class="fa-solid fa-xmark"></i>
              </button>
          </div>
      </div>

      <!-- Chat Messages -->
      <div id="chat-messages" class="chat-messages">
          <!-- Messages will be injected here -->
      </div>

      <!-- Chat Input -->
      <div class="chat-input-container">
          <input type="text" id="chat-input" placeholder="Nhập tin nhắn của bạn..." onkeypress="handleEnter(event)">
          <button id="send-btn" class="send-btn" onclick="sendMessage()">
              <i class="fa-solid fa-paper-plane"></i>
          </button>
      </div>
  </div>
  <script src="../script.js"></script>
</body>
</html>`;
}

// Rebuild grid helper
function rebuildGrid(filePath, filteredPosts) {
    if (!fs.existsSync(filePath)) return;
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    const cardsHtml = filteredPosts.map(post => {
        const cacheBust = `?v=${Date.now()}`;
        return `
      <article class="blog-card">
        <img src="${post.thumbnail}${cacheBust}" alt="${post.title}" class="blog-thumb">
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

    // Regex to replace everything between the start and end markers
    const regex = /(<!-- BLOG_GRID_START -->)[\s\S]*?(<!-- BLOG_GRID_END -->)/;
    htmlContent = htmlContent.replace(regex, `$1\n${cardsHtml}\n      $2`);
    fs.writeFileSync(filePath, htmlContent, 'utf8');
}

// Rebuild all pages grids
function rebuildAllPages(posts) {
    // 1. news.html: "Tin công nghệ" or empty or "Khác"
    const newsPosts = posts.filter(p => !p.category || p.category === 'Tin công nghệ' || p.category === 'Khác');
    rebuildGrid(newsHtmlPath, newsPosts);

    // 2. solutions.html: "Giải pháp"
    const solutionsPosts = posts.filter(p => p.category === 'Giải pháp');
    rebuildGrid(solutionsHtmlPath, solutionsPosts);

    // 3. services.html: "Dịch vụ"
    const servicesPosts = posts.filter(p => p.category === 'Dịch vụ');
    rebuildGrid(servicesHtmlPath, servicesPosts);
}

app.get('/api/posts', (req, res) => {
    res.json(getPosts());
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có file ảnh' });
    res.json({ url: '/images/' + req.file.filename });
});

app.get('/api/posts/:id', (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (post) res.json(post);
    else res.status(404).json({error: 'Không tìm thấy bài viết'});
});

app.post('/api/posts', (req, res) => {
    const { title, category, author, thumbnail, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Thiếu thông tin bài viết' });

    const id = Date.now().toString();
    const slug = `news-${slugify(title)}-${id.slice(-4)}`;
    const excerptText = content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
    const dateStr = new Date().toLocaleDateString('vi-VN');

    const newPost = { id, title, category, author, thumbnail, content, excerptText, slug, dateStr, createdAt: Date.now() };

    const posts = getPosts();
    posts.unshift(newPost); // Add to top
    savePosts(posts);

    fs.writeFileSync(path.join(postDir, `${slug}.html`), generateArticleHtml(newPost), 'utf8');
    rebuildAllPages(posts);

    res.json({ success: true, post: newPost });
});

app.put('/api/posts/:id', (req, res) => {
    const { title, category, author, thumbnail, content } = req.body;
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === req.params.id);
    
    if (index === -1) return res.status(404).json({ error: 'Không tìm thấy bài viết' });

    // Update fields but keep slug, id, createdAt, etc.
    const post = posts[index];
    post.title = title;
    post.category = category;
    post.author = author;
    post.thumbnail = thumbnail || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800';
    post.content = content;
    post.excerptText = content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

    savePosts(posts);

    fs.writeFileSync(path.join(postDir, `${post.slug}.html`), generateArticleHtml(post), 'utf8');
    rebuildAllPages(posts);

    res.json({ success: true, post });
});

app.delete('/api/posts/:id', (req, res) => {
    let posts = getPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Không tìm thấy bài viết' });

    posts = posts.filter(p => p.id !== req.params.id);
    savePosts(posts);

    const filePath = path.join(postDir, `${post.slug}.html`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    rebuildAllPages(posts);

    res.json({ success: true });
});

const PORT = 9999;
app.listen(PORT, () => {
    console.log(`Admin Dashboard CMS is running at http://localhost:${PORT}/`);
});
