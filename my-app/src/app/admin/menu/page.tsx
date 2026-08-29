'use client';

import React, { useState } from 'react';
import { useMenus } from '@/hooks/useMenus';
import styles from './menu.module.css';

export default function MenuManagementPage() {
  const { menus, loading, error, refresh, createMenu, removeMenu } = useMenus();

  // Trạng thái Form
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('bi-link');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [parentId, setParentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Danh sách các menu có thể làm menu Cha (những menu chưa có parentId)
  const parentMenuOptions = menus.filter(m => !m.parentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Vui lòng nhập tiêu đề menu.');
      return;
    }
    if (!url.trim()) {
      setFormError('Vui lòng nhập đường dẫn URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      setFormSuccess(null);

      await createMenu({
        title: title.trim(),
        url: url.trim(),
        icon: icon.trim() || undefined,
        sortOrder: Number(sortOrder),
        parentId: parentId ? Number(parentId) : null,
      });

      setFormSuccess('Thêm menu thành công!');
      setTitle('');
      setUrl('');
      setIcon('bi-link');
      setSortOrder(0);
      setParentId('');
    } catch (err: any) {
      setFormError(err.message || 'Đã xảy ra lỗi khi thêm menu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa menu này không? (Các menu con nếu có cũng sẽ bị xóa)')) {
      return;
    }
    try {
      await removeMenu(String(id));
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa menu.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.glowBall}></div>

        <header className={styles.header}>
          <h1 className={styles.title}>HỆ THỐNG ĐIỆN LẠNH DMS</h1>
          <p className={styles.subtitle}>Quản lý thanh điều hướng và menu</p>
        </header>

        <div className={styles.contentGrid}>
          {/* Cột Trái - Form Thêm Mới */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Thêm Menu Mới</h2>

            {formError && <div className={styles.errorAlert}>{formError}</div>}
            {formSuccess && <div className={styles.successAlert}>{formSuccess}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="title">Tiêu Đề Menu *</label>
                <input
                  type="text"
                  id="title"
                  className={styles.input}
                  placeholder="Ví dụ: Trang Chủ, Giới Thiệu..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="url">Đường Dẫn URL *</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      id="url"
                      className={styles.input}
                      placeholder="Ví dụ: /, /repair/1, /#pricing, /tips, /#contact"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={isSubmitting}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* Preset quick links */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <small style={{ color: '#94a3b8', width: '100%', fontSize: '0.75rem' }}>Gợi ý nhanh:</small>
                    {[
                      { name: 'Trang chủ', link: '/' },
                      { name: 'Dịch vụ', link: '#services' },
                      { name: 'Bảng giá', link: '/#pricing' },
                      { name: 'Cẩm nang', link: '/tips' },
                      { name: 'Liên hệ', link: '/#contact' },
                      { name: 'Sửa Máy Lạnh', link: '/repair/1' },
                      { name: 'Sửa Tủ Lạnh', link: '/repair/2' },
                      { name: 'Sửa Máy Giặt', link: '/repair/3' },
                    ].map(p => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => { setUrl(p.link); if (!title) setTitle(p.name); }}
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#38bdf8',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          padding: '0.15rem 0.45rem',
                          cursor: 'pointer',
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="icon">Bootstrap Icon Class</label>
                  <input
                    type="text"
                    id="icon"
                    className={styles.input}
                    placeholder="Ví dụ: bi-house-door, bi-tools, bi-snow, bi-tags, bi-telephone..."
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="parentId">Thuộc Menu Cha (Để trống nếu là Menu gốc)</label>
                <select
                  id="parentId"
                  className={styles.input}
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">-- Là Menu gốc (Cấp 1) --</option>
                  {parentMenuOptions.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="sortOrder">Thứ Tự Sắp Xếp</label>
                <input
                  type="number"
                  id="sortOrder"
                  className={styles.input}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang Xử Lý...' : 'Tạo Menu'}
              </button>
            </form>
          </div>

          {/* Cột Phải - Danh Sách */}
          <div>
            {loading ? (
              <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p>Đang tải danh sách menu...</p>
              </div>
            ) : error && menus.length === 0 ? (
              <div className={styles.errorAlert}>
                <p><strong>Lỗi kết nối API Backend:</strong></p>
                <p>{error}</p>
                <button
                  onClick={refresh}
                  className={styles.button}
                  style={{ marginTop: '1rem', width: 'auto', display: 'inline-block' }}
                >
                  Thử Kết Nối Lại
                </button>
              </div>
            ) : menus.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>Chưa có menu nào</h3>
                <p>Dữ liệu trống. Hãy tạo menu đầu tiên ở form bên trái.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
                    Danh Sách Menu ({menus.length})
                  </h2>
                  <button
                    onClick={refresh}
                    className={styles.button}
                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', boxShadow: 'none' }}
                  >
                    Làm Mới
                  </button>
                </div>

                <div className={styles.grid}>
                  {[...menus]
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((menu) => (
                      <div key={menu.id} className={styles.menuCard}>
                        <div className={styles.menuHeader}>
                          <span className={styles.menuTitle}>
                            {menu.icon && <i className={`bi ${menu.icon} text-info`}></i>}
                            {menu.title}
                          </span>
                          <span className={`${styles.badge} ${menu.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                            {menu.isActive ? 'Hoạt động' : 'Tạm dừng'}
                          </span>
                        </div>

                        <div className={styles.menuUrl}>{menu.url}</div>

                        <div className={styles.menuMeta}>
                          <div>
                            {menu.parentId ? (
                              <span style={{ color: '#38bdf8', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>
                                <i className="bi bi-arrow-return-right me-1"></i>Con của: <strong>{menu.parentTitle || `ID ${menu.parentId}`}</strong>
                              </span>
                            ) : (
                              <span style={{ color: '#a855f7', fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>
                                <i className="bi bi-folder-fill me-1"></i>Menu Gốc (Cha)
                              </span>
                            )}
                            <span>Thứ tự: {menu.sortOrder}</span>
                          </div>

                          <button
                            onClick={() => handleDelete(menu.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                            }}
                          >
                            <i className="bi bi-trash"></i> Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
