const fs = require('fs');

const cssContent = `
/* Custom Main Navigation */
.main-nav {
    display: flex;
    align-items: center;
    gap: 15px;
}
.main-nav a {
    text-transform: uppercase !important;
    font-weight: 700 !important;
    color: #000 !important;
    margin-left: 0 !important;
    font-size: 15px;
}
.main-nav a.active {
    color: #2563eb !important;
}
.main-nav .nav-sep {
    color: #e5e7eb;
}
.main-nav a i {
    font-size: 12px;
    margin-left: 4px;
    color: #6b7280;
}
`;

fs.appendFileSync('style.css', cssContent);

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check which one is active
    let activeTrangChu = file === 'index.html' ? ' class="active"' : '';
    let activeGioiThieu = file === 'about.html' ? ' class="active"' : '';
    let activeTinCongNghe = file.startsWith('news') ? ' class="active"' : '';
    let activeGiaiPhap = file.startsWith('solutions') ? ' class="active"' : '';
    let activeDichVu = file === 'services.html' ? ' class="active"' : '';

    const newNav = `<nav class="main-nav">
      <a href="index.html"\${activeTrangChu}>Trang chủ</a>
      <span class="nav-sep">|</span>
      <a href="about.html"\${activeGioiThieu}>Giới thiệu</a>
      <span class="nav-sep">|</span>
      <a href="news.html"\${activeTinCongNghe}>Tin công nghệ</a>
      <span class="nav-sep">|</span>
      <a href="solutions.html"\${activeGiaiPhap}>Giải pháp <i class="fa-solid fa-angle-down"></i></a>
      <span class="nav-sep">|</span>
      <a href="services.html"\${activeDichVu}>Dịch vụ</a>
    </nav>`;

    content = content.replace(/<nav>[\s\S]*?<\/nav>/, newNav);
    fs.writeFileSync(file, content);
});

console.log("Updated navigation in all HTML files.");
