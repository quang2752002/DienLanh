'use client';

import React, { useState } from 'react';
import { useRepairs } from '@/hooks/useRepairs';
import { useCategories } from '@/hooks/useCategories';
import CKEditor from '@/components/CKEditor';
import { Repair } from '@/types/repair';
import styles from './repair.module.css';

export default function RepairManagementPage() {
  const { repairs, loading, error, refresh, createRepair, updateRepair, removeRepair } = useRepairs();
  const { categories } = useCategories();

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImg('');
    setContent('');
    setCategoryId('');
    setFormError(null);
    setFormSuccess(null);
  };

  const handleEdit = (repair: Repair) => {
    setEditingId(repair.id);
    setName(repair.name || '');
    setDescription(repair.description || '');
    setImg(repair.img || '');
    setContent(repair.content || '');
    setCategoryId(repair.categoryId ? String(repair.categoryId) : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFormError('Vui lòng nhập tên dịch vụ sửa chữa.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      setFormSuccess(null);

      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        img: img.trim() || undefined,
        content: content || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      };

      if (editingId) {
        await updateRepair(String(editingId), {
          ...payload,
          id: editingId,
        } as any);
        setFormSuccess('Cập nhật bài viết dịch vụ sửa chữa thành công!');
      } else {
        await createRepair(payload);
        setFormSuccess('Thêm bài viết dịch vụ sửa chữa thành công!');
      }

      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Đã xảy ra lỗi khi lưu dịch vụ sửa chữa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết dịch vụ sửa chữa này không?')) {
      return;
    }
    try {
      await removeRepair(String(id));
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bài viết dịch vụ.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Quản Lý Dịch Vụ Sửa Chữa (Bài Viết)</h1>
          <p className={styles.subtitle}>Tạo và chỉnh sửa nội dung bài viết dịch vụ sửa chữa chi tiết với trình soạn thảo CKEditor</p>
        </header>

        {/* Form thêm mới / cập nhật */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <i className={`bi ${editingId ? 'bi-pencil-square text-warning' : 'bi-plus-circle-fill text-primary'}`}></i>
            {editingId ? 'Chỉnh Sửa Bài Viết Dịch Vụ' : 'Thêm Mới Bài Viết Dịch Vụ'}
          </h2>

          {formError && <div className={styles.errorAlert}>{formError}</div>}
          {formSuccess && <div className={styles.successAlert}>{formSuccess}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">Tên Dịch Vụ Sửa Chữa *</label>
                  <input
                    type="text"
                    id="name"
                    className={styles.input}
                    placeholder="VD: Sửa Chữa Bo Mạch Máy Lạnh Daikin Inverter..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="categoryId">Danh Mục Thiết Bị</label>
                  <select
                    id="categoryId"
                    className={styles.input}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="img">Đường Dẫn Hình Ảnh Đại Diện (URL)</label>
                  <input
                    type="text"
                    id="img"
                    className={styles.input}
                    placeholder="https://images.unsplash.com/... hoặc /images/..."
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">Mô Tả Ngắn</label>
              <textarea
                id="description"
                className={styles.textarea}
                placeholder="Tóm tắt tình trạng hư hỏng, nguyên nhân và hướng xử lý nhanh..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Trình soạn thảo CKEditor cho nội dung bài viết */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Nội Dung Bài Viết Chi Tiết (Soạn thảo CKEditor)</label>
              <CKEditor
                id="repair-content-editor"
                value={content}
                onChange={(data) => setContent(data)}
                placeholder="Soạn thảo quy trình sửa chữa, hình ảnh thực tế, bảng giá linh kiện, bảo hành..."
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
                  <span><i className="bi bi-plus-lg me-1"></i>Đăng Bài Viết</span>
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

        {/* Bảng danh sách bài viết dịch vụ sửa chữa */}
        <div className={styles.card}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>
              <i className="bi bi-list-columns text-primary"></i>
              Danh Sách Dịch Vụ Sửa Chữa ({repairs.length})
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
              <p className="mt-2 text-muted">Đang tải danh sách bài viết dịch vụ...</p>
            </div>
          ) : error && repairs.length === 0 ? (
            <div className={styles.errorAlert}>
              <p><strong>Lỗi kết nối API:</strong> {error}</p>
            </div>
          ) : repairs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-journal-x fs-1 d-block mb-2 text-secondary"></i>
              Chưa có bài viết dịch vụ nào. Hãy tạo bài viết đầu tiên ở biểu mẫu phía trên!
            </div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Hình ảnh</th>
                    <th>Tên dịch vụ / Bài viết</th>
                    <th>Danh mục</th>
                    <th>Ngày tạo</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {repairs.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>
                        {item.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.img}
                            alt={item.name}
                            style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <span className="badge bg-light text-secondary border">No img</span>
                        )}
                      </td>
                      <td>
                        <strong className="text-dark d-block">{item.name}</strong>
                        {item.description && (
                          <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '350px' }}>
                            {item.description}
                          </small>
                        )}
                      </td>
                      <td>
                        <span className={styles.badge}>
                          {item.categoryName || 'Chung'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {item.created ? new Date(item.created).toLocaleDateString('vi-VN') : '---'}
                        </small>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                          onClick={() => handleEdit(item)}
                          title="Chỉnh sửa bài viết"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => handleDelete(item.id)}
                          title="Xóa bài viết"
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
