import { type PageFragment } from "@/gql/graphql";
import { SITE_CONFIG } from "@/config/site";

// Sample blog posts — dùng khi Saleor chưa có page type "blog"
// Để dùng dữ liệu thật: tạo Page Type "Blog" trong Saleor admin,
// sau đó tạo Page với slug tương ứng. Code tự động ưu tiên dữ liệu từ API.

const makeContent = (blocks: object[]) => JSON.stringify({ time: Date.now(), blocks, version: "2.26.5" });

export type BlogTagColor = "info" | "destructive" | "success" | "warning";

export type BlogPostMeta = {
	coverUrl: string;
	tag: string;
	tagColor: BlogTagColor;
};

/** Metadata bổ sung cho mỗi bài viết — cover photo + category badge */
export const BLOG_META: Record<string, BlogPostMeta> = {
	"chon-size-giay-dung": {
		coverUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop",
		tag: "Hướng dẫn",
		tagColor: "info"
	},
	"xu-huong-sneaker-2025": {
		coverUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&q=80&auto=format&fit=crop",
		tag: "Xu hướng",
		tagColor: "destructive"
	},
	"bao-quan-giay-the-thao": {
		coverUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80&auto=format&fit=crop",
		tag: "Chăm sóc",
		tagColor: "success"
	}
};

/** Styles cho tag badge trên detail page (overlay on hero image) */
export const TAG_STYLES_DETAIL: Record<BlogTagColor, string> = {
	info: "bg-info/20 text-info border-info/40",
	destructive: "bg-destructive/20 text-destructive border-destructive/40",
	success: "bg-success/20 text-success border-success/40",
	warning: "bg-warning/20 text-warning-foreground border-warning/40"
};

export const SAMPLE_BLOG_POSTS: PageFragment[] = [
	{
		__typename: "Page",
		id: "sample-1",
		slug: "chon-size-giay-dung",
		title: "Cách chọn size giày đúng — hướng dẫn từ A đến Z",
		seoTitle: "Cách chọn size giày đúng",
		seoDescription:
			"Bạn thường xuyên chọn sai size giày? Bài viết này hướng dẫn cách đo chân, đổi size quốc tế và chọn giày vừa vặn nhất.",
		content: makeContent([
			{
				type: "paragraph",
				data: {
					text: "Chọn đúng size giày tưởng đơn giản nhưng lại là nguyên nhân hàng đầu khiến người mua phải đổi trả hoặc chịu đựng đau chân suốt ngày dài. Theo khảo sát của American Orthopaedic Foot & Ankle Society, gần <b>70% người trưởng thành</b> đang mang giày không đúng với kích thước thật của chân. Bài viết này sẽ cung cấp cho bạn tất cả công cụ cần thiết để không bao giờ chọn sai size nữa."
				}
			},
			{
				type: "header",
				data: { text: "Tại sao cần chú trọng kích thước giày?", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "Đi giày chật hay rộng đều gây ra hàng loạt vấn đề về sức khỏe: phồng rộp, chai chân, biến dạng ngón (bunion), đau gót và thậm chí ảnh hưởng lên cả đầu gối, hông, cột sống. Ngoài yếu tố sức khỏe, giày vừa chân còn giúp bạn tự tin hơn, di chuyển thoải mái và giữ form dáng giày lâu hơn."
				}
			},
			{
				type: "header",
				data: { text: "1. Cách đo chân tại nhà chính xác nhất", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "Chỉ cần 1 tờ giấy A4, 1 cây bút và thước kẻ là bạn có thể đo chuẩn như chuyên gia:"
				}
			},
			{
				type: "list",
				data: {
					style: "ordered",
					items: [
						"<b>Thời điểm đo:</b> Đo vào buổi chiều hoặc tối — lúc chân đã hoạt động và nở tự nhiên. Đo lúc sáng sớm có thể bị nhỏ hơn thực tế đến 0.5 size.",
						"<b>Chuẩn bị:</b> Mang vớ (loại vớ bạn thường đi với loại giày định mua). Đặt tờ giấy trên nền phẳng cứng, tránh thảm trải.",
						"<b>Đứng thẳng:</b> Đặt bàn chân lên giấy, trọng lượng dồn đều lên chân, không kiễng gót.",
						"<b>Vẽ viền:</b> Dùng bút vạch sát theo viền bàn chân — nghiêng bút 90° với mặt giấy để chuẩn nhất. Nhờ người khác giữ bút cho bạn.",
						"<b>Đo chiều dài:</b> Từ điểm xa nhất của gót đến đầu ngón dài nhất. Đây là số liệu quan trọng nhất.",
						"<b>Đo chiều rộng:</b> Chỗ rộng nhất của bàn chân (thường là vùng khớp ngón chân). Số liệu này xác định bạn có chân rộng hay không.",
						"<b>Đo cả hai chân</b> và lấy số liệu lớn hơn làm chuẩn — hai chân người thường không đều nhau."
					]
				}
			},
			{
				type: "header",
				data: { text: "2. Bảng quy đổi size quốc tế 2025", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "<b>Quy tắc nhanh:</b> Size EU = Chiều dài chân (cm) + 1.5 → làm tròn lên. Ví dụ: chân dài 25 cm → EU 26.5 → chọn EU 40 hoặc 41."
				}
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"22 cm → EU 35–36 | US W 5 | UK 3",
						"23 cm → EU 36–37 | US W 6 | UK 4",
						"24 cm → EU 38 | US W 7 | UK 5",
						"25 cm → EU 39–40 | US M 7 / W 8.5 | UK 6",
						"26 cm → EU 40–41 | US M 8 / W 9.5 | UK 7",
						"27 cm → EU 42–43 | US M 9.5 / W 11 | UK 8.5",
						"28 cm → EU 43–44 | US M 10.5 | UK 9.5",
						"29 cm → EU 44–45 | US M 11.5 | UK 10.5"
					]
				}
			},
			{
				type: "header",
				data: { text: "3. Khác biệt size theo từng thương hiệu", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "Một trong những lý do gây nhầm lẫn phổ biến nhất là mỗi hãng giày có <b>last (khuôn giày)</b> riêng, dẫn đến size thực tế khác nhau dù cùng ghi EU 42:"
				}
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>Nike:</b> Thường hơi nhỏ so với chuẩn, đặc biệt dòng Air Force 1 và Jordan. Nên lên 0.5 size nếu chân rộng.",
						"<b>Adidas:</b> Khá chuẩn theo EU. Dòng Ultra Boost có thể hơi rộng ở mũi giày.",
						"<b>New Balance:</b> Có nhiều lựa chọn bề rộng (D, 2E, 4E). Chân rộng nên ưu tiên thương hiệu này.",
						"<b>Converse:</b> Nổi tiếng là nhỏ hơn 1 size. Luôn lên 1 size khi mua Chuck Taylor.",
						"<b>Vans:</b> Size chuẩn nhưng hơi hẹp ở thân giày. Chân rộng nên lên 0.5.",
						"<b>Puma:</b> Tương tự Nike, nên lên 0.5 cho chân rộng trung bình."
					]
				}
			},
			{
				type: "header",
				data: { text: "4. Phân biệt chân rộng và chân hẹp", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "Chiều rộng bàn chân ảnh hưởng lớn đến sự thoải mái. Nếu chiều rộng chân của bạn vượt quá mức sau, bạn là người có chân rộng và cần lưu ý khi chọn giày:"
				}
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"Size 38 EU: >9.2 cm là chân rộng",
						"Size 40 EU: >9.6 cm là chân rộng",
						"Size 42 EU: >10.0 cm là chân rộng",
						"Size 44 EU: >10.4 cm là chân rộng"
					]
				}
			},
			{
				type: "header",
				data: { text: "5. Mẹo thực tế khi mua giày online", level: 2 }
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						`Luôn đọc phần <b>"Hướng dẫn chọn size"</b> của từng sản phẩm — ${SITE_CONFIG.name} ghi rõ giày có bị nhỏ hay đúng size.`,
						"Xem phần <b>đánh giá của khách hàng</b> — họ thường phản ánh chân thực nhất về size thực tế.",
						"Nếu bạn đang ở ranh giới giữa hai size, hãy chọn size lớn hơn với giày thể thao, size nhỏ hơn với giày da (vì da giãn theo thời gian).",
						'Dùng tính năng <b>"Thử giày ảo"</b> (AR Try-On) nếu ứng dụng hỗ trợ.',
						"Mua vào <b>cuối ngày</b> nếu thử trực tiếp tại cửa hàng."
					]
				}
			},
			{
				type: "header",
				data: { text: "6. Những sai lầm thường gặp cần tránh", level: 2 }
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"❌ Tin tưởng tuyệt đối vào size cũ — chân người trưởng thành vẫn có thể thay đổi theo thời gian.",
						'❌ Mua giày chật với suy nghĩ "sẽ giãn ra" — giày vải/tổng hợp gần như không giãn, chỉ giày da mới giãn nhẹ.',
						"❌ Bỏ qua chiều rộng, chỉ quan tâm chiều dài.",
						"❌ Không mang vớ khi thử giày thể thao.",
						"❌ Thử giày khi đứng nhưng không đi thử vài bước — cảm giác đứng và đi hoàn toàn khác nhau."
					]
				}
			},
			{
				type: "paragraph",
				data: {
					text: `Hy vọng bài viết đã giúp bạn hiểu rõ hơn về cách chọn size giày phù hợp. Nếu vẫn còn phân vân, đội ngũ tư vấn của <b>${SITE_CONFIG.name}</b> luôn sẵn sàng hỗ trợ bạn qua chat trực tuyến hoặc hotline — hoàn toàn miễn phí!`
				}
			}
		]),
		attributes: []
	},
	{
		__typename: "Page",
		id: "sample-2",
		slug: "xu-huong-sneaker-2025",
		title: "Xu hướng sneaker 2025 — những đôi bạn không thể bỏ lỡ",
		seoTitle: "Xu hướng sneaker 2025",
		seoDescription:
			"Từ chunky sole đến minimalist, cùng điểm qua những xu hướng sneaker đang làm mưa làm gió trong năm 2025.",
		content: makeContent([
			{
				type: "paragraph",
				data: {
					text: "Thị trường sneaker 2025 chứng kiến sự bùng nổ chưa từng có: doanh số toàn cầu vượt mốc <b>115 tỷ USD</b>, theo báo cáo của Grand View Research. Không còn là câu chuyện đơn thuần của giới trẻ yêu thể thao, sneaker đã trở thành ngôn ngữ thời trang của mọi lứa tuổi. Dưới đây là toàn cảnh xu hướng bạn cần biết trong năm nay."
				}
			},
			{
				type: "header",
				data: { text: '1. Chunky Sole — đế bánh mì vẫn "ngự trị"', level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "Bắt đầu tạo sóng từ 2018–2019 với Balenciaga Triple S, xu hướng chunky sole không những không hạ nhiệt mà còn tiến hóa mạnh hơn vào 2025. Các mẫu đang dẫn đầu:"
				}
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>New Balance 9060:</b> Đế chunky tiệm cận sneaker kỹ thuật, bảng màu earth tone (nâu, xám, kem) cực dễ phối. Giá: 3.500.000đ – 4.200.000đ.",
						"<b>Asics Gel-Kayano 14:</b> Comeback mạnh nhờ lớp GEL ở đế sau iconic, được giới streetwear Nhật và Hàn Quốc đặc biệt ưa chuộng. Giá: 3.200.000đ – 3.800.000đ.",
						"<b>Salomon XT-6:</b> Giao thoa giữa trail running và streetwear — lựa chọn của những ai muốn khác biệt. Giá: 4.500.000đ – 5.500.000đ.",
						"<b>Nike Air Max Dn:</b> Hệ thống đệm Dynamic Air kép, vừa tech vừa street. Giá: 3.800.000đ – 4.500.000đ."
					]
				}
			},
			{
				type: "header",
				data: { text: "2. Minimalist Terrace — sạch, gọn, không lỗi thời", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "Đi ngược lại chunky là trào lưu <b>terrace sneaker</b> — những đôi giày dáng thấp, đế mỏng, thiết kế tối giản lấy cảm hứng từ văn hoá sân vận động châu Âu thập niên 80. Điểm cộng lớn nhất: phối được với mọi outfit từ streetwear đến business casual."
				}
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						'<b>Adidas Samba OG:</b> Vẫn là "vua" của danh mục này. 3 sọc classic, đế gum vàng đặc trưng. Giá: 2.800.000đ – 3.200.000đ.',
						"<b>Adidas Gazelle Bold:</b> Phiên bản platform của Gazelle, cao thêm 4cm nhưng vẫn giữ được vẻ clean. Thiên về nữ giới. Giá: 2.600.000đ.",
						"<b>Nike Cortez:</b> Mẫu đầu tiên của Nike tái xuất đúng lúc. Form đế thấp, phần upper leather trắng cổ điển. Giá: 2.200.000đ.",
						"<b>Puma Palermo:</b> Ứng cử viên sáng giá nhất 2025, giá mềm, thiết kế retro Italy. Giá: 1.800.000đ – 2.200.000đ."
					]
				}
			},
			{
				type: "header",
				data: { text: "3. Running Tech — giày chạy ra phố", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: '2025 đánh dấu năm running sneaker chính thức "chiếm lĩnh" phố đi bộ. Không chỉ mặc tập gym, người trẻ đang phối giày running cùng quần baggy, áo oversized và thậm chí cả váy dài. Các mẫu nổi bật:'
				}
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>On Cloudmonster 2:</b> Đế CloudTec phồng đặc trưng, cực nhẹ. Phân khúc Premium. Giá: 5.500.000đ.",
						"<b>Hoka Clifton 9:</b> Đế Meta-Rocker siêu êm. Màu sắc đa dạng và tươi. Giá: 4.200.000đ.",
						"<b>Adidas Ultraboost 5:</b> Áo Primeknit ôm chân, đế Boost bền bỉ. Phối streetwear rất tốt. Giá: 4.500.000đ.",
						"<b>New Balance Fresh Foam X 1080v13:</b> Đỉnh cao về êm ái, màu sắc 2025 rất bắt mắt. Giá: 4.800.000đ."
					]
				}
			},
			{
				type: "header",
				data: { text: "4. Collaboration Limited — sở hữu không phải ai cũng có", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "Những collaboration đình đám 2025 đang khuấy đảo cộng đồng sneakerhead Việt Nam:"
				}
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>Nike x Jacquemus Air Humara:</b> Thiết kế Pháp gặp công nghệ Nike — bộ ba màu pastel cực lạ. Resell: 8–12 triệu.",
						"<b>New Balance x Aime Leon Dore 990v6:</b> Collab quen thuộc nhưng mỗi drop đều sold-out trong vài phút. Resell: 6–9 triệu.",
						"<b>Adidas x Wales Bonner Samba:</b> Spazzolato leather cao cấp, tinh tế. Resell: 5–7 triệu."
					]
				}
			},
			{
				type: "header",
				data: { text: "5. Cách phối đồ với sneaker 2025", level: 2 }
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>Chunky + wide-leg:</b> Quần ống rộng hoặc baggy jeans + chunky sneaker tạo silhouette cân đối.",
						"<b>Terrace + trousers:</b> Quần âu tapered, áo OCBD (Oxford) tucked-in + Samba = outfit business casual hoàn hảo.",
						"<b>Running + athleisure:</b> Shorts kỹ thuật hoặc leggings + áo bomber nhẹ + Hoka/On.",
						"<b>Monochrome:</b> Matching toàn bộ outfit cùng màu với sneaker đang là trend mạnh nhất IG 2025."
					]
				}
			},
			{
				type: "paragraph",
				data: {
					text: `<b>Lời khuyên từ ${SITE_CONFIG.name}:</b> Đừng chạy theo hype bằng mọi giá. Hãy chọn đôi sneaker phù hợp với style cá nhân, vừa chân và nằm trong ngân sách. Một đôi giày đúng lúc còn hơn mười đôi theo trend. Khám phá bộ sưu tập sneaker mới nhất tại cửa hàng của chúng tôi!`
				}
			}
		]),
		attributes: []
	},
	{
		__typename: "Page",
		id: "sample-3",
		slug: "bao-quan-giay-the-thao",
		title: "Bảo quản giày thể thao — giữ giày mới như ngày đầu",
		seoTitle: "Bảo quản giày thể thao đúng cách",
		seoDescription:
			"Những tips đơn giản giúp đôi giày thể thao của bạn luôn sạch sẽ, thơm tho và bền lâu hơn.",
		content: makeContent([
			{
				type: "paragraph",
				data: {
					text: "Bạn vừa bỏ ra 3–5 triệu đồng cho đôi sneaker ưng ý. Sau 3 tháng, nó đã ố vàng, bong đế, mùi khó chịu và bạn phải chi tiếp một khoản tương tự. Đây là câu chuyện của hàng triệu người — và hoàn toàn có thể tránh được nếu biết cách chăm sóc đúng. Bài hướng dẫn này sẽ giúp đôi giày của bạn <b>trường thọ gấp 2–3 lần</b> so với thông thường."
				}
			},
			{
				type: "header",
				data: { text: "1. Chăm sóc hàng ngày — thói quen nhỏ, lợi ích lớn", level: 2 }
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>Xịt chống thấm (water repellent) trước lần đầu đi:</b> Đây là bước quan trọng nhất mà 90% người dùng bỏ qua. Xịt đều lên toàn bộ bề mặt giày trước khi ra đường lần đầu — bảo vệ khỏi nước và vết bẩn từ sớm.",
						"<b>Tháo giày đúng cách:</b> Luôn mở dây trước khi tháo — kéo phần gót ra khi còn buộc làm yếu cấu trúc giày theo thời gian.",
						"<b>Thay đổi luân phiên:</b> Không nên đi một đôi liên tục 2 ngày. Để giày nghỉ 24h giúp lớp lót (insole) phục hồi đàn hồi và khử mùi tự nhiên.",
						"<b>Dùng shoe horn (dụng cụ xỏ giày):</b> Đặc biệt quan trọng với giày da và sneaker cổ cao — giữ form hậu (heel counter) không bị bẹp."
					]
				}
			},
			{
				type: "header",
				data: { text: "2. Quy trình vệ sinh đúng cách theo chất liệu", level: 2 }
			},
			{
				type: "paragraph",
				data: { text: "<b>A. Giày vải (canvas) — như Converse, Vans Authentic:</b>" }
			},
			{
				type: "list",
				data: {
					style: "ordered",
					items: [
						"Tháo dây, giặt dây riêng bằng máy giặt (bỏ vào túi giặt đồ lót).",
						"Dùng bàn chải mềm + hỗn hợp nước ấm:baking soda:xà phòng (2:1:1) chà nhẹ.",
						"Rửa lại bằng vải ẩm sạch, lau khô.",
						"Nhét giấy báo vào trong để giữ form khi phơi.",
						"Phơi nơi thoáng mát, <b>tuyệt đối không phơi dưới nắng trực tiếp</b> — canvas ngả vàng và keo bị tan."
					]
				}
			},
			{
				type: "paragraph",
				data: { text: "<b>B. Giày mesh/knit — như Nike Flyknit, Adidas Primeknit, Ultraboost:</b>" }
			},
			{
				type: "list",
				data: {
					style: "ordered",
					items: [
						"Dùng bàn chải lông mềm mịn (laundry brush), tuyệt đối không dùng bàn chải cứng — làm xù sợi vải.",
						"Chỉ dùng nước lạnh hoặc ấm, không dùng nước nóng — shrink vải.",
						"Lau bằng khăn microfiber thấm nước — không vò, không xoắn.",
						"Dùng quạt hoặc máy hút ẩm để sấy — không dùng máy sấy tóc quá gần."
					]
				}
			},
			{
				type: "paragraph",
				data: {
					text: "<b>C. Giày da (leather/suede sneaker) — như Adidas Samba, Nike Air Force 1 leather:</b>"
				}
			},
			{
				type: "list",
				data: {
					style: "ordered",
					items: [
						"Leather: dùng kem đánh giày hoặc saddle soap, lau bằng vải cotton mềm theo hình tròn.",
						"Suede/nubuck: <b>chỉ dùng brush suede chuyên dụng</b> — chà theo chiều lông. Không dùng nước.",
						"Để loại bỏ vết cứng đầu trên suede: dùng tẩy (eraser) suede chuyên dụng.",
						"Sau khi vệ sinh leather, bôi mỏng conditioning cream để giữ da không bị nứt."
					]
				}
			},
			{
				type: "header",
				data: { text: "3. Vệ sinh đế giày", level: 2 }
			},
			{
				type: "paragraph",
				data: {
					text: "Đế giắm trắng (white midsole) là thứ dễ ố vàng nhất và khó xử lý nhất. Công thức hiệu quả nhất được giới sneakerhead Việt Nam kiểm chứng:"
				}
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>Baking soda + giấm trắng:</b> Tạo thành paste, dùng bàn chải chà lên đế trắng, để 10 phút, rửa sạch. Hiệu quả với vết bẩn thông thường.",
						"<b>Kem đánh răng trắng:</b> Chà trực tiếp lên đế bằng bàn chải đánh răng cũ. Kinh tế và hiệu quả bất ngờ.",
						"<b>Mr. Clean Magic Eraser:</b> Tẩy rất mạnh, dùng được ngay — không cần hóa chất thêm.",
						`<b>Sneaker shield + Angel đế:</b> Sản phẩm chuyên dụng bán tại ${SITE_CONFIG.name}, ngăn ố vàng hiệu quả nhất.`
					]
				}
			},
			{
				type: "header",
				data: { text: "4. Bảo quản và lưu trữ lâu dài", level: 2 }
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>Nhét shoe tree (cây giày):</b> Tốt hơn giấy báo vì giữ được form 3D, kiểm soát độ ẩm và khử mùi (nếu dùng loại cedar).",
						"<b>Silica gel:</b> Bỏ 2–3 gói vào hộp giày giúp hút ẩm, ngăn nấm mốc và ố vàng đế.",
						"<b>Hộp trong suốt có nắp:</b> Hơn hộp giày carton — tránh bụi, thấy được ngay từng đôi, không làm ố vàng đế do hóa chất từ carton.",
						"<b>Nhiệt độ và độ ẩm:</b> Lý tưởng là 15–20°C, độ ẩm dưới 60%. Không cất giày trong tủ quần áo ẩm hay dưới gầm giường sát tường.",
						'<b>Giày hạn chế mang:</b> Với những đôi collector cần cất lâu, cứ 3–6 tháng lấy ra "flex" 1 lần để đế không bị oxidize và cứng nứt.'
					]
				}
			},
			{
				type: "header",
				data: { text: "5. Khử mùi giày hiệu quả", level: 2 }
			},
			{
				type: "list",
				data: {
					style: "unordered",
					items: [
						"<b>Baking soda:</b> Rắc vào giày, để qua đêm, đổ ra sáng hôm sau. Hoàn toàn an toàn, rẻ, hiệu quả tốt.",
						"<b>Insole kháng khuẩn:</b> Thay lớp lót thông thường bằng insole có than hoạt tính hoặc bạc kháng khuẩn.",
						"<b>Miếng thơm cedar:</b> Bỏ vào trong giày khi cất — vừa thơm, vừa hút ẩm, vừa giữ form.",
						"<b>Máy khử khuẩn UV:</b> Tốn kém hơn nhưng diệt khuẩn 99.9% — phù hợp với người có nhu cầu cao."
					]
				}
			},
			{
				type: "paragraph",
				data: {
					text: `Áp dụng đúng những bước trên, đôi giày của bạn có thể giữ được vẻ đẹp trong 3–5 năm thay vì chỉ 6–12 tháng. Đầu tư vào việc chăm sóc giày chính là đầu tư tiết kiệm nhất bạn có thể làm. Ghé <b>${SITE_CONFIG.name}</b> để tìm đầy đủ bộ sản phẩm chăm sóc giày chính hãng nhé!`
				}
			}
		]),
		attributes: []
	}
];
