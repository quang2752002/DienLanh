'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useServiceDevices } from '@/hooks/useServiceDevices';
import { useCategories } from '@/hooks/useCategories';

// Danh sách dịch vụ mặc định (Mockup chất lượng cao để hiển thị nếu backend chưa có dữ liệu)
const DEFAULT_SERVICES = [
  {
    id: 'sd-1',
    name: 'Bảo Dưỡng & Vệ Sinh Máy Lạnh',
    brand: 'Dân dụng & Văn phòng',
    description: 'Vệ sinh lưới lọc, dàn nóng, dàn lạnh, đo đạc áp suất gas và kiểm tra hiệu suất làm mát toàn diện.',
    icon: 'bi-snow',
    price: '150.000đ - 350.000đ',
    rating: 5,
  },
  {
    id: 'sd-2',
    name: 'Sửa Chữa Tủ Lạnh Inverter',
    brand: 'Panasonic, Toshiba, LG, Samsung...',
    description: 'Xử lý triệt để các lỗi không đông đá, hỏng block, xì gas dàn lạnh, hỏng bo mạch điều khiển.',
    icon: 'bi-patch-check',
    price: 'Khảo sát & Báo giá tại chỗ',
    rating: 4.9,
  },
  {
    id: 'sd-3',
    name: 'Thi Công Lắp Đặt Máy Lạnh Âm Trần/Multi',
    brand: 'Công trình & Nhà phố',
    description: 'Khảo sát vị trí lắp đặt chuẩn kỹ thuật tối ưu hóa luồng gió và thẩm mỹ kiến trúc không gian.',
    icon: 'bi-tools',
    price: 'Liên hệ tư vấn miễn phí',
    rating: 5,
  },
  {
    id: 'sd-4',
    name: 'Bảo Trì Hệ Thống VRV / Chiller',
    brand: 'Công nghiệp & Tòa nhà',
    description: 'Hợp đồng bảo trì hệ thống điều hòa trung tâm định kỳ cho nhà xưởng, siêu thị, cao ốc văn phòng.',
    icon: 'bi-building-gear',
    price: 'Theo khảo sát thiết kế',
    rating: 4.8,
  },
  {
    id: 'sd-5',
    name: 'Sửa Chữa & Vệ Sinh Máy Giặt Cửa Ngang',
    brand: 'Electrolux, LG, Bosch...',
    description: 'Vệ sinh lồng giặt bằng thiết bị chuyên dụng, sửa lỗi không vắt, không cấp nước, kêu to.',
    icon: 'bi-water',
    price: '250.000đ - 500.000đ',
    rating: 4.7,
  },
  {
    id: 'sd-6',
    name: 'Thu Mua & Thanh Lý Máy Lạnh Cũ',
    brand: 'Giá tốt tận nơi',
    description: 'Thu mua máy lạnh cũ hỏng giá cao, định giá trung thực và hỗ trợ tháo dỡ nhanh chóng tại nhà.',
    icon: 'bi-arrow-left-right',
    price: 'Thu mua đến 80% giá trị',
    rating: 4.9,
  }
];

export default function Home() {
  const { serviceDevices, loading: loadingServices } = useServiceDevices();
  const { categories, loading: loadingCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Kết hợp dữ liệu API và dữ liệu mặc định chất lượng cao
  const displayServices = serviceDevices.length > 0 ? serviceDevices : DEFAULT_SERVICES;

  return (
    <main>
      {/* 1. Hero Section */}
      <section className="position-relative overflow-hidden py-5 text-white" style={{
        background: 'linear-gradient(135deg, #091E3A 0%, #103783 50%, #0d6efd 100%)',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Abstract Glow Shapes */}
        <div className="position-absolute rounded-circle" style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(13, 202, 240, 0.25) 0%, rgba(0,0,0,0) 70%)',
          top: '-150px',
          right: '-50px',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}></div>
        <div className="position-absolute rounded-circle" style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(255, 193, 7, 0.2) 0%, rgba(0,0,0,0) 70%)',
          bottom: '-80px',
          left: '-50px',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}></div>

        <div className="container py-lg-4 position-relative z-1">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3" style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <span className="badge bg-warning text-dark fw-bold rounded-pill">
                  <i className="bi bi-shield-fill-check me-1"></i> TOP 1
                </span>
                <span className="text-light small fw-semibold">Dịch Vụ Điện Lạnh Chuyên Nghiệp DMS</span>
              </div>

              <h1 className="display-4 fw-bolder text-white mb-3 lh-sm" style={{ letterSpacing: '-0.5px' }}>
                Giải Pháp Điện Lạnh <br />
                <span style={{
                  background: 'linear-gradient(90deg, #ffc107, #0dcaf0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 900
                }}>
                  Kỹ Thuật Cao & Toàn Diện
                </span>
              </h1>

              <p className="lead text-light-50 mb-4 fs-6 lh-base" style={{ maxWidth: '540px' }}>
                Chuyên sâu bảo dưỡng, sửa chữa máy lạnh, tủ lạnh Inverter & thi công điều hòa trung tâm VRV. Đội ngũ thợ chứng chỉ chính hãng, có mặt chỉ sau 30 phút.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <a href="#pricing" className="btn btn-warning btn-lg px-4 py-3 fw-bold rounded-pill shadow-lg d-inline-flex align-items-center gap-2">
                  <i className="bi bi-tag-fill"></i>
                  <span>Xem Bảng Giá & Đặt Lịch</span>
                </a>
                <a href="tel:0988123456" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill d-inline-flex align-items-center gap-2" style={{ backdropFilter: 'blur(5px)' }}>
                  <i className="bi bi-telephone-outbound-fill text-warning"></i>
                  <span>Hotline: 0988.123.456</span>
                </a>
              </div>

              {/* Mini Stats Highlights */}
              <div className="row pt-4 border-top border-white border-opacity-25 g-3 text-center text-sm-start">
                <div className="col-4">
                  <div className="fs-3 fw-black text-warning">10+</div>
                  <div className="small text-white-50">Năm Kinh Nghiệm</div>
                </div>
                <div className="col-4 border-start border-white border-opacity-10 ps-3">
                  <div className="fs-3 fw-black text-info">15.000+</div>
                  <div className="small text-white-50">Khách Hài Lòng</div>
                </div>
                <div className="col-4 border-start border-white border-opacity-10 ps-3">
                  <div className="fs-3 fw-black text-success">30 Phút</div>
                  <div className="small text-white-50">Có Mặt Tận Nơi</div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block position-relative">
              {/* Glassmorphism Presentation Box */}
              <div className="position-relative mx-auto" style={{ maxWidth: '480px' }}>

                {/* Floating Badge 1 - Top Left */}
                <div className="card shadow-lg p-3 position-absolute border-0 rounded-4 d-flex flex-row align-items-center gap-3" style={{
                  top: '-25px',
                  left: '-30px',
                  zIndex: 20,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                }}>
                  <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                    <i className="bi bi-clock-history fs-4"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark mb-0 fs-6">Phục Vụ Nhanh 24/7</div>
                    <small className="text-muted">Có mặt đúng hẹn trong 30p</small>
                  </div>
                </div>

                {/* Floating Badge 2 - Bottom Right */}
                <div className="card shadow-lg p-3 position-absolute border-0 rounded-4 d-flex flex-row align-items-center gap-3" style={{
                  bottom: '-25px',
                  right: '-25px',
                  zIndex: 20,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                }}>
                  <div className="bg-success text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                    <i className="bi bi-shield-fill-check fs-4"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark mb-0 fs-6">Bảo Hành 6 - 12 Tháng</div>
                    <small className="text-muted">Linh kiện chính hãng 100%</small>
                  </div>
                </div>

                {/* Main Hero Visual Card */}
                <div className="p-4 rounded-5" style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                  <div className="rounded-4 p-4 text-center" style={{ background: 'rgba(5, 19, 44, 0.65)' }}>

                    <div className="position-relative d-inline-block my-3">
                      <div className="rounded-circle p-4 d-inline-flex align-items-center justify-content-center" style={{
                        background: 'radial-gradient(circle, rgba(13, 202, 240, 0.25) 0%, rgba(13, 110, 253, 0.1) 70%)',
                        border: '2px solid rgba(13, 202, 240, 0.4)',
                        width: '120px',
                        height: '120px'
                      }}>
                        <i className="bi bi-snow2 text-info display-4"></i>
                      </div>
                      <span className="position-absolute top-0 end-0 translate-middle p-2 bg-warning border border-light rounded-circle">
                        <span className="visually-hidden">Active</span>
                      </span>
                    </div>

                    <h4 className="text-white fw-bold mb-1">DMS REFRIGERATION</h4>
                    <p className="text-info small fw-medium mb-3">Trung Tâm Kỹ Thuật Điện Lạnh Hàng Đầu</p>

                    {/* Quick Features List in Hero Card */}
                    <div className="row g-2 text-start mt-2">
                      <div className="col-6">
                        <div className="p-2 rounded-3 text-light small d-flex align-items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <i className="bi bi-check-circle-fill text-warning"></i>
                          <span>Máy lạnh dân dụng</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2 rounded-3 text-light small d-flex align-items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <i className="bi bi-check-circle-fill text-warning"></i>
                          <span>Hệ thống VRV/Chiller</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2 rounded-3 text-light small d-flex align-items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <i className="bi bi-check-circle-fill text-warning"></i>
                          <span>Tủ lạnh Inverter</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-2 rounded-3 text-light small d-flex align-items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <i className="bi bi-check-circle-fill text-warning"></i>
                          <span>Máy giặt các loại</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Strengths Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <span className="text-primary fw-bold text-uppercase tracking-wider small">Tại sao chọn chúng tôi</span>
              <h2 className="fw-bold mt-2">Cam Kết Chất Lượng Vượt Trội</h2>
              <div className="bg-primary mx-auto my-3" style={{ width: '60px', height: '3px' }}></div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center hover-up transition-all">
                <div className="bg-primary-subtle text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-people-fill fs-3"></i>
                </div>
                <h5 className="fw-bold">Đội Ngũ Chuyên Nghiệp</h5>
                <p className="text-muted small mb-0">
                  Tất cả kỹ thuật viên đều có chứng chỉ nghề chính quy, được đào tạo chuyên sâu định kỳ và có tối thiểu 3 năm kinh nghiệm thực tế.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center hover-up transition-all">
                <div className="bg-success-subtle text-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-currency-dollar fs-3"></i>
                </div>
                <h5 className="fw-bold">Giá Cả Minh Bạch</h5>
                <p className="text-muted small mb-0">
                  Báo giá chi tiết rõ ràng trước khi sửa chữa. Tuyệt đối không vẽ lỗi phát sinh chi phí. Hoàn tiền nếu khách hàng không hài lòng.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm p-4 text-center hover-up transition-all">
                <div className="bg-warning-subtle text-warning-emphasis rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                  <i className="bi bi-shield-check fs-3"></i>
                </div>
                <h5 className="fw-bold">Linh Kiện Chính Hãng</h5>
                <p className="text-muted small mb-0">
                  Sử dụng 100% linh phụ kiện chính hãng từ Panasonic, Daikin, LG, Toshiba... dán tem bảo hành điện tử chống hàng giả.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Display Section */}
      <section className="py-5 bg-light" id="services">
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col-lg-8 mx-auto">
              <span className="text-primary fw-bold text-uppercase tracking-wider small">Danh mục giải pháp</span>
              <h2 className="fw-bold mt-2">Dịch Vụ Kỹ Thuật Điện Lạnh Nổi Bật</h2>
              <div className="bg-primary mx-auto my-3" style={{ width: '60px', height: '3px' }}></div>
              <p className="text-muted">
                Đáp ứng trọn gói mọi nhu cầu từ sửa chữa nhanh hộ gia đình đến hệ thống làm lạnh công nghiệp công suất lớn.
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          {categories.length > 0 && (
            <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`btn rounded-pill px-4 ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
              >
                Tất cả dịch vụ
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn rounded-pill px-4 ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Services Grid */}
          <div className="row g-4">
            {displayServices.map((service: any) => (
              <div key={service.id} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-shadow transition-all">
                  {/* Card Badge */}
                  <div className="position-absolute top-0 end-0 m-3 z-3">
                    <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill font-semibold">
                      <i className="bi bi-star-fill text-warning me-1"></i> {service.rating || '5.0'}
                    </span>
                  </div>

                  <div className="card-body p-4 pt-5">
                    {/* Icon */}
                    <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 mb-4 d-inline-block">
                      <i className={`bi ${service.icon || 'bi-gear-fill'} fs-3`}></i>
                    </div>

                    <h5 className="card-title fw-bold text-dark mb-2">{service.name}</h5>
                    <h6 className="card-subtitle mb-3 text-primary-emphasis small font-medium">Hãng/Hệ: {service.brand}</h6>

                    <p className="card-text text-muted small mb-4">
                      {service.description || 'Dịch vụ xử lý kỹ thuật điện lạnh chuyên nghiệp với linh kiện chính hãng bảo hành dài lâu.'}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light-subtle">
                      <span className="text-secondary small">Giá tham khảo</span>
                      <span className="text-primary fw-bold">{service.price || 'Khảo sát báo giá'}</span>
                    </div>
                  </div>

                  <div className="card-footer bg-white border-0 p-4 pt-0 d-flex gap-2">
                    <Link href={`/repair/${service.id}`} className="btn btn-outline-primary flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 small">
                      <i className="bi bi-info-circle-fill"></i>
                      <span>Xem chi tiết</span>
                    </Link>
                    <a href="tel:0988123456" className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} title="Gọi điện khẩn cấp">
                      <i className="bi bi-telephone-fill"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bảng Giá Dịch Vụ Niêm Yết Section */}
      <section className="py-5 bg-white" id="pricing">
        <div className="container py-lg-4">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <span className="text-primary fw-bold text-uppercase tracking-wider small">
                <i className="bi bi-tags me-1"></i> Bảng giá minh bạch
              </span>
              <h2 className="fw-bold mt-2">Bảng Giá Dịch Vụ Sửa Chữa & Bảo Dưỡng</h2>
              <div className="bg-primary mx-auto my-3" style={{ width: '60px', height: '3px' }}></div>
              <p className="text-muted">
                Cam kết báo giá rõ ràng trước khi thi công, miễn phí kiểm tra tận nhà nếu quý khách sử dụng dịch vụ.
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Gói 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border rounded-4 shadow-sm p-4 text-center hover-up transition-all">
                <div className="text-primary mb-3">
                  <i className="bi bi-snow fs-1"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Vệ Sinh Máy Lạnh</h4>
                <p className="text-muted small">Dành cho hộ gia đình & văn phòng</p>
                <div className="my-3 py-2 bg-light rounded-3">
                  <span className="text-muted small">Từ </span>
                  <span className="fs-3 fw-bold text-primary">150.000đ</span>
                  <span className="text-muted small"> / máy</span>
                </div>
                <ul className="list-unstyled text-start small d-flex flex-column gap-2 my-4 text-secondary">
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Xịt rửa dàn lạnh & dàn nóng bằng máy cao áp</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Thông tắc máng nước, ống thoát thải</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Đo áp suất gas và dòng tải ampe</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Bảo hành chảy nước 30 ngày</li>
                </ul>
                <Link href="/repair/1" className="btn btn-outline-primary rounded-pill w-100 py-2 fw-semibold mt-auto">
                  Đặt Lịch Ngay
                </Link>
              </div>
            </div>

            {/* Gói 2: Phổ biến nhất */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-2 border-primary rounded-4 shadow p-4 text-center position-relative hover-up transition-all bg-primary bg-opacity-10">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold shadow-sm">
                    PHỔ BIẾN NHẤT
                  </span>
                </div>
                <div className="text-primary mb-3 mt-2">
                  <i className="bi bi-shield-fill-check fs-1"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Sửa Chữa Tủ Lạnh</h4>
                <p className="text-muted small">Inverter, Side-by-side các hãng</p>
                <div className="my-3 py-2 bg-white rounded-3 shadow-sm">
                  <span className="text-muted small">Báo giá từ </span>
                  <span className="fs-3 fw-bold text-primary">250.000đ</span>
                </div>
                <ul className="list-unstyled text-start small d-flex flex-column gap-2 my-4 text-secondary">
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Khắc phục tủ không lạnh, không đông đá</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Xử lý xì gas dàn lạnh, thay cảm biến sensor</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Linh kiện chính hãng 100%</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Bảo hành vàng từ 6 - 12 tháng</li>
                </ul>
                <Link href="/repair/2" className="btn btn-primary rounded-pill w-100 py-2 fw-semibold mt-auto shadow">
                  Đặt Lịch Sửa Chữa
                </Link>
              </div>
            </div>

            {/* Gói 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border rounded-4 shadow-sm p-4 text-center hover-up transition-all">
                <div className="text-primary mb-3">
                  <i className="bi bi-water fs-1"></i>
                </div>
                <h4 className="fw-bold text-dark mb-1">Vệ Sinh Máy Giặt</h4>
                <p className="text-muted small">Cửa trên & Cửa ngang lồng nghiêng</p>
                <div className="my-3 py-2 bg-light rounded-3">
                  <span className="text-muted small">Từ </span>
                  <span className="fs-3 fw-bold text-primary">250.000đ</span>
                  <span className="text-muted small"> / máy</span>
                </div>
                <ul className="list-unstyled text-start small d-flex flex-column gap-2 my-4 text-secondary">
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Tháo bung lồng giặt tẩy sạch cặn bẩn</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Khử trùng diệt khuẩn lồng giặt inox</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Cân chỉnh giảm xóc chống rung lắc</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i>Giảm 10% khi làm combo máy lạnh</li>
                </ul>
                <Link href="/repair/3" className="btn btn-outline-primary rounded-pill w-100 py-2 fw-semibold mt-auto">
                  Đặt Lịch Ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Action Banner CTA */}
      <section className="py-5 bg-dark text-white text-center position-relative">
        <div className="container py-3">
          <h2 className="fw-bold mb-3">Hệ thống máy lạnh gặp sự cố?</h2>
          <p className="lead text-secondary mb-4 mx-auto" style={{ maxWidth: '650px' }}>
            Đừng lo lắng! Đội ngũ DMS trực máy 24/7 luôn sẵn sàng hỗ trợ bạn nhanh chóng nhất tại bất cứ khu vực nào.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <a href="tel:0988123456" className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow fw-bold">
              <i className="bi bi-telephone-fill me-2"></i> Gọi 0988.123.456
            </a>
            <a href="#contact" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3">
              Yêu cầu báo giá qua Email
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
