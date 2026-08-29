import { useCrud } from '@/hooks/useCrud';
import { tipApi } from '@/apis/tipApi';
import { Tip, CreateTipInput } from '@/types/tip';
import { useState, useCallback } from 'react';

const DEFAULT_TIPS: Tip[] = [
  {
    id: 't-1',
    title: '5 Mẹo Sử Dụng Máy Lạnh Tiết Kiệm Điện Đến 30%',
    slug: '5-meo-su-dung-may-lanh-tiet-kiem-dien',
    shortDescription: 'Chia sẻ các thói quen sử dụng thông minh như điều chỉnh nhiệt độ chuẩn, dùng chế độ Dry/Eco và kết hợp quạt giúp hóa đơn tiền điện nhà bạn giảm đáng kể.',
    content: `
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
    `,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    author: 'Kỹ sư DMS',
    isActive: true,
    created: '2026-06-01T00:00:00Z',
  },
  {
    id: 't-2',
    title: 'Dấu Hiệu Nhận Biết Máy Lạnh Bị Thiếu Gas Cần Nạp Ngay',
    slug: 'dau-hieu-nhan-biet-may-lanh-bi-thieu-gas',
    shortDescription: 'Khi máy lạnh chạy liên tục nhưng không lạnh sâu, xuất hiện tuyết bám ở van ống nhỏ dàn nóng, đó là lúc bạn cần gọi kỹ thuật nạp gas tránh hỏng block máy.',
    content: `
      <p>Hệ thống máy lạnh là một vòng tuần hoàn kín, về mặt lý thuyết gas làm lạnh sẽ không bị tiêu hao trong quá trình sử dụng. Tuy nhiên do rung lắc, hở rắc co hoặc oxy hóa đường ống đồng, gas có thể bị rò rỉ dẫn đến thiếu hụt gas.</p>
      <h3>Các dấu hiệu máy lạnh bị thiếu gas:</h3>
      <ul>
        <li>Máy lạnh làm lạnh rất yếu hoặc chỉ phả ra gió thường dù đã chỉnh 16°C.</li>
        <li>Bám tuyết trắng xóa ở đầu van ống đồng nhỏ tại cục nóng ngoài trời.</li>
        <li>Máy lạnh chạy một lúc rồi tự động ngắt và báo lỗi nhấp nháy đèn Timer.</li>
        <li>Dòng điện hoạt động đo bằng ampe kìm thấp hơn nhiều so với dòng định mức ghi trên tem máy.</li>
      </ul>
      <p>Khi phát hiện các dấu hiệu trên, hãy tắt máy và liên hệ dịch vụ kiểm tra xì dàn và nạp gas bổ sung kịp thời để tránh cháy block (máy nén).</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=600&q=80',
    author: 'Tổ trưởng Kỹ thuật',
    isActive: true,
    created: '2026-06-03T00:00:00Z',
  },
  {
    id: 't-3',
    title: 'Hướng Dẫn Tự Vệ Sinh Lưới Lọc Máy Lạnh Tại Nhà Đơn Giản',
    slug: 'huong-dan-tu-ve-sinh-luoi-loc-may-lanh',
    shortDescription: 'Chỉ với 10 phút tự tháo và xịt rửa tấm lưới lọc bụi định kỳ 2 tuần một lần, bạn sẽ giúp luồng gió thổi ra luôn sạch khuẩn và bảo vệ sức khỏe cho bé.',
    content: `
      <p>Lưới lọc không khí trong dàn lạnh là chốt chặn đầu tiên giữ lại bụi bẩn, lông thú cưng và phấn hoa. Vệ sinh lưới lọc đều đặn giúp tăng hiệu suất làm lạnh lên tới 15%.</p>
      <h3>Quy trình 4 bước tự làm tại nhà:</h3>
      <ol>
        <li>Ngắt cầu dao (Aptomat) của máy lạnh để đảm bảo an toàn tuyệt đối.</li>
        <li>Dùng tay nhấc nhẹ nắp mặt nạ dàn lạnh lên và rút 2 tấm lưới lọc ra ngoài.</li>
        <li>Dùng vòi xịt nước rửa từ mặt sau ra mặt trước để đẩy hết bụi bẩn trôi ra ngoài.</li>
        <li>Phơi lưới lọc trong bóng râm cho khô ráo hoàn toàn rồi gài lại vào vị trí cũ.</li>
      </ol>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80',
    author: 'Chuyên gia DMS',
    isActive: true,
    created: '2026-06-05T00:00:00Z',
  },
  {
    id: 't-4',
    title: 'Cách Sắp Xếp Tủ Lạnh Khoa Học Giúp Thực Phẩm Luôn Tươi Ngon',
    slug: 'cach-sap-xep-tu-lanh-khoa-hoc',
    shortDescription: 'Hướng dẫn phân loại thực phẩm chín, sống, rau củ quả ở các ngăn nhiệt độ chuyên dụng để kéo dài thời gian bảo quản và khử mùi hôi tủ lạnh hiệu quả.',
    content: `
      <p>Sắp xếp thực phẩm đúng cách trong tủ lạnh không chỉ giúp bảo quản đồ ăn tươi ngon lâu hơn mà còn giúp luồng khí lạnh lưu thông đều đặn, tiết kiệm điện năng tiêu thụ.</p>
      <h3>Nguyên tắc sắp xếp từng ngăn:</h3>
      <ul>
        <li><strong>Ngăn đông đá:</strong> Thịt cá tươi sống dùng dài ngày, kem và đá viên. Đóng gói kín bằng hộp bảo quản.</li>
        <li><strong>Ngăn mát trên cùng:</strong> Thức ăn chín còn thừa, sữa chua, bánh ngọt (nơi nhiệt độ ổn định nhất).</li>
        <li><strong>Ngăn mát giữa:</strong> Trứng, sữa, các loại đồ uống.</li>
        <li><strong>Ngăn rau củ quả riêng biệt:</strong> Duy trì độ ẩm cao giúp rau xanh không bị héo úa.</li>
      </ul>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1571175482276-5447b516ff9f?auto=format&fit=crop&w=600&q=80',
    author: 'DMS HomeCare',
    isActive: true,
    created: '2026-06-07T00:00:00Z',
  }
];

export const useTips = () => {
  const {
    data: tips,
    loading,
    error,
    refresh,
    create: createTip,
    update: updateTip,
    remove: removeTip,
  } = useCrud<Tip, CreateTipInput, Tip>(tipApi);

  const [activeTip, setActiveTip] = useState<Tip | null>(null);
  const [loadingActiveTip, setLoadingActiveTip] = useState(false);

  const getTipById = useCallback(async (idOrSlug: string) => {
    try {
      setLoadingActiveTip(true);
      const strParam = String(idOrSlug);

      try {
        const tip = await tipApi.getById(strParam);
        if (tip && tip.id) {
          setActiveTip(tip);
          return tip;
        }
      } catch {
        // Fallback to local data
      }

      const fallback = DEFAULT_TIPS.find(
        (t) => t.id === strParam || 
               t.slug === strParam || 
               t.id === `t-${strParam}` || 
               strParam.includes(t.id)
      );

      if (fallback) {
        setActiveTip(fallback);
        return fallback;
      }
      return null;
    } catch (e) {
      console.error(e);
      const fallback = DEFAULT_TIPS[0];
      setActiveTip(fallback);
      return fallback;
    } finally {
      setLoadingActiveTip(false);
    }
  }, []);

  const displayTips = tips && tips.length > 0 ? tips : DEFAULT_TIPS;

  return {
    tips: displayTips,
    loading,
    error,
    refresh,
    createTip,
    updateTip,
    removeTip,
    activeTip,
    loadingActiveTip,
    getTipById,
  };
};
