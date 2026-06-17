const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    let activeTrangChu = file === 'index.html' ? ' color: #2563eb;' : ' color: #000;';
    let activeGioiThieu = file === 'about.html' ? ' color: #2563eb;' : ' color: #000;';
    let activeTinCongNghe = file.startsWith('news') ? ' color: #2563eb;' : ' color: #000;';
    let activeGiaiPhap = file.startsWith('solutions') ? ' color: #2563eb;' : ' color: #000;';
    let activeDichVu = file === 'services.html' ? ' color: #2563eb;' : ' color: #000;';

    const baseStyle = 'text-decoration: none; font-weight: bold; font-size: 15px; margin-left: 0; text-transform: uppercase;';
    const sep = '<span style="color: #ccc; margin: 0 4px;">|</span>';

    const newNav = `<nav style="display: flex; align-items: center; gap: 15px;">
      <a href="index.html" style="${baseStyle}${activeTrangChu}">TRANG CHỦ</a>
      ${sep}
      <a href="about.html" style="${baseStyle}${activeGioiThieu}">GIỚI THIỆU</a>
      ${sep}
      <a href="news.html" style="${baseStyle}${activeTinCongNghe}">TIN CÔNG NGHỆ</a>
      ${sep}
      <a href="solutions.html" style="${baseStyle}${activeGiaiPhap}">GIẢI PHÁP <i class="fa-solid fa-angle-down" style="font-size: 12px; margin-left: 4px; color: #6b7280;"></i></a>
      ${sep}
      <a href="services.html" style="${baseStyle}${activeDichVu}">DỊCH VỤ</a>
    </nav>`;

    if (content.includes('<nav class="main-nav">')) {
        content = content.replace(/<nav class="main-nav">[\s\S]*?<\/nav>/, newNav);
    } else {
        content = content.replace(/<nav>[\s\S]*?<\/nav>/, newNav);
    }
    fs.writeFileSync(file, content);
});
console.log("Updated with inline styles and hardcoded uppercase");
