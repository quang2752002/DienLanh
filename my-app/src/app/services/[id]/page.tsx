'use client';

import React, { useEffect, useState } from 'react';
import { useServiceDevices } from '@/hooks/useServiceDevices';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getServiceDeviceById, activeDevice, loadingActiveDevice } = useServiceDevices();

  // Booking Form State
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    if (id) {
      getServiceDeviceById(id as string);
    }
  }, [id, getServiceDeviceById]);

  if (loadingActiveDevice) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Đang tải thông tin chi tiết dịch vụ...</p>
      </div>
    );
  }

  if (!activeDevice) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning rounded-4 shadow-sm max-width-600 mx-auto py-5">
          <i className="bi bi-exclamation-triangle-fill display-4 text-warning mb-3"></i>
          <h4>Không tìm thấy dịch vụ</h4>
          <p className="text-muted">Dịch vụ yêu cầu không tồn tại hoặc đã được gỡ bỏ khỏi hệ thống.</p>
          <Link href="/" className="btn btn-primary rounded-pill mt-3 px-4">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !phone.trim() || !date) return;
    setIsBooked(true);
    setTimeout(() => {
      setFullname('');
      setPhone('');
      setDate('');
      setNotes('');
      setIsBooked(false);
      alert('Đăng ký dịch vụ thành công! Kỹ thuật viên DMS sẽ liên hệ lại trong vòng 15 phút.');
    }, 1500);
  };

  // Default detailed content if database content is not set
  const defaultDetailContent = `
    <h3>Quy trình thi công dịch vụ chuyên nghiệp của DMS:</h3>
    <p>Chúng tôi cam kết mang lại chất lượng sửa chữa và lắp đặt tốt nhất thông qua quy trình 5 bước chuẩn kỹ thuật:</p>
    <ol>
      <li><strong>Khảo sát & Kiểm tra chuyên sâu:</strong> Kỹ thuật viên dùng thiết bị chuyên nghiệp để đo dòng điện, áp suất gas, nhiệt độ phòng và kiểm tra rò rỉ điện.</li>
      <li><strong>Báo giá chi tiết rõ ràng:</strong> Lập danh sách các linh kiện cần thay thế hoặc hạng mục thi công cụ thể gửi khách hàng duyệt trước khi thực hiện.</li>
      <li><strong>Tiến hành sửa chữa/lắp đặt:</strong> Thợ tay nghề cao thực hiện theo quy chuẩn an toàn, sử dụng trang thiết bị hiện đại.</li>
      <li><strong>Vận hành thử nghiệm:</strong> Đo đạc lại dòng điện, lưu lượng gió lạnh và dán tem bảo hành điện tử chính hãng.</li>
      <li><strong>Nghiệm thu bàn giao:</strong> Bàn giao khu vực làm việc sạch sẽ, hướng dẫn khách hàng cách sử dụng máy lạnh tiết kiệm điện đến 30%.</li>
    </ol>
    <div class="alert alert-info mt-4">
      <h5><i class="bi bi-shield-fill-check me-2"></i>Chính sách bảo hành vàng tại DMS:</h5>
      <p class="mb-0">Tất cả dịch vụ và linh kiện thay thế tại DMS đều đi kèm chính sách bảo hành chính hãng từ <strong>6 đến 12 tháng</strong>. Cam kết hỗ trợ miễn phí nếu phát sinh lỗi cũ trong thời gian bảo hành.</p>
    </div>
  `;

  return (
    <div className="container py-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Trang chủ</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Chi tiết dịch vụ</li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Left Column: Detail Information */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            {/* Header Title Block */}
            <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-4 mb-4 g-3">
              <div>
                <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-2 rounded-pill fw-bold text-uppercase">
                  {activeDevice.categoryName || 'Dịch vụ Kỹ thuật'}
                </span>
                <h1 className="fw-extrabold text-dark tracking-tight lh-sm m-0 display-6">
                  {activeDevice.name}
                </h1>
                <p className="text-muted mt-2 mb-0">Hãng/Dòng máy hỗ trợ: <strong className="text-dark">{activeDevice.brand}</strong></p>
              </div>

              <div className="text-lg-end">
                <span className="d-block text-secondary small">Giá tham khảo</span>
                <span className="fs-3 fw-bold text-primary">{activeDevice.price || 'Khảo sát thực tế'}</span>
              </div>
            </div>

            {/* Ratings, quick statistics */}
            <div className="row g-3 text-center mb-5">
              <div className="col-4 border-end">
                <div className="text-warning display-6 fw-bold">
                  <i className="bi bi-star-fill"></i> {activeDevice.rating || '5.0'}
                </div>
                <small className="text-muted text-uppercase tracking-wider small">Đánh giá</small>
              </div>
              <div className="col-4 border-end">
                <div className="text-success display-6 fw-bold">
                  <i className="bi bi-shield-check"></i>
                </div>
                <small className="text-muted text-uppercase tracking-wider small">Bảo hành uy tín</small>
              </div>
              <div className="col-4">
                <div className="text-info display-6 fw-bold">
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <small className="text-muted text-uppercase tracking-wider small">Có mặt sau 30p</small>
              </div>
            </div>

            {/* Rich Detailed Description */}
            <div className="service-content text-secondary lh-lg mb-4">
              <div className="mb-4 lead text-dark fw-medium">
                {activeDevice.description || 'Dịch vụ sửa chữa và bảo dưỡng thiết bị điện lạnh chuyên nghiệp với kỹ thuật viên DMS được đào tạo tay nghề cao.'}
              </div>
              {activeDevice.content ? (
                <div dangerouslySetInnerHTML={{ __html: activeDevice.content }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: defaultDetailContent }} />
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
              <Link href="/" className="btn btn-outline-secondary rounded-pill px-4">
                <i className="bi bi-arrow-left"></i> Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-lg-top" style={{ top: '100px', zIndex: 10 }}>
            <h4 className="fw-bold text-dark mb-3">Đăng Ký Đặt Lịch Hẹn</h4>
            <p className="text-muted small mb-4">Nhập thông tin bên dưới để kỹ thuật viên DMS đến hỗ trợ khảo sát và sửa chữa tận nhà sớm nhất.</p>

            <form onSubmit={handleBookingSubmit}>
              <div className="mb-3">
                <label className="form-label small font-semibold text-secondary">Họ và Tên *</label>
                <input 
                  type="text" 
                  className="form-control rounded-3 py-2" 
                  placeholder="Nguyễn Văn A" 
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  disabled={isBooked}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label small font-semibold text-secondary">Số Điện Thoại *</label>
                <input 
                  type="tel" 
                  className="form-control rounded-3 py-2" 
                  placeholder="0988xxxxxx" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isBooked}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label small font-semibold text-secondary">Ngày hẹn gặp *</label>
                <input 
                  type="date" 
                  className="form-control rounded-3 py-2" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isBooked}
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label small font-semibold text-secondary">Ghi chú (Tình trạng lỗi thiết bị)</label>
                <textarea 
                  className="form-control rounded-3" 
                  rows={3} 
                  placeholder="VD: Máy lạnh chảy nước, tủ lạnh kêu to..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isBooked}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-warning w-100 rounded-pill py-3 fw-bold shadow-sm"
                disabled={isBooked}
              >
                {isBooked ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <i className="bi bi-calendar2-check-fill me-2"></i> Đặt lịch hẹn ngay
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-top text-center text-secondary small">
              <i className="bi bi-telephone-fill text-primary me-2"></i>
              <span>Hotline khẩn cấp: <strong>0988.123.456</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
