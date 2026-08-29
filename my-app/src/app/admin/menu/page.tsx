'use client';

import React, { useState } from 'react';
import { useMenus } from '@/hooks/useMenus';
import { Menu } from '@/types/menu';
import styles from '../repair/repair.module.css';

export default function MenuManagementPage() {
  const { menus, loading, error, refresh, createMenu, updateMenu, removeMenu } = useMenus();

  // Trạng thái Form
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('bi-link');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [parentId, setParentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Danh sách các menu có thể làm menu Cha (những menu chưa có parentId và không phải chính nó)
  const parentMenuOptions = menus.filter(m => !m.parentId && String(m.id) !== String(editingId));

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setUrl('');
    setIcon('bi-link');
    setSortOrder(0);
    setParentId('');
    setFormError(null);
    setFormSuccess(null);
  };

  const handleEdit = (menu: Menu) => {
    setEditingId(menu.id);
    setTitle(menu.title || '');
    setUrl(menu.url || '');
    setIcon(menu.icon || 'bi-link');
    setSortOrder(menu.sortOrder || 0);
    setParentId(menu.parentId ? String(menu.parentId) : '');
    setFormError(null);
    setFormSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

      const payload = {
        title: title.trim(),
        url: url.trim(),
        icon: icon.trim() || undefined,
        sortOrder: Number(sortOrder),
        parentId: parentId ? Number(parentId) : null,
      };

      if (editingId) {
        await updateMenu(String(editingId), {
          ...payload,
          id: editingId,
        } as any);
        setFormSuccess('Cập nhật menu thành công!');
      } else {
        await createMenu(payload);
        setFormSuccess('Thêm menu điều hướng thành công!');
      }

      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Đã xảy ra lỗi khi lưu menu.');
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
        <header className={styles.header}>
          <h1 className={styles.title}>Quản Lý Menu Điều Hướng</h1>
          <p className={styles.subtitle}>Cấu hình hệ thống menu đa cấp Header và Footer cho toàn bộ website</p>
        </header>

        {/* Form Thêm Mới / Cập Nhật Menu */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className={`bi ${editingId ? 'bi-pencil-square text-warning' : 'bi-plus-circle-fill text-primary'}`}></i>
            {editingId ? 'Chỉnh Sửa Menu' : 'Thêm Mới Menu Điều Hướng'}
          </h2>

          {formError && <div className={styles.errorAlert}>{formError}</div>}
          {formSuccess && <div className={styles.successAlert}>{formSuccess}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="title">Tiêu Đề Menu *</label>
                  <input
                    type="text"
                    id="title"
                    className={styles.input}
                    placeholder="VD: Trang Chủ, Dịch Vụ Sửa Chữa, Bảng Giá..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="icon">Bootstrap Icon Class</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      id="icon"
                      className={styles.input}
                      placeholder="VD: bi-house-door, bi-tools, bi-snow, bi-tags..."
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      disabled={isSubmitting}
                    />
                    {icon && (
                      <div className="d-flex align-items-center justify-content-center bg-light border rounded px-3 py-2">
                        <i className={`bi ${icon} fs-5 text-primary`}></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="url">Đường Dẫn URL (Link) *</label>
                  <input
                    type="text"
                    id="url"
                    className={styles.input}
                    placeholder="VD: /, /repair/1, /#pricing, /tips, /#contact..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {/* Preset quick links */}
                  <div className="d-flex flex-wrap gap-1 mt-2 align-items-center">
                    <small className="text-muted me-1">Gợi ý nhanh:</small>
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
                        className="btn btn-sm btn-outline-primary py-0 px-2"
                        style={{ fontSize: '0.75rem', borderRadius: '4px' }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
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
              </div>

              <div className="col-md-6">
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
              </div>
            </div>

            <div className="d-flex align-items-center mt-4">
              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span><i className="bi bi-hourglass-split me-1"></i>Đang xử lý...</span>
                ) : editingId ? (
                  <span><i className="bi bi-check2-circle me-1"></i>Lưu Cập Nhật</span>
                ) : (
                  <span><i className="bi bi-plus-lg me-1"></i>Tạo Menu</span>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  className={styles.buttonSecondary}
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Hủy Chỉnh Sửa
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Bảng Danh Sách Menu */}
        <div className={styles.card}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>
              <i className="bi bi-list-nested text-primary"></i>
              Danh Sách Menu Điều Hướng ({menus.length})
            </h2>
            <button
              onClick={refresh}
              className={styles.buttonSecondary}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>Làm Mới
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Đang tải danh sách menu...</p>
            </div>
          ) : error && menus.length === 0 ? (
            <div className={styles.errorAlert}>
              <p><strong>Lỗi kết nối API:</strong> {error}</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-link-45deg fs-1 d-block mb-2 text-secondary"></i>
              Chưa có menu nào. Hãy tạo menu đầu tiên ở biểu mẫu phía trên!
            </div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Icon</th>
                    <th style={{ width: '22%' }}>Tiêu Đề Menu</th>
                    <th>Đường Dẫn URL</th>
                    <th style={{ width: '180px' }}>Cấp Độ / Menu Cha</th>
                    <th style={{ width: '100px' }}>Thứ Tự</th>
                    <th style={{ width: '120px' }}>Trạng Thái</th>
                    <th style={{ textAlign: 'right', width: '110px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {[...menus]
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((menu) => (
                      <tr key={menu.id}>
                        <td>
                          <div className="d-flex align-items-center justify-content-center bg-light rounded text-primary" style={{ width: '36px', height: '36px' }}>
                            <i className={`bi ${menu.icon || 'bi-link'}`}></i>
                          </div>
                        </td>
                        <td>
                          <strong className="text-dark">{menu.title}</strong>
                        </td>
                        <td>
                          <code className="text-primary bg-light px-2 py-1 rounded small">{menu.url}</code>
                        </td>
                        <td>
                          {menu.parentId ? (
                            <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-2.5 py-1">
                              <i className="bi bi-arrow-return-right me-1"></i>
                              {menu.parentTitle || `ID #${menu.parentId}`}
                            </span>
                          ) : (
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1">
                              <i className="bi bi-folder-fill me-1"></i> Menu Gốc
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="fw-semibold text-secondary">{menu.sortOrder}</span>
                        </td>
                        <td>
                          <span className={`badge ${menu.isActive !== false ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} rounded-pill px-2.5 py-1`}>
                            {menu.isActive !== false ? 'Hoạt động' : 'Tạm dừng'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                            onClick={() => handleEdit(menu)}
                            title="Chỉnh sửa menu"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                            onClick={() => handleDelete(menu.id)}
                            title="Xóa menu"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
