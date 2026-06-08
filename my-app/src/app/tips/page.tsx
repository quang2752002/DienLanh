'use client';

import React from 'react';
import { useTips } from '@/hooks/useTips';
import Link from 'next/link';

const DEFAULT_TIPS = [
  {
    id: 't-1',
    title: '5 Mẹo Sử Dụng Máy Lạnh Tiết Kiệm Điện Đến 30%',
    shortDescription: 'Chia sẻ các thói quen sử dụng thông minh như điều chỉnh nhiệt độ chuẩn, dùng chế độ Dry/Eco và kết hợp quạt giúp hóa đơn tiền điện nhà bạn giảm đáng kể.',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    author: 'Kỹ sư DMS',
    created: '2026-06-01T00:00:00Z',
  },
  {
    id: 't-2',
    title: 'Dấu Hiệu Nhận Biết Máy Lạnh Bị Thiếu Gas Cần Nạp Ngay',
    shortDescription: 'Khi máy lạnh chạy liên tục nhưng không lạnh sâu, xuất hiện tuyết bám ở van ống nhỏ dàn nóng, đó là lúc bạn cần gọi kỹ thuật nạp gas tránh hỏng block máy.',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=600&q=80',
    author: 'Tổ trưởng Kỹ thuật',
    created: '2026-06-03T00:00:00Z',
  },
  {
    id: 't-3',
    title: 'Hướng Dẫn Tự Vệ Sinh Lưới Lọc Máy Lạnh Tại Nhà Đơn Giản',
    shortDescription: 'Chỉ với 10 phút tự tháo và xịt rửa tấm lưới lọc bụi định kỳ 2 tuần một lần, bạn sẽ giúp luồng gió thổi ra luôn sạch khuẩn và bảo vệ sức khỏe cho bé.',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80',
    author: 'Chuyên gia DMS',
    created: '2026-06-05T00:00:00Z',
  },
  {
    id: 't-4',
    title: 'Cách Sắp Xếp Tủ Lạnh Khoa Học Giúp Thực Phẩm Luôn Tươi Ngon',
    shortDescription: 'Hướng dẫn phân loại thực phẩm chín, sống, rau củ quả ở các ngăn nhiệt độ chuyên dụng để kéo dài thời gian bảo quản và khử mùi hôi tủ lạnh hiệu quả.',
    imageUrl: 'https://images.unsplash.com/photo-1571175482276-5447b516ff9f?auto=format&fit=crop&w=600&q=80',
    author: 'DMS HomeCare',
    created: '2026-06-07T00:00:00Z',
  }
];

export default function TipsPage() {
  const { tips, loading } = useTips();

  const displayTips = tips.length > 0 ? tips : DEFAULT_TIPS;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Gần đây';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container py-5">
      {/* Header Title */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider">
          Góc chia sẻ DMS
        </span>
        <h1 className="fw-bold mt-2 display-5 text-dark">Mẹo Vặt & Cẩm Nang Điện Lạnh</h1>
        <div className="bg-primary mx-auto my-3" style={{ width: '60px', height: '3px' }}></div>
        <p className="text-muted max-width-600 mx-auto">
          Tổng hợp các bài viết hướng dẫn kỹ thuật, mẹo tiết kiệm năng lượng và các lưu ý sử dụng thiết bị lạnh dân dụng bền bỉ từ đội ngũ chuyên gia của chúng tôi.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Đang tải danh sách cẩm nang...</p>
        </div>
      ) : (
        <div className="row g-4">
          {displayTips.map((tip) => (
            <div key={tip.id} className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition-all bg-white">
                <div className="row g-0 h-100">
                  {/* Image portion */}
                  <div className="col-md-5 position-relative bg-light" style={{ minHeight: '200px' }}>
                    {/* Fallback pattern if no image */}
                    {tip.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={tip.imageUrl} 
                        alt={tip.title} 
                        className="w-100 h-100 object-cover position-absolute"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center text-primary bg-primary-subtle">
                        <i className="bi bi-journal-text display-4"></i>
                      </div>
                    )}
                  </div>

                  {/* Body portion */}
                  <div className="col-md-7 d-flex flex-column">
                    <div className="card-body p-4 d-flex flex-column h-100">
                      <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                        <span><i className="bi bi-person-fill text-primary"></i> {tip.author}</span>
                        <span><i className="bi bi-calendar3"></i> {formatDate(tip.created)}</span>
                      </div>
                      
                      <h5 className="card-title fw-bold text-dark mb-2 lh-base">
                        {tip.title}
                      </h5>
                      
                      <p className="card-text text-muted small mb-4 flex-grow-1">
                        {tip.shortDescription}
                      </p>

                      <Link href={`/tips/${tip.id}`} className="btn btn-outline-primary rounded-pill btn-sm px-4 align-self-start mt-auto">
                        Đọc tiếp <i className="bi bi-chevron-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
