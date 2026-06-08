'use client';

import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const { categories, loading, error, refresh, createCategory } = useCategories();
  
  // Trạng thái Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate nhanh ở client-side
    if (!name.trim()) {
      setFormError('Vui lòng nhập tên danh mục.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      setFormSuccess(null);
      
      await createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      setFormSuccess('Thêm danh mục thiết bị thành công!');
      setName('');
      setDescription('');
    } catch (err: any) {
      setFormError(err.message || 'Đã xảy ra lỗi khi thêm danh mục.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Vừa xong';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Lớp nền phát sáng */}
        <div className={styles.glowBall}></div>
        
        {/* Tiêu đề chính */}
        <header className={styles.header}>
          <h1 className={styles.title}>HỆ THỐNG ĐIỆN LẠNH DMS</h1>
          <p className={styles.subtitle}>Quản lý danh mục thiết bị điện lạnh kỹ thuật</p>
        </header>

        {/* Khung nội dung */}
        <div className={styles.contentGrid}>
          {/* Cột Trái - Form Thêm Mới */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Thêm Danh Mục Mới</h2>
            
            {formError && <div className={styles.errorAlert}>{formError}</div>}
            {formSuccess && <div className={styles.successAlert}>{formSuccess}</div>}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="name">Tên Danh Mục *</label>
                <input
                  type="text"
                  id="name"
                  className={styles.input}
                  placeholder="Ví dụ: Máy Lạnh, Tủ Lạnh, Máy Giặt..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="description">Mô Tả Kỹ Thuật</label>
                <textarea
                  id="description"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Nhập mô tả chi tiết hoặc ghi chú về dòng thiết bị..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang Xử Lý...' : 'Tạo Danh Mục'}
              </button>
            </form>
          </div>

          {/* Cột Phải - Danh Sách Thực Tế Gọi Từ API */}
          <div>
            {loading ? (
              <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p>Đang kết nối API để tải danh sách danh mục...</p>
              </div>
            ) : error && categories.length === 0 ? (
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
            ) : categories.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>Chưa có danh mục nào</h3>
                <p>Dữ liệu trống. Hãy nhập danh mục mới ở form bên trái.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
                    Danh Sách Danh Mục ({categories.length})
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
                  {categories.map((category) => (
                    <div key={category.id} className={styles.categoryCard}>
                      <div className={styles.catHeader}>
                        <span className={styles.catName}>{category.name}</span>
                        <span className={`${styles.badge} ${category.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                          {category.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                      
                      <p className={styles.catDesc}>
                        {category.description || 'Không có mô tả kỹ thuật cho danh mục này.'}
                      </p>

                      <div className={styles.catMeta}>
                        <span>Mã: {category.id.substring(0, 8)}...</span>
                        <span>{formatDate(category.created)}</span>
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
