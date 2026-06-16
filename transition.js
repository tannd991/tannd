// transition.js

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tạo động phần tử overlay nếu chưa có trong HTML để tránh lỗi giao diện
  let overlay = document.querySelector(".transition-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "transition-overlay";
    document.body.appendChild(overlay);
  }

  // 2. Chạy hiệu ứng trượt màn che lên để hiển thị nội dung trang khi tải xong
  setTimeout(() => {
    overlay.classList.add("finished");
  }, 50);

  // 3. Bắt sự kiện click vào các liên kết điều hướng để chạy hiệu ứng chuyển trang
  const links = document.querySelectorAll("nav a, .logo-link, .hero a, .btn-link");
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
      // Chỉ áp dụng chuyển trang mượt mà đối với các liên kết nội bộ (.html hoặc /)
      // Bỏ qua các link neo (#contact), link gọi điện (tel:), link email (mailto:), hoặc link ngoài (http/https)
      if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("tel:") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("http:") &&
        !href.startsWith("https:")
      ) {
        e.preventDefault(); // Chặn việc trình duyệt load trang lập tức
        
        // Trượt tấm màn che xuống phủ kín màn hình
        overlay.classList.remove("finished");
        overlay.classList.add("active");

        // Chờ hiệu ứng trượt hoàn thành (khớp với thời gian 0.6s của CSS) rồi chuyển hướng trang
        setTimeout(() => {
          window.location.href = href;
        }, 550);
      }
    });
  });
});
