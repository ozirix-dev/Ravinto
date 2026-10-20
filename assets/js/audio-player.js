document.querySelectorAll("[data-audio-player]").forEach((player) => {
  const audio = player.querySelector("audio");
  const button = player.querySelector("button");
  const status = player.querySelector('[role="status"]');
  const playLabel = player.dataset.play;
  const pauseLabel = player.dataset.pause;
  const loadingLabel = player.dataset.loading;
  const errorLabel = player.dataset.error;
  const tableLabel = player.dataset.tableLabel;

  if (!audio || !button || !status) return;

  const articleContent = player.closest(".post-content") || player.closest(".page-content");
  articleContent?.querySelectorAll("table").forEach((table, index) => {
    table.tabIndex = 0;
    const heading = table.querySelector("th")?.textContent?.trim();
    table.setAttribute("aria-label", heading ? `${tableLabel}: ${heading}` : `${tableLabel} ${index + 1}`);
  });

  const setPaused = () => {
    button.textContent = playLabel;
    button.setAttribute("aria-label", playLabel);
    button.setAttribute("aria-pressed", "false");
    button.disabled = false;
  };

  button.addEventListener("click", async () => {
    status.textContent = "";
    if (!audio.paused) {
      audio.pause();
      return;
    }

    button.disabled = true;
    button.textContent = loadingLabel;
    try {
      await audio.play();
    } catch {
      setPaused();
      status.textContent = errorLabel;
    }
  });

  audio.addEventListener("play", () => {
    button.disabled = false;
    button.textContent = pauseLabel;
    button.setAttribute("aria-label", pauseLabel);
    button.setAttribute("aria-pressed", "true");
  });
  audio.addEventListener("pause", setPaused);
  audio.addEventListener("ended", setPaused);
  audio.addEventListener("error", () => {
    setPaused();
    status.textContent = errorLabel;
  });

});
