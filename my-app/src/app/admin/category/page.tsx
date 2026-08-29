'use client';

import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types/category';
import styles from '../repair/repair.module.css';

export default function CategoriesPage() {
  const { categories, loading, error, refresh, createCategory, updateCategory, removeCategory } = useCategories();
  
  // Trạng thái Form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setFormError(null);
    setFormSuccess(null);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name || '');
    setDescription(category.description || '');
    setFormError(null);
    setFormSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setFormError('Vui lòng nhập tên danh mục.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      setFormSuccess(null);
      
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
      };

      if (editingId) {
        await updateCategory(editingId, payload);
        setFormSuccess('Cập nhật danh mục thiết bị thành công!');
      } else {
        await createCategory(payload);
        setFormSuccess('Thêm danh mục thiết bị thành công!');
      }
      
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Đã xảy ra lỗi khi lưu danh mục.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục thiết bị này?')) {
      return;
    }
    try {
      await removeCategory(id);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa danh mục.');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Quản Lý Danh Mục Thiết Bị</h1>
          <p className={styles.subtitle}>Phân loại các dòng thiết bị điện lạnh: Máy lạnh, Tủ lạnh, Máy giặt, Điều hòa trung tâm...</p>
        </header>

        {/* Form Thêm Mới / Cập Nhật */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className={`bi ${editingId ? 'bi-pencil-square text-warning' : 'bi-plus-circle-fill text-primary'}`}></i>
            {editingId ? 'Chỉnh Sửa Danh Mục' : 'Thêm Mới Danh Mục'}
          </h2>

          {formError && <div className={styles.errorAlert}>{formError}</div>}
          {formSuccess && <div className={styles.successAlert}>{formSuccess}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">Tên Danh Mục Thiết Bị *</label>
                  <input
                    type="text"
                    id="name"
                    className={styles.input}
                    placeholder="VD: Máy Lạnh Dân Dụng, Tủ Lạnh Inverter, Máy Giặt Cửa Ngang..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">Mô Tả Kỹ Thuật</label>
              <textarea
                id="description"
                className={styles.textarea}
                placeholder="Nhập ghi chú mô tả về nhóm thiết bị hoặc đặc tính kỹ thuật..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
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
                  <span><i className="bi bi-plus-lg me-1"></i>Tạo Danh Mục</span>
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

        {/* Bảng Danh Sách Danh Mục */}
        <div className={styles.card}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>
              <i className="bi bi-tags-fill text-primary"></i>
              Danh Sách Danh Mục ({categories.length})
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
              <p className="mt-2 text-muted">Đang tải danh sách danh mục...</p>
            </div>
          ) : error && categories.length === 0 ? (
            <div className={styles.errorAlert}>
              <p><strong>Lỗi kết nối API:</strong> {error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-tag fs-1 d-block mb-2 text-secondary"></i>
              Chưa có danh mục nào. Hãy tạo danh mục đầu tiên ở biểu mẫu phía trên!
            </div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th style={{ width: '25%' }}>Tên Danh Mục</th>
                    <th>Mô Tả Kỹ Thuật</th>
                    <th style={{ width: '140px' }}>Trạng Thái</th>
                    <th style={{ width: '130px' }}>Ngày Tạo</th>
                    <th style={{ textAlign: 'right', width: '110px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>#{category.id}</td>
                      <td>
                        <strong className="text-dark">{category.name}</strong>
                      </td>
                      <td>
                        <span className="text-secondary small">
                          {category.description || <em className="text-muted">Không có mô tả</em>}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${category.isActive !== false ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} rounded-pill px-2.5 py-1`}>
                          {category.isActive !== false ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(category.created)}
                        </small>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                          onClick={() => handleEdit(category)}
                          title="Chỉnh sửa danh mục"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => handleDelete(category.id)}
                          title="Xóa danh mục"
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
