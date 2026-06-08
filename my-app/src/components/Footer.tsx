'use client';

import React from 'react';
import Link from 'next/link';
import { useMenus } from '@/hooks/useMenus';
import { useSettings } from '@/hooks/useSettings';
import { useServiceDevices } from '@/hooks/useServiceDevices';

const DEFAULT_MENUS = [
  { id: 'm-1', title: 'Trang chủ', url: '/', icon: 'bi-house-door', sortOrder: 1, isActive: true },
  { id: 'm-2', title: 'Danh mục thiết bị', url: '/categories', icon: 'bi-tags', sortOrder: 2, isActive: true },
  { id: 'm-3', title: 'Cẩm nang mẹo vặt', url: '/tips', icon: 'bi-journal-text', sortOrder: 3, isActive: true },
  { id: 'm-4', title: 'Liên hệ', url: '#contact', icon: 'bi-telephone', sortOrder: 4, isActive: true },
];

const DEFAULT_FOOTER_SERVICES = [
  { id: 'fs-1', name: 'Sửa chữa máy lạnh tại nhà' },
  { id: 'fs-2', name: 'Vệ sinh & Nạp gas máy lạnh' },
  { id: 'fs-3', name: 'Bảo dưỡng hệ thống VRV/Chiller' },
  { id: 'fs-4', name: 'Sửa chữa tủ lạnh, máy giặt' },
];

export default function Footer() {
  const { menus } = useMenus();
  const { settings } = useSettings();
  const { serviceDevices } = useServiceDevices();

  const activeMenus = menus.length > 0 ? menus.filter(m => m.isActive) : DEFAULT_MENUS;
  const displayServices = serviceDevices.length > 0 
    ? serviceDevices.filter(s => s.isActive).slice(0, 4) 
    : DEFAULT_FOOTER_SERVICES;

  // Resolve contact settings
  const addressSetting = settings.find(s => s.key.toLowerCase().includes('address') || s.key.toLowerCase().includes('địa chỉ'));
  const address = addressSetting?.value || 'Số 103, Đường Lê Lợi, Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh';

  const phoneSetting = settings.find(s => s.key.toLowerCase().includes('phone') || s.key.toLowerCase().includes('hotline'));
  const phoneNumber = phoneSetting?.value || '1900 6789 - 0988.123.456';

  const emailSetting = settings.find(s => s.key.toLowerCase().includes('email') || s.key.toLowerCase().includes('thư'));
  const email = emailSetting?.value || 'contact@dienlanhdms.com';

  return (
    <footer className="bg-dark text-light py-5 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-snow2 text-primary fs-3"></i>
              <span className="fw-bold tracking-tight h5 text-white m-0">ĐIỆN LẠNH DMS</span>
            </div>
            <p className="text-secondary small mb-4">
              Chuyên cung cấp dịch vụ lắp đặt, sửa chữa và bảo dưỡng thiết bị điện lạnh dân dụng & công nghiệp hàng đầu Việt Nam.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '36px', height: '36px', padding: '6px 0' }}><i className="bi bi-facebook"></i></a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '36px', height: '36px', padding: '6px 0' }}><i className="bi bi-youtube"></i></a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '36px', height: '36px', padding: '6px 0' }}><i className="bi bi-telephone-fill"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Liên kết nhanh</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              {activeMenus.map((menu) => (
                <li key={menu.id}>
                  {menu.url.startsWith('#') ? (
                    <a href={menu.url} className="text-secondary text-decoration-none hover-light">{menu.title}</a>
                  ) : (
                    <Link href={menu.url} className="text-secondary text-decoration-none hover-light">{menu.title}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Dịch vụ chính</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              {displayServices.map((srv) => (
                <li key={srv.id}>
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  {srv.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6" id="contact">
            <h6 className="text-white fw-bold mb-3">Thông tin liên hệ</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small text-secondary">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt-fill text-primary mt-1"></i>
                <span>{address}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone-fill text-primary"></i>
                <span className="text-white fw-semibold">Hotline: {phoneNumber}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope-fill text-primary"></i>
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 text-secondary small">
          <span>&copy; {new Date().getFullYear()} Điện Lạnh DMS. Tất cả quyền được bảo lưu.</span>
          <div className="d-flex gap-3">
            <a href="#" className="text-secondary text-decoration-none">Chính sách bảo mật</a>
            <span>&bull;</span>
            <a href="#" className="text-secondary text-decoration-none">Điều khoản dịch vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
