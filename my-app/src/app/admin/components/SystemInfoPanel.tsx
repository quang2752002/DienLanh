'use client';

import React from 'react';

export default function SystemInfoPanel() {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Thông tin hệ thống</h6>
      </div>
      <div className="card-body">
        <div className="mb-2"><strong>Phiên bản CMS:</strong> 2.0.0 (Next.js 14)</div>
        <div className="mb-2"><strong>Môi trường:</strong> Phát triển (Development)</div>
        <div className="mb-0">
          <strong>Trạng thái kết nối API:</strong>{' '}
          <span className="badge bg-success text-white">Hoạt động bình thường</span>
        </div>
      </div>
    </div>
  );
}
