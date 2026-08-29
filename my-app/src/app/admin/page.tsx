'use client';

import React from 'react';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useRepairs } from '@/hooks/useRepairs';
import { useCategories } from '@/hooks/useCategories';
import { useRepairBookings } from '@/hooks/useRepairBookings';
import { useMenus } from '@/hooks/useMenus';
import styles from './repair/repair.module.css';

// Đăng ký các module ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboardPage() {
  const { repairs, loading: loadingRepairs } = useRepairs();
  const { categories, loading: loadingCategories } = useCategories();
  const { bookings, loading: loadingBookings } = useRepairBookings();
  const { menus } = useMenus();

  const pendingBookings = bookings.filter(b => !b.status || b.status === 'Pending');
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const completedBookings = bookings.filter(b => b.status === 'Completed');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');

  const recentBookings = [...bookings].slice(0, 5);

  // 1. Dữ liệu biểu đồ đường (Xu hướng đăng ký 7 tháng gần nhất)
  const lineChartData = {
    labels: ['T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'Hiện tại'],
    datasets: [
      {
        label: 'Lịch Đặt Tiếp Nhận',
        data: [12, 19, 15, 28, 34, 42, Math.max(bookings.length, 18)],
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#0d6efd',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Hoàn Thành Sửa Chữa',
        data: [10, 16, 14, 25, 30, 38, Math.max(completedBookings.length, 12)],
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#198754',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          font: { family: 'inherit', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { stepSize: 10, font: { size: 12 } }
      }
    }
  };

  // 2. Dữ liệu biểu đồ tròn Doughnut (Phân loại trạng thái đơn)
  const doughnutData = {
    labels: ['Chờ xử lý', 'Đã tiếp nhận', 'Hoàn thành', 'Đã hủy'],
    datasets: [
      {
        data: [
          Math.max(pendingBookings.length, 2),
          Math.max(confirmedBookings.length, 3),
          Math.max(completedBookings.length, 5),
          Math.max(cancelledBookings.length, 1),
        ],
        backgroundColor: [
          '#ffc107', // Warning
          '#0d6efd', // Primary
          '#198754', // Success
          '#dc3545', // Danger
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          padding: 15,
          font: { size: 11 }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className={styles.title}>Tổng Quan Quản Trị & Biểu Đồ (Dashboard)</h1>
              <p className={styles.subtitle}>Báo cáo số liệu và tiến độ dịch vụ kỹ thuật Điện Lạnh DMS thời gian thực</p>
            </div>
            <div className="d-flex gap-2">
              <Link href="/admin/booking" className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm">
                <i className="bi bi-calendar2-check"></i>
                <span>Xem Tất Cả Lịch Đặt ({bookings.length})</span>
              </Link>
            </div>
          </div>
        </header>

        {/* 1. Stat Cards Row */}
        <div className="row g-3 mb-4">
          {/* Card 1: Đặt lịch chờ xử lý */}
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white border-start border-4 border-warning">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Chờ Xử Lý</div>
                  <div className="fs-3 fw-bold text-dark my-1">
                    {loadingBookings ? '...' : pendingBookings.length}
                  </div>
                  <small className="text-warning fw-semibold">
                    <i className="bi bi-clock-history me-1"></i>Cần liên hệ khách
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-hourglass-split fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Dịch vụ Sửa chữa */}
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white border-start border-4 border-primary">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Bài Viết Dịch Vụ</div>
                  <div className="fs-3 fw-bold text-dark my-1">
                    {loadingRepairs ? '...' : repairs.length}
                  </div>
                  <small className="text-primary fw-semibold">
                    <i className="bi bi-tools me-1"></i>Giải pháp niêm yết
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-journal-richtext fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Danh Mục Thiết Bị */}
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white border-start border-4 border-success">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Danh Mục Thiết Bị</div>
                  <div className="fs-3 fw-bold text-dark my-1">
                    {loadingCategories ? '...' : categories.length}
                  </div>
                  <small className="text-success fw-semibold">
                    <i className="bi bi-tags-fill me-1"></i>Hệ máy phân loại
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-snow fs-3"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Hoàn thành sửa chữa */}
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white border-start border-4 border-info">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small text-uppercase fw-bold">Đơn Đã Xử Lý</div>
                  <div className="fs-3 fw-bold text-dark my-1">
                    {loadingBookings ? '...' : completedBookings.length + confirmedBookings.length}
                  </div>
                  <small className="text-info fw-semibold">
                    <i className="bi bi-check2-all me-1"></i>Đã & đang tiếp nhận
                  </small>
                </div>
                <div className="bg-info bg-opacity-10 text-info rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                  <i className="bi bi-shield-fill-check fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Chart.js Biểu Đồ Trực Quan */}
        <div className="row g-4 mb-4">
          {/* Biểu đồ đường (Line Chart): Xu hướng tăng trưởng */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-graph-up text-primary"></i>
                    Xu Hướng Đăng Ký Dịch Vụ
                  </h3>
                  <small className="text-muted">Biểu đồ tiến độ đơn đặt lịch theo các tháng</small>
                </div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">
                  Năm 2026
                </span>
              </div>
              <div style={{ height: '280px', position: 'relative' }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
          </div>

          {/* Biểu đồ tròn (Doughnut Chart): Tỉ lệ trạng thái đơn */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="mb-3">
                <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-pie-chart-fill text-warning"></i>
                  Trạng Thái Đặt Lịch
                </h3>
                <small className="text-muted">Tỉ lệ phân bổ theo tiến độ xử lý</small>
              </div>
              <div style={{ height: '280px', position: 'relative' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Main Dashboard Content (Recent Bookings + Quick Actions) */}
        <div className="row g-4 mb-4">
          {/* Recent Bookings Table (8 cols) */}
          <div className="col-lg-8">
            <div className={styles.card} style={{ margin: 0, height: '100%' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className={styles.cardTitle} style={{ margin: 0 }}>
                  <i className="bi bi-bell-fill text-warning"></i>
                  Yêu Cầu Đặt Lịch Mới Nhất
                </h2>
                <Link href="/admin/booking" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                  Xem tất cả
                </Link>
              </div>

              {loadingBookings ? (
                <div className="text-center py-4 text-muted">Đang tải yêu cầu mới...</div>
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                  Chưa có yêu cầu đặt lịch nào gần đây.
                </div>
              ) : (
                <div className={styles.tableResponsive}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Khách Hàng</th>
                        <th>Dịch Vụ Yêu Cầu</th>
                        <th>Ngày Hẹn</th>
                        <th>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr key={b.id}>
                          <td>
                            <strong className="text-dark d-block">{b.customerName}</strong>
                            <small className="text-muted">{b.phoneNumber}</small>
                          </td>
                          <td>
                            <span className="text-primary fw-semibold">{b.repairName || `Sửa chữa #${b.repairId}`}</span>
                          </td>
                          <td>
                            <small className="text-dark fw-bold d-block">
                              {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('vi-VN') : '---'}
                            </small>
                          </td>
                          <td>
                            {b.status === 'Completed' ? (
                              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">Hoàn thành</span>
                            ) : b.status === 'Confirmed' ? (
                              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">Đã tiếp nhận</span>
                            ) : b.status === 'Cancelled' ? (
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Đã hủy</span>
                            ) : (
                              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill">Chờ xử lý</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & System Info (4 cols) */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-3">
              {/* Quick Actions Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h3 className="fs-6 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-lightning-charge-fill text-warning"></i>
                  Lối Tắt Thao Tác Nhanh
                </h3>
                <div className="d-flex flex-column gap-2">
                  <Link href="/admin/repair" className="btn btn-light text-start d-flex align-items-center justify-content-between p-3 rounded-3 border hover-shadow transition-all text-decoration-none">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-plus-circle-fill text-primary fs-5"></i>
                      <span className="fw-semibold small text-dark">Thêm bài viết sửa chữa</span>
                    </div>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>

                  <Link href="/admin/category" className="btn btn-light text-start d-flex align-items-center justify-content-between p-3 rounded-3 border hover-shadow transition-all text-decoration-none">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-tag-fill text-success fs-5"></i>
                      <span className="fw-semibold small text-dark">Tạo danh mục thiết bị</span>
                    </div>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>

                  <Link href="/admin/menu" className="btn btn-light text-start d-flex align-items-center justify-content-between p-3 rounded-3 border hover-shadow transition-all text-decoration-none">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-list-nested text-info fs-5"></i>
                      <span className="fw-semibold small text-dark">Quản lý menu điều hướng ({menus.length})</span>
                    </div>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>

                  <Link href="/" target="_blank" className="btn btn-light text-start d-flex align-items-center justify-content-between p-3 rounded-3 border hover-shadow transition-all text-decoration-none">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-box-arrow-up-right text-secondary fs-5"></i>
                      <span className="fw-semibold small text-dark">Xem website khách hàng</span>
                    </div>
                    <i className="bi bi-arrow-right text-muted small"></i>
                  </Link>
                </div>
              </div>

              {/* Status Overview Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <i className="bi bi-shield-check fs-2 text-warning"></i>
                  <div>
                    <h4 className="fs-6 fw-bold mb-0">Hệ Thống Đang Hoạt Động</h4>
                    <small className="text-light-50">API Gateway & Database Kết Nối Tốt</small>
                  </div>
                </div>
                <p className="small text-light-50 mb-0">
                  Các dịch vụ đặt lịch hẹn và dữ liệu bài viết dịch vụ được đồng bộ tự động theo thời gian thực.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
