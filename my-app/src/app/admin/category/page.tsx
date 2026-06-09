'use client';

import React, { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';

export default function CategoriesPage() {
  const { categories, loading, error, refresh, createCategory } = useCategories();
  
  // Trạng thái Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
      
      await createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      setFormSuccess('Thêm danh mục thiết bị thành công!');
      setName('');
      setDescription('');
      
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess(null);
      }, 1000);
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

  const openAddModal = () => {
    setFormError(null);
    setFormSuccess(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  return (
    <div className="py-2">
      {/* Tiêu đề chính */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800 fw-bold">Danh Mục Thiết Bị</h1>
      </div>

      {/* Khung nội dung Full-Width */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4 text-dark border-0 rounded-3 overflow-hidden">
            <div className="card-header py-3 d-flex justify-content-between align-items-center bg-white border-bottom">
              <h6 className="m-0 font-weight-bold text-primary fs-5">
                Danh Sách Danh Mục ({categories.length})
              </h6>
              <div className="d-flex gap-2">
                <button 
                  onClick={refresh} 
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                >
                  <i className="bi bi-arrow-clockwise"></i> Làm Mới
                </button>
                <button 
                  onClick={openAddModal} 
                  type="button"
                  className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                >
                  <i className="bi bi-plus-lg"></i> Thêm Mới
                </button>
              </div>
            </div>
            <div className="card-body bg-white p-0">
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover mb-0 align-middle" id="dataTable" width="100%" cellSpacing="0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '25%' }}>Tên Danh Mục</th>
                      <th>Mô Tả Kỹ Thuật</th>
                      <th style={{ width: '15%' }}>Trạng Thái</th>
                      <th style={{ width: '20%' }}>Ngày Tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-secondary">
                          Đang tải danh sách danh mục...
                        </td>
                      </tr>
                    ) : error && categories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-danger">
                          Không thể tải dữ liệu: {error}
                        </td>
                      </tr>
                    ) : categories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          Dữ liệu trống. Vui lòng thêm danh mục mới.
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category.id}>
                          <td className="fw-bold text-dark">{category.name}</td>
                          <td className="text-secondary small">
                            {category.description || <em className="text-muted">Không có mô tả</em>}
                          </td>
                          <td>
                            <span className={`badge ${category.isActive ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} rounded-pill px-2.5 py-1`}>
                              {category.isActive ? 'Hoạt động' : 'Tạm dừng'}
                            </span>
                          </td>
                          <td className="text-muted small">
                            {formatDate(category.created)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal - Thêm Mới */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered text-dark">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-primary d-flex align-items-center gap-2">
                  <i className="bi bi-tag"></i> Thêm Danh Mục Mới
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  aria-label="Close"
                ></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {formError && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                      <div>{formError}</div>
                    </div>
                  )}
                  {formSuccess && (
                    <div className="alert alert-success d-flex align-items-center gap-2 py-2" role="alert">
                      <i className="bi bi-check-circle-fill"></i>
                      <div>{formSuccess}</div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="modalName" className="form-label fw-bold text-secondary small">Tên Danh Mục *</label>
                    <input
                      type="text"
                      id="modalName"
                      className="form-control"
                      placeholder="Ví dụ: Máy Lạnh, Tủ Lạnh, Máy Giặt..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="modalDescription" className="form-label fw-bold text-secondary small">Mô Tả Kỹ Thuật</label>
                    <textarea
                      id="modalDescription"
                      className="form-control"
                      placeholder="Nhập mô tả chi tiết dòng thiết bị..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={isSubmitting}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="modal-footer bg-light border-top-0 d-flex justify-content-end gap-2 p-3">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                  >
                    Đóng
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {isSubmitting ? 'Đang tạo...' : 'Tạo Danh Mục'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
