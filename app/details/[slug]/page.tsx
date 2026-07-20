import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { detailBySlug, details } from "../data";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return details.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = detailBySlug.get(slug);

  if (!detail) {
    return { title: "内容未找到 | 周学聪" };
  }

  return {
    title: `${detail.title} | 周学聪`,
    description: detail.summary,
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const detail = detailBySlug.get(slug);

  if (!detail) {
    notFound();
  }

  const detailIndex = details.findIndex((item) => item.slug === detail.slug);
  const previous = details[(detailIndex - 1 + details.length) % details.length];
  const next = details[(detailIndex + 1) % details.length];

  return (
    <main className={`detail-page detail-accent-${detail.accent}`}>
      <header className="detail-header">
        <Link className="detail-brand" href="/" aria-label="返回周学聪个人网站首页">
          <span>XZ</span>
          <strong>周学聪</strong>
        </Link>
        <Link className="detail-back" href="/">
          <span aria-hidden="true">←</span>
          返回首页
        </Link>
      </header>

      <section className="detail-hero" aria-labelledby="detail-title">
        <div className="detail-orbit" aria-hidden="true">
          <span>{detail.number}</span>
        </div>
        <p className="detail-eyebrow">
          {detail.number} / {detail.category}
        </p>
        <h1 id="detail-title">{detail.title}</h1>
        <p className="detail-summary">{detail.summary}</p>
        <dl className="detail-meta">
          <div>
            <dt>单位 / 课程</dt>
            <dd>{detail.subtitle}</dd>
          </div>
          <div>
            <dt>时间</dt>
            <dd>{detail.period}</dd>
          </div>
          <div>
            <dt>地点</dt>
            <dd>{detail.location}</dd>
          </div>
        </dl>
      </section>

      <div className="detail-ticker" aria-hidden="true">
        <div>
          {[...detail.tags, ...detail.tags].map((tag, index) => (
            <span key={`${tag}-${index}`}>{tag}</span>
          ))}
        </div>
      </div>

      <section className="detail-content" aria-label={`${detail.title}详细信息`}>
        <aside className="detail-aside">
          <p>简历详情</p>
          <strong>{String(detail.sections.length).padStart(2, "0")}</strong>
          <span>个内容部分</span>
        </aside>

        <div className="detail-sections">
          {detail.sections.map((section, sectionIndex) => (
            <article className="detail-section" key={section.title}>
              <span className="detail-section-number">
                {String(sectionIndex + 1).padStart(2, "0")}
              </span>
              <div>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {detail.links?.length ? (
        <section className="detail-links" aria-labelledby="detail-links-title">
          <div>
            <p>简历中的超链接</p>
            <h2 id="detail-links-title">相关链接</h2>
          </div>
          <div className="detail-link-list">
            {detail.links.map((link) => (
              <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                <span>
                  <strong>{link.label}</strong>
                  <small>{link.description}</small>
                </span>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="detail-pagination" aria-label="浏览其他项目和经历">
        <Link href={`/details/${previous.slug}`}>
          <span>← 上一个</span>
          <strong>{previous.title}</strong>
        </Link>
        <Link href={`/details/${next.slug}`}>
          <span>下一个 →</span>
          <strong>{next.title}</strong>
        </Link>
      </nav>

      <footer className="detail-footer">
        <span>© {new Date().getFullYear()} Xuecong Zhou</span>
        <a href="mailto:xzhou455@gatech.edu">xzhou455@gatech.edu</a>
      </footer>
    </main>
  );
}
