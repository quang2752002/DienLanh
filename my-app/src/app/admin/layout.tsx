'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import './sb-admin-2.min.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    if (auth) {
      auth.logout();
      router.push('/login');
    }
  };

  return (
    <div id="wrapper" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
        style={{ transition: 'width 0.2s' }}
      >
        {/* Sidebar - Brand */}
        <Link href="/admin" className="sidebar-brand d-flex align-items-center justify-content-center my-2 text-decoration-none">
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="bi bi-snow2 fs-3 text-white"></i>
          </div>
          <div className="sidebar-brand-text mx-3">DMS Admin</div>
        </Link>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />

        {/* Nav Item - Dashboard */}
        <li className={`nav-item ${isActive('/admin')}`}>
          <Link href="/admin" className="nav-link">
            <i className="bi bi-speedometer2 me-2"></i>
            <span>Tổng quan</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider" />

        {/* Heading */}
        <div className="sidebar-heading text-white-50">Quản lý nội dung</div>

        {/* Nav Item - Category */}
        <li className={`nav-item ${isActive('/admin/category')}`}>
          <Link href="/admin/category" className="nav-link">
            <i className="bi bi-tags-fill me-2"></i>
            <span>Danh mục Thiết bị</span>
          </Link>
        </li>

        {/* Nav Item - Menu */}
        <li className={`nav-item ${isActive('/admin/menu')}`}>
          <Link href="/admin/menu" className="nav-link">
            <i className="bi bi-list-nested me-2"></i>
            <span>Thanh Menu</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider d-none d-md-block" />

        {/* Return to website */}
        <li className="nav-item">
          <Link href="/" className="nav-link">
            <i className="bi bi-arrow-left-circle me-2"></i>
            <span>Xem Website</span>
          </Link>
        </li>
      </ul>

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1 bg-light">
        {/* Main Content */}
        <div id="content">
          {/* Topbar */}
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow-sm justify-content-between px-4 py-3">
            <span className="navbar-brand mb-0 h5 text-gray-800 d-none d-sm-inline-block">
              Hệ thống Quản trị Điện Lạnh DMS
            </span>

            {/* Topbar Navbar */}
            <ul className="navbar-nav ml-auto align-items-center gap-3">
              {auth && auth.user && (
                <li className="nav-item dropdown no-arrow d-flex align-items-center gap-2">
                  <span className="mr-2 d-none d-lg-inline text-gray-600 small fw-bold">
                    {auth.user.fullName || auth.user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Đăng xuất</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Begin Page Content */}
          <div className="container-fluid px-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
