"use client";

import { useRef, useState } from "react";
import type { DetailMediaGroup, DetailMediaItem, DetailMediaVideo } from "./data";

type MediaPreviewProps = {
  groups: DetailMediaGroup[];
};

const getPageSource = (item: DetailMediaItem, page: number) =>
  `${item.assetBase}/${item.assetPrefix}-${String(page).padStart(2, "0")}.webp`;

function ProtectedVideo({ video }: { video: DetailMediaVideo }) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const startPlayback = async () => {
    const player = playerRef.current;
    if (!player) return;

    try {
      setHasError(false);
      if (player.readyState === 0) player.load();
      await player.play();
    } catch {
      setHasError(true);
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={`detail-video-frame${isPlaying ? " is-playing" : ""}${hasError ? " has-error" : ""}`}
    >
      <video
        ref={playerRef}
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(event) => event.preventDefault()}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
        onLoadedData={() => setHasError(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => {
          setHasError(false);
          setIsPlaying(true);
        }}
        playsInline
        poster={video.poster}
        preload="auto"
      >
        <source src={video.source} type="video/mp4" />
      </video>
      <button
        className="detail-video-play"
        type="button"
        onClick={startPlayback}
        aria-label={hasError ? "视频加载失败，点击重试" : `播放${video.title}`}
        title={hasError ? "视频加载失败，点击重试" : "播放视频"}
      >
        <span aria-hidden="true">▶</span>
      </button>
      <span className="detail-video-error" role="status" aria-live="polite">
        {hasError ? "视频加载失败，请刷新页面后重试。" : ""}
      </span>
    </div>
  );
}

function MediaGroupPreview({ group }: { group: DetailMediaGroup }) {
  const initialItem = Math.min(
    Math.max(group.defaultItemIndex ?? 0, 0),
    group.items.length - 1,
  );
  const [activeItemIndex, setActiveItemIndex] = useState(initialItem);
  const [page, setPage] = useState(1);
  const viewerRef = useRef<HTMLDivElement>(null);
  const item = group.items[activeItemIndex];
  const currentSource = getPageSource(item, page);

  const selectItem = (index: number) => {
    setActiveItemIndex(index);
    setPage(1);
  };

  const movePage = (amount: number) => {
    setPage((current) => Math.min(Math.max(current + amount, 1), item.pageCount));
  };

  const openFullscreen = async () => {
    if (viewerRef.current?.requestFullscreen) {
      await viewerRef.current.requestFullscreen();
    }
  };

  return (
    <section className="detail-media-band" aria-labelledby={`${item.id}-group-title`}>
      <div className="detail-media-intro">
        <p>{group.eyebrow}</p>
        <h2 id={`${item.id}-group-title`}>{group.title}</h2>
        <span>{group.description}</span>
      </div>

      <div className="detail-media-tool">
        <div className="detail-media-tabs" role="tablist" aria-label="选择在线预览资料">
          {group.items.map((mediaItem, index) => (
            <button
              className={index === activeItemIndex ? "is-active" : undefined}
              key={mediaItem.id}
              onClick={() => selectItem(index)}
              role="tab"
              aria-selected={index === activeItemIndex}
              type="button"
            >
              <span>{mediaItem.kind}</span>
              <strong>{mediaItem.title}</strong>
              <small>{mediaItem.pageCount} 页</small>
            </button>
          ))}
        </div>

        {item.videos?.length ? (
          <div className="detail-video-grid" aria-label={`${item.title}中的视频`}>
            {item.videos.map((video, index) => (
              <article
                className={index === 0 ? "detail-video detail-video-featured" : "detail-video"}
                key={video.source}
              >
                <ProtectedVideo video={video} />
                <div>
                  <span>第 {video.slide} 页视频</span>
                  <strong>{video.title}</strong>
                  <small>{video.duration}</small>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        <div
          className="detail-document-viewer"
          ref={viewerRef}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") movePage(-1);
            if (event.key === "ArrowRight") movePage(1);
          }}
        >
          <div className="detail-viewer-toolbar">
            <div>
              <span>{item.kind}</span>
              <strong>{item.title}</strong>
            </div>
            <div className="detail-viewer-actions">
              <button
                type="button"
                onClick={() => movePage(-1)}
                disabled={page === 1}
                aria-label="上一页"
                title="上一页"
              >
                ←
              </button>
              <output aria-live="polite">
                {String(page).padStart(2, "0")} / {String(item.pageCount).padStart(2, "0")}
              </output>
              <button
                type="button"
                onClick={() => movePage(1)}
                disabled={page === item.pageCount}
                aria-label="下一页"
                title="下一页"
              >
                →
              </button>
              <button
                type="button"
                onClick={openFullscreen}
                aria-label="全屏预览"
                title="全屏预览"
              >
                ⛶
              </button>
            </div>
          </div>

          <div className="detail-page-stage" onContextMenu={(event) => event.preventDefault()}>
            <img
              alt={`${item.title}，第 ${page} 页`}
              draggable={false}
              key={currentSource}
              src={currentSource}
            />
          </div>

          <div className="detail-thumbnail-strip" aria-label="选择预览页">
            {Array.from({ length: item.pageCount }, (_, index) => {
              const thumbnailPage = index + 1;
              return (
                <button
                  className={thumbnailPage === page ? "is-active" : undefined}
                  key={thumbnailPage}
                  onClick={() => setPage(thumbnailPage)}
                  type="button"
                  aria-label={`查看第 ${thumbnailPage} 页`}
                  aria-current={thumbnailPage === page ? "page" : undefined}
                >
                  <img
                    alt=""
                    draggable={false}
                    loading="lazy"
                    src={getPageSource(item, thumbnailPage)}
                  />
                  <span>{String(thumbnailPage).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MediaPreview({ groups }: MediaPreviewProps) {
  return (
    <>
      {groups.map((group) => (
        <MediaGroupPreview group={group} key={`${group.eyebrow}-${group.title}`} />
      ))}
    </>
  );
}
