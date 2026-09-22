import React, { useState } from 'react';
import { ArrowRight, HeartHandshake, MessageCircle, PackageCheck, ShieldCheck, Truck } from 'lucide-react';

const pageContent = {
  about: {
    eyebrow: 'Về TCT',
    title: 'Những món đồ nhỏ, sự chăm sóc thật lớn.',
    intro: 'TCT đồng hành cùng cha mẹ trong những lựa chọn hằng ngày cho bé: dễ mặc, dễ dùng, rõ nguồn gốc và được tuyển chọn với sự chăm chút.',
  },
  services: {
    eyebrow: 'Dịch vụ TCT',
    title: 'Mua sắm nhẹ nhàng hơn cho cả gia đình.',
    intro: 'Từ lúc tìm sản phẩm đến khi nhận hàng, TCT tập trung vào những hỗ trợ thiết thực để cha mẹ luôn biết mình đang ở đâu trong hành trình mua sắm.',
  },
  contact: {
    eyebrow: 'Liên hệ TCT',
    title: 'Chúng tôi sẵn sàng lắng nghe.',
    intro: 'Hãy gửi câu hỏi về sản phẩm, size hoặc đơn hàng. Đội ngũ TCT sẽ phản hồi qua thông tin bạn để lại.',
  },
};

const serviceItems = [
  { icon: ShieldCheck, title: 'Thông tin rõ ràng', text: 'Mô tả, chất liệu và hướng dẫn sử dụng được trình bày để cha mẹ dễ cân nhắc.' },
  { icon: Truck, title: 'Giao hàng thuận tiện', text: 'Đơn hàng được xử lý theo thông tin giao nhận cha mẹ cung cấp trong checkout.' },
  { icon: PackageCheck, title: 'Hỗ trợ sau mua', text: 'Liên hệ TCT khi cần hỏi về đơn hàng hoặc cần tư vấn thêm về sản phẩm.' },
];

export default function InformationPages({ type, onNavigate }) {
  const content = pageContent[type];
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="info-page">
      <section className="info-hero container">
        <div className="info-hero-copy">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
          {type !== 'contact' && <button className="btn btn-primary btn-lg" onClick={() => onNavigate('products')}>Khám phá sản phẩm <ArrowRight size={18} /></button>}
        </div>
        <div className="info-hero-mark"><HeartHandshake size={68} /></div>
      </section>

      {type === 'about' && (
        <section className="info-section container">
          <div className="info-copy-block"><span className="eyebrow">Điều TCT theo đuổi</span><h2>Đẹp cho bé, an tâm cho người chọn.</h2><p>Chúng tôi tin một trải nghiệm mua sắm tốt bắt đầu từ những điều rất cụ thể: sản phẩm phù hợp với nhu cầu, hình ảnh chân thực và thông tin đủ rõ để cha mẹ tự tin quyết định.</p></div>
          <div className="value-grid">{['Ấm áp', 'Minh bạch', 'Thiết thực'].map((value) => <div className="value-item" key={value}><HeartHandshake size={22} /><h3>{value}</h3><p>Mỗi điểm chạm đều được thiết kế để gia đình sử dụng dễ dàng hơn.</p></div>)}</div>
        </section>
      )}

      {type === 'services' && <section className="info-section container"><div className="service-grid">{serviceItems.map(({ icon: Icon, title, text }) => <article className="service-item" key={title}><Icon size={26} /><h2>{title}</h2><p>{text}</p></article>)}</div></section>}

      {type === 'contact' && <section className="info-section container contact-layout"><div className="contact-details"><span className="eyebrow">Hỗ trợ khách hàng</span><h2>Gửi điều bạn đang cần biết</h2><p>Thông tin liên hệ cụ thể của TCT sẽ được cập nhật khi cửa hàng hoàn thiện kênh hỗ trợ chính thức.</p><div className="contact-placeholder"><MessageCircle size={22} /><span>Vui lòng để lại lời nhắn qua biểu mẫu, chúng tôi sẽ phản hồi sớm.</span></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label>Họ và tên<input required placeholder="Tên của bạn" /></label><label>Email hoặc số điện thoại<input required placeholder="Cách TCT có thể liên hệ" /></label><label>Nội dung<textarea required rows="5" placeholder="Bạn muốn hỏi điều gì?" /></label>{submitted && <p className="form-success">Đã ghi nhận lời nhắn. Cảm ơn bạn đã liên hệ TCT.</p>}<button className="btn btn-primary btn-lg" type="submit">Gửi lời nhắn <ArrowRight size={18} /></button></form></section>}
    </div>
  );
}
