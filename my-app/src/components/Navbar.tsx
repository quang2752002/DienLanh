'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMenus } from '@/hooks/useMenus';
import { useSettings } from '@/hooks/useSettings';

const DEFAULT_MENUS = [
  { id: 'm-1', title: 'Trang chủ', url: '/', icon: 'bi-house-door', sortOrder: 1, isActive: true },
  { id: 'm-2', title: 'Danh mục thiết bị', url: '/categories', icon: 'bi-tags', sortOrder: 2, isActive: true },
  { id: 'm-3', title: 'Cẩm nang mẹo vặt', url: '/tips', icon: 'bi-journal-text', sortOrder: 3, isActive: true },
  { id: 'm-4', title: 'Liên hệ', url: '#contact', icon: 'bi-telephone', sortOrder: 4, isActive: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const auth = useAuth();
  const { menus } = useMenus();
  const { settings } = useSettings();

  const activeMenus = menus.length > 0 ? menus.filter(m => m.isActive) : DEFAULT_MENUS;
  const phoneSetting = settings.find(s => s.key.toLowerCase().includes('phone') || s.key.toLowerCase().includes('hotline'));
  const phoneNumber = phoneSetting?.value || '0988.123.456';

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    return pathname === path ? 'active fw-bold text-primary' : 'text-dark';
  };

  const renderLink = (menu: any) => {
    if (menu.url.startsWith('#')) {
      return (
        <a href={menu.url} className="nav-link px-3 py-2 rounded-pill text-dark">
          {menu.icon && <i className={`bi ${menu.icon} me-1`}></i>}
          {menu.title}
        </a>
      );
    }
    return (
      <Link href={menu.url} className={`nav-link px-3 py-2 rounded-pill ${isActive(menu.url)}`}>
        {menu.icon && <i className={`bi ${menu.icon} me-1`}></i>}
        {menu.title}
      </Link>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3 shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
          <i className="bi bi-snow2 text-primary fs-3 animate-spin"></i>
          <div>
            <span className="fw-bold text-dark tracking-tight m-0 h5 d-block">ĐIỆN LẠNH DMS</span>
            <small className="text-muted text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>Kỹ thuật & Dịch vụ</small>
          </div>
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarNav" 
          aria-expanded={isOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show mt-3 mt-lg-0' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto gap-1 gap-lg-3">
            {activeMenus.map((menu) => (
              <li key={menu.id} className="nav-item">
                {renderLink(menu)}
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {auth && auth.user ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3"
                  type="button"
                  onClick={() => auth.logout()}
                >
                  <i className="bi bi-person-circle"></i>
                  <span>{auth.user.fullName || auth.user.username || 'Tài khoản'}</span>
                  <i className="bi bi-box-arrow-right ms-1 text-danger" title="Đăng xuất"></i>
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm font-semibold d-flex align-items-center gap-2">
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
