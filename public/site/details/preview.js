(() => {
  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const pageSource = (item, page) =>
    `${item.assetBase}/${item.assetPrefix}-${String(page).padStart(2, "0")}.webp`;

  document.querySelectorAll("[data-media-preview]").forEach((root, groupIndex) => {
    const group = JSON.parse(root.dataset.mediaPreview);
    let activeItemIndex = Math.min(
      Math.max(Number(group.defaultItemIndex ?? 0), 0),
      group.items.length - 1,
    );
    let page = 1;

    const intro = create("div", "detail-media-intro");
    const eyebrow = create("p", "", group.eyebrow);
    const heading = create("h2", "", group.title);
    heading.id = `static-media-group-${groupIndex}`;
    const description = create("span", "", group.description);
    intro.append(eyebrow, heading, description);
    root.setAttribute("aria-labelledby", heading.id);

    const tool = create("div", "detail-media-tool");
    root.append(intro, tool);

    const buildTool = () => {
      const item = group.items[activeItemIndex];
      page = 1;
      tool.replaceChildren();

      const tabs = create("div", "detail-media-tabs");
      tabs.setAttribute("role", "tablist");
      tabs.setAttribute("aria-label", "选择在线预览资料");

      group.items.forEach((mediaItem, index) => {
        const button = create("button", index === activeItemIndex ? "is-active" : "");
        button.type = "button";
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(index === activeItemIndex));
        button.append(
          create("span", "", mediaItem.kind),
          create("strong", "", mediaItem.title),
          create("small", "", `${mediaItem.pageCount} 页`),
        );
        button.addEventListener("click", () => {
          activeItemIndex = index;
          buildTool();
        });
        tabs.append(button);
      });
      tool.append(tabs);

      if (item.videos?.length) {
        const videoGrid = create("div", "detail-video-grid");
        videoGrid.setAttribute("aria-label", `${item.title}中的视频`);

        item.videos.forEach((video, index) => {
          const article = create(
            "article",
            index === 0 ? "detail-video detail-video-featured" : "detail-video",
          );
          const frame = create("div", "detail-video-frame");
          const player = document.createElement("video");
          player.controls = true;
          player.playsInline = true;
          player.preload = "metadata";
          player.poster = video.poster;
          player.disablePictureInPicture = true;
          player.setAttribute("controlsList", "nodownload noremoteplayback");
          player.addEventListener("contextmenu", (event) => event.preventDefault());
          const source = document.createElement("source");
          source.src = video.source;
          source.type = "video/mp4";
          player.append(source);
          frame.append(player);

          const copy = create("div");
          copy.append(
            create("span", "", `第 ${video.slide} 页视频`),
            create("strong", "", video.title),
            create("small", "", video.duration),
          );
          article.append(frame, copy);
          videoGrid.append(article);
        });
        tool.append(videoGrid);
      }

      const viewer = create("div", "detail-document-viewer");
      viewer.tabIndex = 0;
      const toolbar = create("div", "detail-viewer-toolbar");
      const title = create("div");
      title.append(create("span", "", item.kind), create("strong", "", item.title));
      const actions = create("div", "detail-viewer-actions");
      const previous = create("button", "", "←");
      previous.type = "button";
      previous.title = "上一页";
      previous.setAttribute("aria-label", "上一页");
      const counter = create("output");
      counter.setAttribute("aria-live", "polite");
      const next = create("button", "", "→");
      next.type = "button";
      next.title = "下一页";
      next.setAttribute("aria-label", "下一页");
      const fullscreen = create("button", "", "⛶");
      fullscreen.type = "button";
      fullscreen.title = "全屏预览";
      fullscreen.setAttribute("aria-label", "全屏预览");
      actions.append(previous, counter, next, fullscreen);
      toolbar.append(title, actions);

      const stage = create("div", "detail-page-stage");
      const mainImage = document.createElement("img");
      mainImage.draggable = false;
      mainImage.addEventListener("contextmenu", (event) => event.preventDefault());
      stage.append(mainImage);

      const thumbnails = create("div", "detail-thumbnail-strip");
      thumbnails.setAttribute("aria-label", "选择预览页");
      const thumbnailButtons = [];

      for (let index = 1; index <= item.pageCount; index += 1) {
        const button = create("button");
        button.type = "button";
        button.setAttribute("aria-label", `查看第 ${index} 页`);
        const image = document.createElement("img");
        image.alt = "";
        image.draggable = false;
        image.loading = "lazy";
        image.src = pageSource(item, index);
        button.append(image, create("span", "", String(index).padStart(2, "0")));
        button.addEventListener("click", () => setPage(index, true));
        thumbnails.append(button);
        thumbnailButtons.push(button);
      }

      const setPage = (nextPage, centerThumbnail = false) => {
        page = Math.min(Math.max(nextPage, 1), item.pageCount);
        mainImage.src = pageSource(item, page);
        mainImage.alt = `${item.title}，第 ${page} 页`;
        counter.textContent = `${String(page).padStart(2, "0")} / ${String(item.pageCount).padStart(2, "0")}`;
        previous.disabled = page === 1;
        next.disabled = page === item.pageCount;
        thumbnailButtons.forEach((button, index) => {
          const selected = index + 1 === page;
          button.classList.toggle("is-active", selected);
          if (selected) button.setAttribute("aria-current", "page");
          else button.removeAttribute("aria-current");
        });
        if (centerThumbnail) {
          thumbnailButtons[page - 1].scrollIntoView({ block: "nearest", inline: "center" });
        }
      };

      previous.addEventListener("click", () => setPage(page - 1, true));
      next.addEventListener("click", () => setPage(page + 1, true));
      fullscreen.addEventListener("click", () => viewer.requestFullscreen?.());
      viewer.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") setPage(page - 1, true);
        if (event.key === "ArrowRight") setPage(page + 1, true);
      });

      viewer.append(toolbar, stage, thumbnails);
      tool.append(viewer);
      setPage(1);
    };

    buildTool();
  });
})();
