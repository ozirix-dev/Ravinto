document.querySelectorAll(".article-content").forEach((content) => {
  content.querySelectorAll("table").forEach((table, index) => {
    table.tabIndex = 0;
    const heading = table.querySelector("th")?.textContent?.trim();
    const label = content.dataset.tableLabel || "Data table";
    table.setAttribute("aria-label", heading ? `${label}: ${heading}` : `${label} ${index + 1}`);
  });

  const nav = content.querySelector("[data-article-toc]");
  if (!nav) return;
  const list = nav.querySelector("[data-article-toc-list]");
  const levels = (nav.dataset.levels || "2,3").split(",").map(Number);
  if (!content || !list) return;

  let currentSection = null;
  let subsectionList = null;
  let count = 0;

  content.querySelectorAll("h2[id], h3[id]").forEach((heading) => {
    const level = Number(heading.tagName.slice(1));
    if (!levels.includes(level) || heading === nav.querySelector("h2")) return;

    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent.trim();
    item.appendChild(link);

    if (level === 2) {
      list.appendChild(item);
      currentSection = item;
      subsectionList = null;
    } else if (currentSection) {
      if (!subsectionList) {
        subsectionList = document.createElement("ol");
        currentSection.appendChild(subsectionList);
      }
      subsectionList.appendChild(item);
    } else {
      list.appendChild(item);
    }
    count += 1;
  });

  if (count === 0) nav.hidden = true;
});
