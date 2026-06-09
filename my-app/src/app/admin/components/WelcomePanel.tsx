'use client';

import React from 'react';

export default function WelcomePanel() {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Hệ thống Điện Lạnh DMS</h6>
      </div>
      <div className="card-body">
        <p>
          Chào mừng bạn quay trở lại với trang quản trị hệ thống Điện Lạnh DMS. 
          Bạn có thể sử dụng thanh bên trái hoặc các thẻ thống kê phía trên để truy cập nhanh các mục quản lý.
        </p>
        <p className="mb-0">
          Tất cả các thay đổi của bạn trên cơ sở dữ liệu sẽ hiển thị trực tiếp lên giao diện khách hàng ngay lập tức.
        </p>
      </div>
    </div>
  );
}
