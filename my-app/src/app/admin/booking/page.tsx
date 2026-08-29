'use client';

import React from 'react';
import { useRepairBookings } from '@/hooks/useRepairBookings';
import styles from '../repair/repair.module.css';

export default function RepairBookingAdminPage() {
  const { bookings, loading, error, refresh, updateBookingStatus, removeBooking, updatingStatus } = useRepairBookings();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateBookingStatus(id, newStatus);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái lịch hẹn.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này không?')) return;
    try {
      await removeBooking(String(id));
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa lịch hẹn.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge bg-primary">Đã tiếp nhận</span>;
      case 'Completed':
        return <span className="badge bg-success">Đã hoàn thành</span>;
      case 'Cancelled':
        return <span className="badge bg-danger">Đã hủy</span>;
      default:
        return <span className="badge bg-warning text-dark">Chờ xử lý</span>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>Quản Lý Đăng Ký Dịch Vụ Sửa Chữa</h1>
          <p className={styles.subtitle}>Danh sách khách hàng & người dùng đã đăng ký đặt lịch sửa chữa thiết bị điện lạnh</p>
        </header>

        <div className={styles.card}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>
              <i className="bi bi-calendar2-check text-primary"></i>
              Danh Sách Đặt Lịch ({bookings.length})
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
              <p className="mt-2 text-muted">Đang tải danh sách đặt lịch...</p>
            </div>
          ) : error && bookings.length === 0 ? (
            <div className={styles.errorAlert}>
              <p><strong>Lỗi kết nối API:</strong> {error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 d-block mb-2 text-secondary"></i>
              Chưa có khách hàng nào đăng ký đặt lịch sửa chữa.
            </div>
          ) : (
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã ĐL</th>
                    <th>Dịch vụ sửa chữa</th>
                    <th>Khách hàng / SĐT</th>
                    <th>Tài khoản User</th>
                    <th>Ngày hẹn kiểm tra</th>
                    <th>Ghi chú lỗi</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((item) => (
                    <tr key={item.id}>
                      <td><strong>#{item.id}</strong></td>
                      <td>
                        <span className="text-primary fw-semibold">{item.repairName || `Repair #${item.repairId}`}</span>
                      </td>
                      <td>
                        <strong className="text-dark d-block">{item.customerName}</strong>
                        <a href={`tel:${item.phoneNumber}`} className="text-decoration-none small text-muted">
                          <i className="bi bi-telephone-fill me-1 text-success"></i>{item.phoneNumber}
                        </a>
                      </td>
                      <td>
                        {item.userId ? (
                          <span className="badge bg-light text-dark border">
                            <i className="bi bi-person-fill me-1"></i>
                            {item.userName || `User #${item.userId}`}
                          </span>
                        ) : (
                          <span className="text-muted small">Khách vãng lai</span>
                        )}
                      </td>
                      <td>
                        <span className="d-block small fw-bold text-dark">
                          {item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('vi-VN') : '---'}
                        </span>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Tạo: {item.created ? new Date(item.created).toLocaleDateString('vi-VN') : '---'}
                        </small>
                      </td>
                      <td>
                        <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={item.notes}>
                          {item.notes || 'Không có ghi chú'}
                        </small>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={item.status || 'Pending'}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          disabled={updatingStatus}
                          style={{ minWidth: '130px', fontSize: '0.8rem', borderRadius: '20px' }}
                        >
                          <option value="Pending">Chờ xử lý</option>
                          <option value="Confirmed">Đã tiếp nhận</option>
                          <option value="Completed">Đã hoàn thành</option>
                          <option value="Cancelled">Đã hủy</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => handleDelete(item.id)}
                          title="Xóa lịch đặt"
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
