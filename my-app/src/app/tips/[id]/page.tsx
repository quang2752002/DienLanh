'use client';

import React, { useEffect } from 'react';
import { useTips } from '@/hooks/useTips';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TipDetailPage() {
  const { id } = useParams();
  const { getTipById, activeTip, loadingActiveTip } = useTips();

  useEffect(() => {
    if (id) {
      getTipById(id as string);
    }
  }, [id, getTipById]);

  if (loadingActiveTip) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (!activeTip) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning rounded-4 shadow-sm max-width-600 mx-auto py-5">
          <i className="bi bi-exclamation-triangle-fill display-4 text-warning mb-3"></i>
          <h4>Không tìm thấy bài viết</h4>
          <p className="text-muted">Cẩm nang yêu cầu không tồn tại hoặc đã được gỡ bỏ khỏi hệ thống.</p>
          <Link href="/tips" className="btn btn-primary rounded-pill mt-3 px-4">
            Quay lại Cẩm nang
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Gần đây';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Safe default content for tips details
  const defaultArticleContent = `
    <p>Máy lạnh (điều hòa) là thiết bị tiêu thụ điện năng lớn hàng đầu trong các gia đình hiện nay, đặc biệt vào những tháng hè cao điểm. Để giảm thiểu hóa đơn tiền điện mà vẫn đảm bảo hiệu suất làm lạnh tối ưu, hãy áp dụng ngay 5 nguyên tắc kỹ thuật sau:</p>
    
    <h3>1. Đặt nhiệt độ phòng từ 26°C đến 28°C</h3>
    <p>Nhiều người có thói quen đặt nhiệt độ rất thấp (18°C - 20°C) khi vừa khởi động để máy lạnh nhanh mát. Tuy nhiên, điều này khiến block máy hoạt động quá tải ở dòng điện cực đại, tiêu hao rất nhiều năng lượng. Các nghiên cứu chỉ ra rằng tăng 1°C sẽ giúp bạn tiết kiệm khoảng 7% - 10% điện năng tiêu thụ.</p>

    <h3>2. Sử dụng kết hợp quạt điện công suất nhỏ</h3>
    <p>Khi bật máy lạnh kết hợp với một chiếc quạt điện quay nhẹ, luồng gió từ quạt sẽ giúp luân chuyển luồng không khí lạnh đồng đều khắp phòng nhanh hơn. Cảm giác mát mẻ sẽ đến sớm hơn và sâu hơn mà bạn không cần phải hạ nhiệt độ máy lạnh xuống quá thấp.</p>

    <h3>3. Đóng kín các khe hở cửa và tránh ánh nắng trực tiếp</h3>
    <p>Hãy chắn ánh nắng trực tiếp chiếu vào phòng bằng rèm cửa sáng màu. Ánh nắng làm nóng phòng nhanh khiến điều hòa phải làm việc liên tục. Đảm bảo phòng được đóng kín để ngăn thất thoát hơi lạnh ra ngoài.</p>

    <h3>4. Không bật tắt máy lạnh liên tục</h3>
    <p>Nhiều người nghĩ tắt máy lạnh khi phòng đủ mát và bật lại khi thấy nóng sẽ tiết kiệm điện. Thực tế, quy trình khởi động lốc máy là lúc tiêu thụ điện năng gấp 3 lần bình thường. Hãy giữ máy chạy ổn định và dùng chế độ hẹn giờ thông minh.</p>

    <h3>5. Vệ sinh lưới lọc bụi định kỳ 2 tuần/lần</h3>
    <p>Tấm lưới lọc bụi bẩn làm giảm lưu lượng gió thổi qua dàn lạnh, khiến hơi lạnh không tỏa ra phòng mà ứ đọng tại dàn lạnh làm đông tuyết. Kéo theo công suất lạnh giảm và máy lạnh phải chạy gồng sức. Việc tháo lưới lọc xịt rửa cực kỳ đơn giản và nên thực hiện thường xuyên.</p>
  `;

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Trang chủ</Link></li>
          <li className="breadcrumb-item"><Link href="/tips">Cẩm nang</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Chi tiết bài viết</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            
            {/* Header Block */}
            <header className="border-bottom pb-4 mb-4">
              <h1 className="fw-extrabold text-dark display-6 lh-sm mb-3">
                {activeTip.title}
              </h1>
              
              <div className="d-flex align-items-center gap-3 text-muted small">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-person-circle text-primary fs-5"></i>
                  <span>Đăng bởi: <strong>{activeTip.author}</strong></span>
                </div>
                <span>&bull;</span>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-calendar3"></i>
                  <span>Ngày đăng: {formatDate(activeTip.created)}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {activeTip.imageUrl && (
              <div className="mb-4 rounded-4 overflow-hidden shadow-sm" style={{ maxHeight: '400px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={activeTip.imageUrl} 
                  alt={activeTip.title}
                  className="w-100 object-cover"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}

            {/* Short Description */}
            <div className="lead text-dark fw-medium mb-4 lh-base">
              {activeTip.shortDescription}
            </div>

            {/* Post Content */}
            <div className="post-content text-secondary lh-lg fs-6">
              {activeTip.content ? (
                <div dangerouslySetInnerHTML={{ __html: activeTip.content }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: defaultArticleContent }} />
              )}
            </div>

            {/* Footer Navigation */}
            <footer className="mt-5 pt-4 border-top d-flex justify-content-between align-items-center">
              <Link href="/tips" className="btn btn-outline-primary rounded-pill px-4">
                <i className="bi bi-arrow-left me-2"></i> Quay lại Cẩm nang
              </Link>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
