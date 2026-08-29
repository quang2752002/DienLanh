'use client';

import React, { useState } from 'react';
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
import { useRepairBookings } from '@/hooks/useRepairBookings';
import { useRepairs } from '@/hooks/useRepairs';
import styles from '../repair/repair.module.css';

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

// Dữ liệu mẫu chuẩn bị sẵn để nạp tự động nếu bảng RepairBooking chưa có dữ liệu
const SAMPLE_BOOKINGS = [
  {
    repairId: 1,
    customerName: 'Nguyễn Văn An',
    phoneNumber: '0988123456',
    bookingDate: new Date(Date.now() - 6 * 86400000).toISOString(),
    notes: 'Máy lạnh Daikin 1.5HP không phả hơi lạnh, kêu to',
    status: 'Completed',
  },
  {
    repairId: 2,
    customerName: 'Trần Thị Bích',
    phoneNumber: '0912345678',
    bookingDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    notes: 'Tủ lạnh Panasonic Inverter ngăn mát không lạnh',
    status: 'Completed',
  },
  {
    repairId: 1,
    customerName: 'Lê Hoàng Long',
    phoneNumber: '0909888999',
    bookingDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    notes: 'Vệ sinh và nạp thêm gas máy lạnh tại văn phòng',
    status: 'Confirmed',
  },
  {
    repairId: 3,
    customerName: 'Phạm Minh Đức',
    phoneNumber: '0977665544',
    bookingDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    notes: 'Máy giặt Electrolux lồng ngang không vắt được',
    status: 'Confirmed',
  },
  {
    repairId: 2,
    customerName: 'Vũ Thu Trang',
    phoneNumber: '0933221100',
    bookingDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: 'Tủ lạnh bị chảy nước phía sau lưng',
    status: 'Pending',
  },
  {
    repairId: 1,
    customerName: 'Hoàng Anh Tuấn',
    phoneNumber: '0966554433',
    bookingDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: 'Cần sửa bo mạch điều hòa Daikin Inverter gấp',
    status: 'Pending',
  },
  {
    repairId: 3,
    customerName: 'Đặng Thanh Thảo',
    phoneNumber: '0944332211',
    bookingDate: new Date().toISOString(),
    notes: 'Khách hẹn dời lịch sang tuần sau',
    status: 'Cancelled',
  }
];

export default function RepairBookingAnalyticsPage() {
  const { bookings, loading, error, refresh, createBooking } = useRepairBookings();
  const { repairs } = useRepairs();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  // Tự động seed / Tạo mẫu dữ liệu nhanh
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      setSeedMessage(null);
      
      const targetRepairId = repairs.length > 0 ? repairs[0].id : 1;

      for (const sample of SAMPLE_BOOKINGS) {
        await createBooking({
          ...sample,
          repairId: targetRepairId,
        });
      }

      await refresh();
      setSeedMessage('Đã thêm 7 bản ghi dữ liệu mẫu RepairBooking thành công!');
    } catch (err: any) {
      setSeedMessage('Lỗi khi nạp dữ liệu: ' + (err.message || 'Không thể tạo bản ghi'));
    } finally {
      setIsSeeding(false);
    }
  };

  // 1. Phân loại theo Trạng thái (Status)
  const pendingCount = bookings.filter(b => !b.status || b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

  // 2. Thống kê theo Dịch vụ sửa chữa (Repair Name)
  const serviceStats: { [key: string]: number } = {};
  bookings.forEach(b => {
    const name = b.repairName || `Dịch vụ #${b.repairId}`;
    serviceStats[name] = (serviceStats[name] || 0) + 1;
  });

  const barLabels = Object.keys(serviceStats).length > 0 
    ? Object.keys(serviceStats) 
    : ['Sửa Máy Lạnh', 'Sửa Tủ Lạnh', 'Sửa Máy Giặt', 'Bảo Trì VRV'];
  const barDataValues = Object.keys(serviceStats).length > 0 
    ? Object.values(serviceStats) 
    : [15, 10, 8, 4];

  // 3. Thống kê theo Ngày (7 ngày qua hoặc tháng)
  const dateStats: { [key: string]: number } = {};
  bookings.forEach(b => {
    const d = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : 'Khác';
    dateStats[d] = (dateStats[d] || 0) + 1;
  });

  const lineLabels = Object.keys(dateStats).length > 0
    ? Object.keys(dateStats)
    : ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const lineValues = Object.keys(dateStats).length > 0
    ? Object.values(dateStats)
    : [4, 7, 5, 12, 9, 14, 8];

  // Config Chart 1: Line Chart
  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Số Lượt Đặt Lịch Theo Ngày',
        data: lineValues,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.15)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#0d6efd',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  // Config Chart 2: Doughnut Chart
  const doughnutData = {
    labels: ['Chờ xử lý (Pending)', 'Đã tiếp nhận (Confirmed)', 'Hoàn thành (Completed)', 'Đã hủy (Cancelled)'],
    datasets: [
      {
        data: [pendingCount, confirmedCount, completedCount, cancelledCount],
        backgroundColor: ['#ffc107', '#0d6efd', '#198754', '#dc3545'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      }
    ]
  };

  // Config Chart 3: Bar Chart (Top Dịch Vụ)
  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Số lượng yêu cầu',
        data: barDataValues,
        backgroundColor: [
          'rgba(13, 110, 253, 0.85)',
          'rgba(25, 135, 84, 0.85)',
          'rgba(255, 193, 7, 0.85)',
          'rgba(13, 202, 240, 0.85)',
          'rgba(111, 66, 193, 0.85)'
        ],
        borderRadius: 8,
      }
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className={styles.title}>Biểu Đồ Phân Tích Lịch Đặt (RepairBooking Analytics)</h1>
              <p className={styles.subtitle}>Phân tích chuyên sâu dữ liệu đặt lịch sửa chữa, cơ cấu trạng thái và dịch vụ phổ biến</p>
            </div>
            
            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={refresh}
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
              >
                <i className="bi bi-arrow-clockwise"></i> Làm Mới
              </button>

              {/* Nút tự động thêm dữ liệu mẫu nếu table chưa có dữ liệu */}
              {bookings.length === 0 && (
                <button
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className="btn btn-warning btn-sm d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm fw-bold"
                >
                  <i className="bi bi-database-fill-add"></i>
                  {isSeeding ? 'Đang nạp dữ liệu mẫu...' : 'Tạo Dữ Liệu Mẫu RepairBooking'}
                </button>
              )}

              <Link href="/admin/booking" className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm">
                <i className="bi bi-table"></i> Quản Lý Danh Sách ({bookings.length})
              </Link>
            </div>
          </div>
        </header>

        {seedMessage && (
          <div className={`alert ${seedMessage.includes('Lỗi') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show rounded-3 mb-4`} role="alert">
            <i className={`bi ${seedMessage.includes('Lỗi') ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>
            {seedMessage}
          </div>
        )}

        {/* 1. Stat Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-primary h-100">
              <div className="text-muted small text-uppercase fw-bold">Tổng Đơn Đặt Lịch</div>
              <div className="fs-2 fw-bold text-dark my-1">{loading ? '...' : bookings.length}</div>
              <small className="text-primary fw-semibold"><i className="bi bi-calendar-event me-1"></i>Từ bảng RepairBooking</small>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-warning h-100">
              <div className="text-muted small text-uppercase fw-bold">Đang Chờ Xử Lý</div>
              <div className="fs-2 fw-bold text-warning my-1">{loading ? '...' : pendingCount}</div>
              <small className="text-muted">Cần kỹ thuật viên liên hệ</small>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-info h-100">
              <div className="text-muted small text-uppercase fw-bold">Đã Tiếp Nhận</div>
              <div className="fs-2 fw-bold text-info my-1">{loading ? '...' : confirmedCount}</div>
              <small className="text-muted">Đang điều phối thợ sửa</small>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success h-100">
              <div className="text-muted small text-uppercase fw-bold">Đã Hoàn Thành</div>
              <div className="fs-2 fw-bold text-success my-1">{loading ? '...' : completedCount}</div>
              <small className="text-success fw-semibold">
                Tỉ lệ: {bookings.length > 0 ? Math.round((completedCount / bookings.length) * 100) : 0}%
              </small>
            </div>
          </div>
        </div>

        {/* 2. Charts Row 1: Line Chart & Doughnut Chart */}
        <div className="row g-4 mb-4">
          {/* Biểu đồ dòng: Diễn biến đặt lịch */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-graph-up-arrow text-primary"></i>
                    Diễn Biến Đặt Lịch Theo Ngày Hẹn
                  </h3>
                  <small className="text-muted">Dữ liệu tổng hợp từ các bản ghi đặt lịch trong hệ thống</small>
                </div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">
                  Thời Gian Thực
                </span>
              </div>
              <div style={{ height: '300px', position: 'relative' }}>
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 10 } }
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Biểu đồ tròn: Cơ cấu trạng thái */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="mb-3">
                <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-pie-chart-fill text-warning"></i>
                  Cơ Cấu Trạng Thái Đơn Hẹn
                </h3>
                <small className="text-muted">Phân bổ tỷ lệ % đơn đặt</small>
              </div>
              <div style={{ height: '300px', position: 'relative' }}>
                {bookings.length === 0 ? (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <i className="bi bi-pie-chart fs-1 mb-2 text-secondary"></i>
                    <p className="small mb-2">Chưa có dữ liệu biểu đồ</p>
                    <button onClick={handleSeedData} className="btn btn-sm btn-outline-warning rounded-pill">
                      Nạp dữ liệu mẫu
                    </button>
                  </div>
                ) : (
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10, padding: 12 } }
                      },
                      cutout: '65%'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Charts Row 2: Bar Chart theo Dịch vụ */}
        <div className="row g-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="fs-6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-bar-chart-fill text-success"></i>
                    Top Dịch Vụ Sửa Chữa Được Đăng Ký Nhiều Nhất
                  </h3>
                  <small className="text-muted">So sánh số lượng đặt lịch theo từng danh mục dịch vụ</small>
                </div>
              </div>
              <div style={{ height: '300px', position: 'relative' }}>
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
