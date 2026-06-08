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
      <section className="bg-gradient text-white py-5 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
      }}>
        {/* Glow Effects */}
        <div className="position-absolute rounded-circle bg-light opacity-10" style={{ width: '300px', height: '300px', top: '-100px', right: '-50px' }}></div>
        <div className="position-absolute rounded-circle bg-warning opacity-10" style={{ width: '200px', height: '200px', bottom: '-50px', left: '-50px' }}></div>

        <div className="container py-lg-5 position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-2 text-uppercase tracking-wider">
                <i className="bi bi-shield-fill-check me-2"></i>Uy tín - Chuyên nghiệp - Nhanh chóng
              </span>
              <h1 className="display-4 fw-extrabold text-white mb-3 lh-sm">
                Giải Pháp Điện Lạnh <br />
                <span className="text-warning">Kỹ Thuật Cao DMS</span>
              </h1>
              <p className="lead text-light mb-4">
                Chuyên bảo dưỡng, sửa chữa và lắp đặt điều hòa dân dụng, hệ thống điều hòa trung tâm VRV, tủ lạnh Inverter hiệu suất tối ưu. Hỗ trợ khẩn cấp 24/7.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="#services" className="btn btn-warning btn-lg px-4 py-3 fw-bold rounded-pill shadow">
                  Khám phá dịch vụ <i className="bi bi-arrow-right ms-2"></i>
                </a>
                <a href="tel:0988123456" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                  <i className="bi bi-telephone me-2"></i> Gọi ngay: 0988.123.456
                </a>
              </div>

              {/* Mini Stats */}
              <div className="row mt-5 pt-4 border-top border-primary-subtle g-3 text-center text-sm-start">
                <div className="col-4">
                  <h3 className="fw-bold m-0 text-warning">10+</h3>
                  <small className="text-light-50">Năm kinh nghiệm</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold m-0 text-warning">15.000+</h3>
                  <small className="text-light-50">Khách hàng tin dùng</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold m-0 text-warning">100%</h3>
                  <small className="text-light-50">Thợ chuẩn tay nghề</small>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block text-center position-relative">
              {/* Floating badges */}
              <div className="card shadow-lg p-3 position-absolute bg-white text-dark rounded-3 border-0 d-flex flex-row align-items-center gap-3 animate-bounce" style={{ top: '15%', left: '5%', zIndex: 10 }}>
                <div className="bg-primary-subtle text-primary rounded-circle p-2">
                  <i className="bi bi-clock-history fs-4"></i>
                </div>
                <div className="text-start">
                  <h6 className="m-0 fw-bold">Có mặt trong 30p</h6>
                  <small className="text-muted">Nhanh chóng tiện lợi</small>
                </div>
              </div>

              <div className="card shadow-lg p-3 position-absolute bg-white text-dark rounded-3 border-0 d-flex flex-row align-items-center gap-3" style={{ bottom: '15%', right: '5%', zIndex: 10 }}>
                <div className="bg-success-subtle text-success rounded-circle p-2">
                  <i className="bi bi-patch-check-fill fs-4"></i>
                </div>
                <div className="text-start">
                  <h6 className="m-0 fw-bold">Bảo hành 6-12 tháng</h6>
                  <small className="text-muted">Chính sách uy tín tuyệt đối</small>
                </div>
              </div>

              {/* Main premium illustration placeholder */}
              <div className="bg-white bg-opacity-10 p-4 rounded-4 inline-block border border-light border-opacity-10">
                <div className="bg-dark bg-opacity-25 rounded-4 p-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ width: '450px', height: '350px' }}>
                  <i className="bi bi-snow2 text-warning display-1 mb-4 animate-spin" style={{ animationDuration: '8s' }}></i>
                  <h4 className="text-white fw-bold">DMS REFRIGERATION</h4>
                  <p className="text-light-50 small px-3">Hệ thống điều khiển kỹ thuật làm mát và tiết kiệm năng lượng tối ưu cho mọi công trình của bạn.</p>
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
                    <Link href={`/services/${service.id}`} className="btn btn-outline-primary flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 small">
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

      {/* 4. Action Banner CTA */}
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
