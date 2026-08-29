import { useState, useCallback } from 'react';
import { useCrud } from '@/hooks/useCrud';
import { repairApi } from '@/apis/repairApi';
import { Repair, CreateRepairInput } from '@/types/repair';

const DEFAULT_MOCK_REPAIRS: Repair[] = [
  {
    id: 1,
    name: 'Bảo Dưỡng & Vệ Sinh Máy Lạnh Treo Tường, Âm Trần',
    slug: 'bao-duong-ve-sinh-may-lanh',
    description: 'Quy trình vệ sinh lưới lọc, xịt rửa dàn lạnh, dàn nóng chuyên sâu bằng máy áp lực cao, kiểm tra và nạp gas chuẩn R32/R410A.',
    img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    categoryId: 1,
    categoryName: 'Máy Lạnh & Điều Hòa',
    created: '2026-08-29T00:00:00Z',
    content: `
      <h3>1. Khi nào bạn cần bảo dưỡng vệ sinh máy lạnh?</h3>
      <p>Máy lạnh sau 3-6 tháng sử dụng thường bám nhiều bụi bẩn trên lưới lọc và dàn tản nhiệt. Điều này dẫn đến việc máy làm mát kém, tiêu tốn nhiều điện năng và tạo môi trường cho vi khuẩn nấm mốc phát triển.</p>
      <ul>
        <li>Máy lạnh phả ra mùi hôi khó chịu khi mới bật.</li>
        <li>Máy chạy nhưng không thấy mát hoặc làm mát rất chậm.</li>
        <li>Hiện tượng chảy nước ở cục lạnh trong nhà.</li>
        <li>Cục nóng ngoài trời kêu to hoặc phát ra tiếng ồn bất thường.</li>
      </ul>
      <h3>2. Quy trình 6 bước vệ sinh chuẩn kỹ thuật tại DMS:</h3>
      <ol>
        <li><strong>Kiểm tra tổng quan:</strong> Khảo sát tình trạng hoạt động của máy, kiểm tra rò điện và đo áp suất gas trước khi tháo.</li>
        <li><strong>Tháo dỡ vỏ máy:</strong> Vệ sinh lưới lọc bụi, mặt nạ dàn lạnh bằng dung dịch tẩy rửa sinh học an toàn.</li>
        <li><strong>Xịt rửa dàn lạnh:</strong> Sử dụng bạt hứng chuyên dụng và máy bơm tăng áp rửa sạch sâu bụi bẩn bám ở lá nhôm tản nhiệt và quạt lồng sóc.</li>
        <li><strong>Xịt rửa dàn nóng:</strong> Vệ sinh quạt và dàn tản nhiệt cục nóng ngoài trời giúp giải nhiệt nhanh, tăng tuổi thọ máy nén (block).</li>
        <li><strong>Đo kiểm tra gas & dòng điện:</strong> Đo áp suất gas và dòng tải ampe, bổ sung gas nếu thiếu hụt theo đúng tiêu chuẩn hãng.</li>
        <li><strong>Lắp ráp & chạy thử:</strong> Vận hành kiểm tra nhiệt độ cửa gió đạt chuẩn từ 16-20°C, dán tem bảo hành và bàn giao cho khách hàng.</li>
      </ol>
      <div class="alert alert-info">
        <h5><i class="bi bi-shield-check me-2"></i>Cam kết chất lượng DMS:</h5>
        <p class="mb-0">Cam kết sạch sẽ, không làm bẩn tường/sàn nhà của khách hàng. Bảo hành dàn lạnh không chảy nước trong 30 ngày sau vệ sinh.</p>
      </div>
    `
  },
  {
    id: 2,
    name: 'Sửa Chữa Tủ Lạnh Inverter Không Đông Đá, Kêu To',
    slug: 'sua-chua-tu-lanh-inverter',
    description: 'Khắc phục triệt để các sự cố tủ lạnh không lạnh, không đông đá, hỏng sensor cảm biến nhiệt độ, hỏng block, xì dàn gas hoặc lỗi bo mạch Inverter.',
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
    categoryId: 2,
    categoryName: 'Tủ Lạnh & Tủ Đông',
    created: '2026-08-29T00:00:00Z',
    content: `
      <h3>1. Các lỗi phổ biến thường gặp ở tủ lạnh Inverter:</h3>
      <p>Tủ lạnh công nghệ Inverter tiết kiệm điện nhưng có cấu tạo mạch điện tử phức tạp. Dưới đây là những triệu chứng hư hỏng cần gọi thợ kỹ thuật ngay:</p>
      <ul>
        <li>Ngăn đá không đông hoặc làm đá rất chậm, ngăn mát không có hơi lạnh.</li>
        <li>Tủ lạnh phát tiếng kêu rè rè hoặc lạch cạch lớn từ phía sau hoặc quạt gió.</li>
        <li>Tủ bị đọng sương, chảy nước ở cửa tủ hoặc mặt đáy ngăn rau củ.</li>
        <li>Đèn tủ lạnh vẫn sáng nhưng block máy nén không chạy, thân tủ không ấm.</li>
        <li>Tủ báo lỗi nháy đèn trên bảng điều khiển điện tử (lỗi giao tiếp bo mạch).</li>
      </ul>
      <h3>2. Dịch vụ sửa chữa tủ lạnh uy tín tại DMS:</h3>
      <p>Đội ngũ thợ điện lạnh tay nghề cao, được đào tạo chuyên sâu về các dòng tủ lạnh Side by Side, Inverter của các hãng Panasonic, Toshiba, Hitachi, Samsung, LG, Electrolux...</p>
      <ol>
        <li>Khám đúng bệnh - Báo đúng giá theo quy định niêm yết của công ty.</li>
        <li>Linh kiện thay thế chính hãng 100% (Block, Sò nóng, Sò lạnh, Sensor, Bo mạch...).</li>
        <li>Bảo hành chu đáo từ 6 đến 12 tháng tùy hạng mục linh kiện thay thế.</li>
      </ol>
    `
  },
  {
    id: 3,
    name: 'Sửa Chữa & Vệ Sinh Lồng Giặt Máy Giặt Cửa Ngang / Cửa Trên',
    slug: 'sua-chua-ve-sinh-may-giat',
    description: 'Bảo dưỡng tháo lồng giặt vệ sinh cặn bẩn xơ vải, sửa máy giặt không vắt, không xả nước, rung lắc mạnh khi vắt hoặc hỏng board điều khiển.',
    img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop',
    categoryId: 3,
    categoryName: 'Máy Giặt & Máy Sấy',
    created: '2026-08-29T00:00:00Z',
    content: `
      <h3>1. Tầm quan trọng của việc bảo dưỡng máy giặt định kỳ</h3>
      <p>Sau thời gian dài sử dụng, cặn xà phòng kết hợp với bụi bẩn và xơ vải bám thành từng mảng đen dày đặc phía sau lồng giặt mà mắt thường không thấy được. Điều này làm quần áo giặt xong vẫn có mùi ẩm mốc và dễ gây dị ứng da.</p>
      <h3>2. Các hạng mục dịch vụ máy giặt tại DMS:</h3>
      <ul>
        <li><strong>Tháo lồng giặt vệ sinh chuyên sâu:</strong> Tháo rời toàn bộ mâm giặt, lồng giặt inox, dùng máy xịt cao áp tẩy sạch 100% mảng bám cặn bẩn.</li>
        <li><strong>Sửa lỗi không cấp/xả nước:</strong> Thay van cấp nước đơn/đôi, mô tơ xả nước chính hãng.</li>
        <li><strong>Khắc phục rung lắc, kêu to:</strong> Thay giảm xóc (phuộc nhún), căn chỉnh chân đế, thay thế vòng bi (bạc đạn) và chảng ba lồng giặt.</li>
        <li><strong>Sửa lỗi bo mạch điều khiển:</strong> Xử lý máy giặt chớp đèn báo lỗi E1, E2, E3, E4, DE, IE, OE...</li>
      </ul>
      <div class="alert alert-success">
        <strong>Ưu đãi:</strong> Giảm ngay 10% chi phí khi đặt lịch combo vệ sinh cả máy lạnh và máy giặt cùng lúc!
      </div>
    `
  },
  {
    id: 4,
    name: 'Lắp Đặt & Di Dời Máy Lạnh Chuyên Nghiệp',
    slug: 'lap-dat-di-doi-may-lanh',
    description: 'Dịch vụ tháo dỡ, di dời vị trí và lắp đặt mới máy lạnh treo tường, máy lạnh âm trần cassette, Multi đảm bảo tính thẩm mỹ và kỹ thuật tối ưu.',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
    categoryId: 1,
    categoryName: 'Máy Lạnh & Điều Hòa',
    created: '2026-08-29T00:00:00Z',
    content: `
      <h3>1. Tiêu chuẩn thi công lắp đặt máy lạnh tại DMS</h3>
      <p>Lắp đặt máy lạnh sai kỹ thuật có thể gây xì gas, chảy nước, block nhanh hỏng và hao tốn nhiều điện năng. DMS cam kết thực hiện đúng tiêu chuẩn kỹ thuật:</p>
      <ol>
        <li><strong>Ống đồng dẫn gas:</strong> Độ dày ống đồng đạt chuẩn tối thiểu 0.71mm, ống đồng dài tối thiểu 3m để máy vận hành êm ái, bền bỉ.</li>
        <li><strong>Hút chân không hệ thống:</strong> 100% công trình đều được hút chân không kỹ càng bằng bơm chân không chuyên dụng trước khi xả gas.</li>
        <li><strong>Bọc bảo ôn & quấn xi:</strong> Bọc bảo ôn cách nhiệt đôi chống đọng sương, quấn xi thẩm mỹ ngăn chuột bọ cắn phá.</li>
        <li><strong>Cân chỉnh thăng bằng:</strong> Dùng thước thủy cân bằng máy chuẩn xác, chống rung lắc và tránh tắc máng nước thải.</li>
      </ol>
    `
  }
];

export const useRepairs = () => {
  const {
    data: repairs,
    loading,
    error,
    refresh,
    create: createRepair,
    update: updateRepair,
    remove: removeRepair,
  } = useCrud<Repair, CreateRepairInput, Repair>(repairApi);

  const [activeRepair, setActiveRepair] = useState<Repair | null>(null);
  const [loadingActiveRepair, setLoadingActiveRepair] = useState(false);

  const getRepairById = useCallback(async (id: string | number) => {
    try {
      setLoadingActiveRepair(true);
      const res = await repairApi.getById(String(id));
      if (res && res.id) {
        setActiveRepair(res);
        return res;
      }
      // Fallback nếu không có kết quả từ API
      const fallback = DEFAULT_MOCK_REPAIRS.find(
        (r) => String(r.id) === String(id) || String(r.id) === String(id).replace('sd-', '')
      );
      if (fallback) {
        setActiveRepair(fallback);
        return fallback;
      }
      return null;
    } catch (e) {
      console.error(e);
      // Fallback sang danh sách có sẵn
      const fallback = DEFAULT_MOCK_REPAIRS.find(
        (r) => String(r.id) === String(id) || String(r.id) === String(id).replace('sd-', '')
      ) || DEFAULT_MOCK_REPAIRS[0];
      setActiveRepair(fallback);
      return fallback;
    } finally {
      setLoadingActiveRepair(false);
    }
  }, []);

  const displayRepairs = repairs && repairs.length > 0 ? repairs : DEFAULT_MOCK_REPAIRS;

  return {
    repairs: displayRepairs,
    loading,
    error,
    refresh,
    createRepair,
    updateRepair,
    removeRepair,
    activeRepair,
    loadingActiveRepair,
    getRepairById,
  };
};
