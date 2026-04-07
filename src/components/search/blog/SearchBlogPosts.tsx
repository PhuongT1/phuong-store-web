"use client";

import { BookOpen, CalendarDays, Clock } from "lucide-react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { LinkWithChannel } from "@components/navigation";
import { blogPosts } from "../data/searchData";
import "@assets/styles/_swiper.scss";

const SearchBlogPosts = () => (
	<section className="py-12">
		<div className="mb-8 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<div className="bg-badge-trending-muted flex h-12 w-12 items-center justify-center rounded-xl">
					<BookOpen className="text-badge-trending h-6 w-6" />
				</div>
				<div>
					<h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
						Tin tức &amp; Xu hướng
					</h2>
					<p className="text-muted-foreground mt-1 text-sm">
						Cập nhật mới nhất từ thế giới thể thao &amp; thời trang
					</p>
				</div>
			</div>
			<LinkWithChannel
				href="/blog"
				className="text-info hover:text-info/80 hidden text-sm font-semibold transition-colors sm:block"
			>
				Xem tất cả →
			</LinkWithChannel>
		</div>

		<Swiper
			modules={[Autoplay]}
			autoplay={{ delay: 6000, disableOnInteraction: false }}
			spaceBetween={16}
			slidesPerView={1.2}
			breakpoints={{
				640: { slidesPerView: 2.2, spaceBetween: 16 },
				1024: { slidesPerView: 3.2, spaceBetween: 20 },
				1280: { slidesPerView: 4, spaceBetween: 20 }
			}}
			className="-my-2 overflow-visible py-2"
		>
			{blogPosts.map((post) => (
				<SwiperSlide key={post.id}>
					<LinkWithChannel href={post.href} className="group block h-full">
						<article className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200 will-change-transform hover:-translate-y-1 hover:shadow-md">
							{/* Gradient cover */}
							<div
								className="relative h-44 shrink-0 overflow-hidden"
								style={{
									background: `linear-gradient(135deg, var(--hero-${post.colorScheme}-from), var(--hero-${post.colorScheme}-to))`
								}}
							>
								{/* Subtle noise texture overlay */}
								<div className="absolute inset-0 bg-black/15" />
								<span className="absolute bottom-3 left-3 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
									{post.category}
								</span>
							</div>

							{/* Content */}
							<div className="flex flex-1 flex-col p-4">
								<h3 className="text-foreground group-hover:text-nav-active line-clamp-2 text-sm leading-snug font-semibold transition-colors">
									{post.title}
								</h3>
								<p className="text-muted-foreground mt-2 line-clamp-2 flex-1 text-xs leading-relaxed">
									{post.excerpt}
								</p>
								<div className="text-muted-foreground/70 mt-3 flex items-center gap-3 text-xs">
									<span className="flex items-center gap-1">
										<CalendarDays size={11} />
										{post.date}
									</span>
									<span className="bg-muted-foreground/40 h-0.5 w-0.5 rounded-full" />
									<span className="flex items-center gap-1">
										<Clock size={11} />
										{post.readTime}
									</span>
								</div>
							</div>
						</article>
					</LinkWithChannel>
				</SwiperSlide>
			))}
		</Swiper>
	</section>
);

SearchBlogPosts.displayName = "SearchBlogPosts";
export { SearchBlogPosts };
