'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';

export default function ContactPage() {
  const { settings } = useSettings();

  // Contact settings extraction
  const addressSetting = settings.find(s => s.key.toLowerCase().includes('address') || s.key.toLowerCase().includes('địa chỉ'));
  const address = addressSetting?.value || 'Số 103, Đường Lê Lợi, Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh';

  const phoneSetting = settings.find(s => s.key.toLowerCase().includes('phone') || s.key.toLowerCase().includes('hotline'));
  const phoneNumber = phoneSetting?.value || '0988.123.456 - 1900.6789';

  const emailSetting = settings.find(s => s.key.toLowerCase().includes('email') || s.key.toLowerCase().includes('thư'));
  const email = emailSetting?.value || 'contact@dienlanhdms.com';

  const workTimeSetting = settings.find(s => s.key.toLowerCase().includes('time') || s.key.toLowerCase().includes('giờ'));
  const workTime = workTimeSetting?.value || 'Thứ 2 - Chủ Nhật: 7:00 - 21:00 (Hỗ trợ khẩn cấp 24/7)';

  // Form state
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [serviceType, setServiceType] = useState('Sửa chữa máy lạnh');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFullname('');
      setPhone('');
      setUserEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="bg-light py-5">
      <div className="container">
        {/* Header Title */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider">
            Trung Tâm Hỗ Trợ Khách Hàng
          </span>
          <h1 className="fw-extrabold mt-2 display-5 text-dark">Liên Hệ Kỹ Thuật Điện Lạnh DMS</h1>
          <div className="bg-primary mx-auto my-3" style={{ width: '60px', height: '3px' }}></div>
          <p className="text-muted max-width-600 mx-auto">
            Chúng tôi luôn sẵn sàng tiếp nhận yêu cầu khảo sát, tư vấn giải pháp và báo giá dịch vụ sửa chữa thiết bị điện lạnh tại nhà 24/7.
          </p>
        </div>

        <div className="row g-5">
          {/* Cột Trái: Thông Tin Liên Hệ & Chi Nhánh */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white h-100">
              <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-headset text-primary fs-3"></i>
                Thông Tin Trực Tuyến
              </h4>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-primary-subtle text-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-geo-alt-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark m-0">Trụ sở chính</h6>
                    <p className="text-muted small mb-0 mt-1">{address}</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-success-subtle text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-telephone-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark m-0">Hotline tư vấn & khẩn cấp</h6>
                    <p className="text-muted small mb-0 mt-1">
                      <a href="tel:0988123456" className="text-decoration-none fw-bold text-primary">{phoneNumber}</a>
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-info-subtle text-info-emphasis rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-envelope-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark m-0">Hòm thư điện tử (Email)</h6>
                    <p className="text-muted small mb-0 mt-1">{email}</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-warning-subtle text-warning-emphasis rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-clock-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark m-0">Thời gian làm việc</h6>
                    <p className="text-muted small mb-0 mt-1">{workTime}</p>
                  </div>
                </div>
              </div>

              <hr className="my-4 border-light-subtle" />

              <div>
                <h6 className="fw-bold text-dark mb-3">Mạng xã hội hỗ trợ</h6>
                <div className="d-flex gap-2">
                  <a href="#" className="btn btn-outline-primary rounded-circle" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="btn btn-outline-danger rounded-circle" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-youtube"></i>
                  </a>
                  <a href="https://zalo.me" target="_blank" rel="noreferrer" className="btn btn-outline-info rounded-circle" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-chat-dots-fill"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Biểu Mẫu Gửi Yêu Cầu Liên Hệ */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <h4 className="fw-bold text-dark mb-2">Gửi Yêu Cầu Tư Vấn Trực Tuyến</h4>
              <p className="text-muted small mb-4">
                Điền thông tin và nhu cầu của bạn vào biểu mẫu bên dưới, kỹ thuật viên sẽ gọi lại tư vấn và báo giá miễn phí trong vòng 15 phút.
              </p>

              {isSuccess && (
                <div className="alert alert-success rounded-3 d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                  <div>
                    <strong>Gửi yêu cầu thành công!</strong> Cảm ơn bạn, đội ngũ kỹ thuật viên DMS sẽ liên hệ lại ngay theo số điện thoại đã cung cấp.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Họ và Tên *</label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2"
                      placeholder="Nguyễn Văn A"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      className="form-control rounded-3 py-2"
                      placeholder="0988xxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Email (Không bắt buộc)</label>
                    <input
                      type="email"
                      className="form-control rounded-3 py-2"
                      placeholder="name@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Dịch vụ cần hỗ trợ</label>
                    <select
                      className="form-select rounded-3 py-2"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="Bảo Dưỡng & Vệ Sinh Máy Lạnh">Bảo Dưỡng & Vệ Sinh Máy Lạnh</option>
                      <option value="Sửa Chữa Tủ Lạnh Inverter">Sửa Chữa Tủ Lạnh Inverter</option>
                      <option value="Lắp Đặt Máy Lạnh Âm Trần/Multi">Lắp Đặt Máy Lạnh Âm Trần/Multi</option>
                      <option value="Bảo Trì Hệ Thống VRV / Chiller">Bảo Trì Hệ Thống VRV / Chiller</option>
                      <option value="Sửa Chữa & Vệ Sinh Máy Giặt">Sửa Chữa & Vệ Sinh Máy Giặt</option>
                      <option value="Thu Mua & Thanh Lý Máy Lạnh Cũ">Thu Mua & Thanh Lý Máy Lạnh Cũ</option>
                      <option value="Tư vấn khác">Nhu cầu tư vấn khác</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Mô tả chi tiết tình trạng hoặc địa chỉ cụ thể</label>
                    <textarea
                      className="form-control rounded-3"
                      rows={4}
                      placeholder="Ví dụ: Máy lạnh Daikin không mát, chảy nước nhiều ở dàn lạnh tại Quận Gò Vấp..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-warning w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <>
                          <i className="bi bi-send-fill"></i>
                          <span>Gửi Thông Tin Yêu Cầu</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bản đồ định vị Google Maps Embed */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mt-5 bg-white">
          <div className="p-4 border-bottom">
            <h5 className="fw-bold text-dark m-0">
              <i className="bi bi-map-fill text-primary me-2"></i>
              Bản Đồ Chỉ Đường Đến DMS
            </h5>
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.924846430335!2d106.68532431480083!3d10.817066992293962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e547372733%3A0xbcc0e2b4f9c54d19!2zTMOqIEzhu6NpLCBHw7IgVuG6pXAsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Điện Lạnh DMS"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
