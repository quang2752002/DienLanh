'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMenus } from '@/hooks/useMenus';
import { Menu } from '@/types/menu';
import styles from './Navbar.module.css';

// Danh sách Menu mặc định đa cấp (Cha - Con) với đầy đủ icon và đường dẫn chuẩn xác
const DEFAULT_MENUS: Menu[] = [
  { 
    id: 'm-1', 
    title: 'Trang chủ', 
    url: '/', 
    icon: 'bi-house-door', 
    sortOrder: 1, 
    isActive: true 
  },
  { 
    id: 'm-2', 
    title: 'Dịch vụ sửa chữa', 
    url: '#services', 
    icon: 'bi-tools', 
    sortOrder: 2, 
    isActive: true,
    children: [
      { id: 'm-2-1', title: 'Bảo Dưỡng & Vệ Sinh Máy Lạnh', url: '/repair/bao-duong-ve-sinh-may-lanh', icon: 'bi-snow', sortOrder: 1, isActive: true },
      { id: 'm-2-2', title: 'Sửa Chữa Tủ Lạnh Inverter', url: '/repair/sua-chua-tu-lanh-inverter', icon: 'bi-patch-check', sortOrder: 2, isActive: true },
      { id: 'm-2-3', title: 'Sửa Chữa & Vệ Sinh Máy Giặt', url: '/repair/sua-chua-ve-sinh-may-giat', icon: 'bi-water', sortOrder: 3, isActive: true },
      { id: 'm-2-4', title: 'Lắp Đặt & Di Dời Máy Lạnh', url: '/repair/lap-dat-di-doi-may-lanh', icon: 'bi-tools', sortOrder: 4, isActive: true },
    ]
  },
  { 
    id: 'm-3', 
    title: 'Bảng giá dịch vụ', 
    url: '/#pricing', 
    icon: 'bi-tags', 
    sortOrder: 3, 
    isActive: true 
  },
  { 
    id: 'm-4', 
    title: 'Cẩm nang & Mẹo vặt', 
    url: '/tips', 
    icon: 'bi-journal-text', 
    sortOrder: 4, 
    isActive: true,
    children: [
      { id: 'm-3-1', title: '5 Mẹo Dùng Máy Lạnh Tiết Kiệm Điện', url: '/tips/5-meo-su-dung-may-lanh-tiet-kiem-dien', icon: 'bi-lightning-charge', sortOrder: 1, isActive: true },
      { id: 'm-3-2', title: 'Nhận Biết Máy Lạnh Bị Thiếu Gas', url: '/tips/dau-hieu-nhan-biet-may-lanh-bi-thieu-gas', icon: 'bi-exclamation-diamond', sortOrder: 2, isActive: true },
      { id: 'm-3-3', title: 'Tự Vệ Sinh Lưới Lọc Tại Nhà', url: '/tips/huong-dan-tu-ve-sinh-luoi-loc-may-lanh', icon: 'bi-brush', sortOrder: 3, isActive: true },
      { id: 'm-3-4', title: 'Xem Tất Cả Bài Viết Cẩm Nang', url: '/tips', icon: 'bi-grid', sortOrder: 4, isActive: true },
    ]
  },
  { 
    id: 'm-5', 
    title: 'Liên hệ', 
    url: '/#contact', 
    icon: 'bi-telephone', 
    sortOrder: 5, 
    isActive: true 
  },
];

/**
 * Hàm xây dựng cây phân cấp (Tree) từ danh sách phẳng (Flat list)
 */
function buildMenuTree(flatMenus: Menu[]): Menu[] {
  const activeList = flatMenus.filter(m => m.isActive);
  if (activeList.length === 0) return [];

  // Nếu API đã trả về cấu trúc có children sẵn
  const hasEmbeddedChildren = activeList.some(m => m.children && m.children.length > 0);
  if (hasEmbeddedChildren) {
    return activeList.filter(m => !m.parentId);
  }

  const map = new Map<string | number, Menu>();
  const roots: Menu[] = [];

  activeList.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  activeList.forEach(item => {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sắp xếp theo sortOrder
  roots.sort((a, b) => a.sortOrder - b.sortOrder);
  roots.forEach(r => {
    if (r.children && r.children.length > 0) {
      r.children.sort((a, b) => a.sortOrder - b.sortOrder);
    }
  });

  return roots;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | number | null>(null);
  const pathname = usePathname();
  const auth = useAuth();
  const { menus } = useMenus();
  const navRef = useRef<HTMLDivElement>(null);

  // Đóng navbar mobile khi chuyển URL
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdownId(null);
  }, [pathname]);

  // Click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý danh sách menu hiển thị
  const treeMenus = menus.length > 0 ? buildMenuTree(menus) : DEFAULT_MENUS;

  const toggleNavbar = () => setIsOpen(prev => !prev);

  const toggleDropdown = (id: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(prev => (prev === id ? null : id));
  };

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  const closeAll = () => {
    setIsOpen(false);
    setOpenDropdownId(null);
  };

  return (
    <nav ref={navRef} className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3 shadow-sm">
      <div className="container">
        {/* Logo & Slogan */}
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2" onClick={closeAll}>
          <i className="bi bi-snow2 text-primary fs-3 animate-spin"></i>
          <div>
            <span className="fw-bold text-dark tracking-tight m-0 h5 d-block">ĐIỆN LẠNH DMS</span>
            <small className="text-muted text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>
              Kỹ thuật & Dịch vụ
            </small>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          onClick={toggleNavbar}
          aria-controls="navbarNav" 
          aria-expanded={isOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Content */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show mt-3 mt-lg-0' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto gap-1 gap-lg-2">
            {treeMenus.map((menu) => {
              const hasChildren = menu.children && menu.children.length > 0;
              const isDropdownOpen = openDropdownId === menu.id;

              if (hasChildren) {
                const isAnyChildActive = menu.children?.some(c => isLinkActive(c.url));
                return (
                  <li key={menu.id} className={`nav-item ${styles.navItemDropdown}`}>
                    <div className={styles.navParentWrapper}>
                      {/* Link hoặc Nút bấm mở Dropdown */}
                      {menu.url.startsWith('#') ? (
                        <a 
                          href={menu.url}
                          className={`${styles.navLink} ${isAnyChildActive ? styles.navLinkActive : ''}`}
                          onClick={() => {
                            if (window.innerWidth < 992) {
                              setOpenDropdownId(prev => prev === menu.id ? null : menu.id);
                            }
                          }}
                        >
                          {menu.icon && <i className={`bi ${menu.icon}`}></i>}
                          <span>{menu.title}</span>
                          <i className={`bi bi-chevron-down ${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconOpen : ''} ms-1 d-none d-lg-inline-block`}></i>
                        </a>
                      ) : (
                        <Link 
                          href={menu.url}
                          className={`${styles.navLink} ${isLinkActive(menu.url) || isAnyChildActive ? styles.navLinkActive : ''}`}
                          onClick={() => {
                            if (window.innerWidth < 992) {
                              setOpenDropdownId(prev => prev === menu.id ? null : menu.id);
                            }
                          }}
                        >
                          {menu.icon && <i className={`bi ${menu.icon}`}></i>}
                          <span>{menu.title}</span>
                          <i className={`bi bi-chevron-down ${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconOpen : ''} ms-1 d-none d-lg-inline-block`}></i>
                        </Link>
                      )}

                      {/* Mobile Accordion Expand Trigger */}
                      <button
                        type="button"
                        className={`d-lg-none ${styles.mobileToggleBtn}`}
                        onClick={(e) => toggleDropdown(menu.id, e)}
                        aria-label="Mở rộng menu con"
                      >
                        <i className={`bi ${isDropdownOpen ? 'bi-chevron-up text-primary fw-bold' : 'bi-chevron-down'}`}></i>
                      </button>
                    </div>

                    {/* Submenu List */}
                    <ul className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.dropdownMenuOpen : ''}`}>
                      {menu.children?.map((child) => (
                        <li key={child.id} className={styles.dropdownItem}>
                          {child.url.startsWith('#') ? (
                            <a
                              href={child.url}
                              className={`${styles.dropdownLink} ${isLinkActive(child.url) ? styles.dropdownLinkActive : ''}`}
                              onClick={closeAll}
                            >
                              {child.icon && <i className={`bi ${child.icon} ${styles.itemIcon}`}></i>}
                              <span>{child.title}</span>
                            </a>
                          ) : (
                            <Link
                              href={child.url}
                              className={`${styles.dropdownLink} ${isLinkActive(child.url) ? styles.dropdownLinkActive : ''}`}
                              onClick={closeAll}
                            >
                              {child.icon && <i className={`bi ${child.icon} ${styles.itemIcon}`}></i>}
                              <span>{child.title}</span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              // Menu đơn thông thường (Không có con)
              return (
                <li key={menu.id} className="nav-item">
                  {menu.url.startsWith('#') ? (
                    <a 
                      href={menu.url} 
                      className={`${styles.navLink} ${isLinkActive(menu.url) ? styles.navLinkActive : ''}`}
                      onClick={closeAll}
                    >
                      {menu.icon && <i className={`bi ${menu.icon}`}></i>}
                      <span>{menu.title}</span>
                    </a>
                  ) : (
                    <Link 
                      href={menu.url} 
                      className={`${styles.navLink} ${isLinkActive(menu.url) ? styles.navLinkActive : ''}`}
                      onClick={closeAll}
                    >
                      {menu.icon && <i className={`bi ${menu.icon}`}></i>}
                      <span>{menu.title}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* User Account / Login Button */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {auth && auth.user ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm"
                  type="button"
                  onClick={() => auth.logout()}
                >
                  <i className="bi bi-person-circle"></i>
                  <span>{auth.user.fullName || auth.user.username || 'Tài khoản'}</span>
                  <i className="bi bi-box-arrow-right ms-1 text-danger" title="Đăng xuất"></i>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="btn btn-primary rounded-pill px-4 py-2 shadow-sm font-semibold d-flex align-items-center gap-2"
                onClick={closeAll}
              >
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
