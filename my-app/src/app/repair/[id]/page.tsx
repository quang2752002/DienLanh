'use client';

import React, { useEffect, useState } from 'react';
import { useRepairs } from '@/hooks/useRepairs';
import { useRepairBookings } from '@/hooks/useRepairBookings';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RepairDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const auth = useAuth();

  // Hook lấy dữ liệu từ Repair (Bài viết dịch vụ sửa chữa)
  const { getRepairById, activeRepair, loadingActiveRepair } = useRepairs();
  const { createBooking } = useRepairBookings();

  // Booking Form State
  const [fullname, setFullname] = useState(auth?.user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getRepairById(id as string);
    }
  }, [id, getRepairById]);

  useEffect(() => {
    if (auth?.user?.fullName && !fullname) {
      setFullname(auth.user.fullName);
    }
  }, [auth, fullname]);

  if (loadingActiveRepair) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Đang tải thông tin chi tiết dịch vụ sửa chữa...</p>
      </div>
    );
  }

  if (!activeRepair) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning rounded-4 shadow-sm max-width-600 mx-auto py-5">
          <i className="bi bi-exclamation-triangle-fill display-4 text-warning mb-3"></i>
          <h4>Không tìm thấy bài viết dịch vụ sửa chữa</h4>
          <p className="text-muted">Dịch vụ sửa chữa yêu cầu không tồn tại hoặc đã được gỡ bỏ khỏi hệ thống.</p>
          <Link href="/" className="btn btn-primary rounded-pill mt-3 px-4">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !phone.trim() || !date) return;

    try {
      setIsBooked(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      // Parse repairId an toàn
      const repairIdNum = !isNaN(Number(activeRepair.id)) ? Number(activeRepair.id) : 1;
      const userIdNum = auth?.user?.id ? Number(auth.user.id) : undefined;

      await createBooking({
        repairId: repairIdNum,
        userId: userIdNum,
        customerName: fullname.trim(),
        phoneNumber: phone.trim(),
        bookingDate: new Date(date).toISOString(),
        notes: notes.trim() || undefined,
        status: 'Pending',
      });

      setSubmitSuccess(true);
      setPhone('');
      setDate('');
      setNotes('');
    } catch (err: any) {
      setSubmitError(err.message || 'Không thể gửi đăng ký đặt lịch. Vui lòng thử lại.');
    } finally {
      setIsBooked(false);
    }
  };

  // Nội dung mặc định chuẩn kỹ thuật nếu chưa có HTML từ CKEditor
  const defaultDetailContent = `
    <h3>Quy trình sửa chữa & bảo dưỡng chuyên nghiệp tại DMS:</h3>
    <p>Chúng tôi cam kết chất lượng dịch vụ tốt nhất với quy trình chuẩn kỹ thuật 5 bước:</p>
    <ol>
      <li><strong>Khảo sát & Kiểm tra chuyên sâu:</strong> Kỹ thuật viên dùng thiết bị đo dòng, áp suất gas, nhiệt độ phòng và kiểm tra rò rỉ điện.</li>
      <li><strong>Báo giá chi tiết rõ ràng:</strong> Lập danh sách linh kiện thay thế hoặc hạng mục thi công cụ thể gửi khách hàng duyệt trước.</li>
      <li><strong>Tiến hành sửa chữa:</strong> Thợ tay nghề cao thực hiện theo quy chuẩn an toàn, sử dụng linh kiện chính hãng.</li>
      <li><strong>Vận hành & Đo kiểm:</strong> Kiểm tra dòng tải, lưu lượng gió và dán tem bảo hành điện tử chính hãng.</li>
      <li><strong>Nghiệm thu bàn giao:</strong> Bàn giao sạch sẽ, hướng dẫn khách hàng cách sử dụng thiết bị tiết kiệm điện năng.</li>
    </ol>
    <div class="alert alert-info mt-4">
      <h5><i class="bi bi-shield-fill-check me-2"></i>Chính sách bảo hành vàng tại DMS:</h5>
      <p class="mb-0">Tất cả dịch vụ sửa chữa và linh kiện thay thế tại DMS đều đi kèm chính sách bảo hành chính hãng từ <strong>6 đến 12 tháng</strong>. Cam kết hỗ trợ miễn phí nếu phát sinh lỗi cũ trong thời gian bảo hành.</p>
    </div>
  `;

  return (
    <div className="bg-light py-5">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/">Trang chủ</Link></li>
            <li className="breadcrumb-item"><span className="text-secondary">Dịch vụ sửa chữa</span></li>
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '300px' }} aria-current="page">
              {activeRepair.name}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Cột Trái: Chi tiết bài viết dịch vụ sửa chữa */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              {/* Header Title Block */}
              <div className="border-bottom pb-4 mb-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
                  <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase">
                    {activeRepair.categoryName || 'Dịch vụ Kỹ thuật'}
                  </span>
                  <span className="text-secondary small">
                    <i className="bi bi-calendar3 me-1"></i>
                    {activeRepair.created ? new Date(activeRepair.created).toLocaleDateString('vi-VN') : 'Cập nhật gần đây'}
                  </span>
                </div>

                <h1 className="fw-extrabold text-dark tracking-tight lh-sm m-0 display-6">
                  {activeRepair.name}
                </h1>
              </div>

              {/* Hình ảnh đại diện bài viết nếu có */}
              {activeRepair.img && (
                <div className="mb-4 rounded-4 overflow-hidden shadow-sm" style={{ maxHeight: '420px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeRepair.img}
                    alt={activeRepair.name}
                    className="w-100 h-100 object-cover"
                    style={{ objectFit: 'cover', maxHeight: '420px' }}
                  />
                </div>
              )}

              {/* Ratings, quick statistics */}
              <div className="row g-3 text-center mb-5 bg-light p-3 rounded-4">
                <div className="col-4 border-end">
                  <div className="text-warning fs-4 fw-bold">
                    <i className="bi bi-star-fill me-1"></i>5.0
                  </div>
                  <small className="text-muted text-uppercase tracking-wider small">Đánh giá chuẩn</small>
                </div>
                <div className="col-4 border-end">
                  <div className="text-success fs-4 fw-bold">
                    <i className="bi bi-shield-check me-1"></i>12T
                  </div>
                  <small className="text-muted text-uppercase tracking-wider small">Bảo hành vàng</small>
                </div>
                <div className="col-4">
                  <div className="text-primary fs-4 fw-bold">
                    <i className="bi bi-lightning-charge me-1"></i>30P
                  </div>
                  <small className="text-muted text-uppercase tracking-wider small">Có mặt tận nơi</small>
                </div>
              </div>

              {/* Mô tả ngắn */}
              {activeRepair.description && (
                <div className="lead text-dark fw-medium mb-4 p-3 bg-primary-subtle bg-opacity-25 rounded-3 border-start border-primary border-4">
                  {activeRepair.description}
                </div>
              )}

              {/* Nội dung bài viết chi tiết (Render HTML từ CKEditor) */}
              <div className="service-content text-secondary lh-lg mb-5">
                {activeRepair.content ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: activeRepair.content }}
                    className="ck-content"
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: defaultDetailContent }} />
                )}
              </div>

              {/* Nút quay lại & Hotline tư vấn */}
              <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 pt-4 border-top gap-3">
                <Link href="/" className="btn btn-outline-secondary rounded-pill px-4">
                  <i className="bi bi-arrow-left me-1"></i> Quay lại trang chủ
                </Link>
                <a href="tel:0988123456" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
                  <i className="bi bi-telephone-fill me-2"></i> Hotline: 0988.123.456
                </a>
              </div>
            </div>
          </div>

          {/* Cột Phải: Biểu mẫu đặt lịch hẹn sửa chữa trực tuyến */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-lg-top" style={{ top: '100px', zIndex: 10 }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-calendar2-check text-primary fs-3"></i>
                <h4 className="fw-bold text-dark m-0">Đặt Lịch Sửa Chữa</h4>
              </div>
              <p className="text-muted small mb-4">
                Điền thông tin đặt lịch, kỹ thuật viên DMS sẽ liên hệ lại xác nhận và đến kiểm tra tận nơi trong vòng 15-30 phút.
              </p>

              {submitSuccess && (
                <div className="alert alert-success rounded-3 small py-2 mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <div><strong>Đăng ký thành công!</strong> Kỹ thuật viên DMS sẽ liên hệ lại sớm nhất.</div>
                </div>
              )}

              {submitError && (
                <div className="alert alert-danger rounded-3 small py-2 mb-3">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleBookingSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Họ và Tên *</label>
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
                  <label className="form-label small fw-semibold text-secondary">Số Điện Thoại *</label>
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
                  <label className="form-label small fw-semibold text-secondary">Ngày muốn kiểm tra *</label>
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
                  <label className="form-label small fw-semibold text-secondary">Ghi chú tình trạng hỏng hóc & địa chỉ</label>
                  <textarea
                    className="form-control rounded-3"
                    rows={3}
                    placeholder="VD: Điều hòa không lạnh, chảy nước ở mặt lạnh, địa chỉ..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isBooked}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-warning w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={isBooked}
                >
                  {isBooked ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>
                      <i className="bi bi-calendar2-check-fill"></i>
                      <span>Gửi Đặt Lịch Hẹn Ngay</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-3 border-top text-center text-secondary small">
                <i className="bi bi-headset text-primary me-2"></i>
                <span>Tư vấn kỹ thuật 24/7: <strong>0988.123.456</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
