const urlInput = document.getElementById("tiktokUrl");
const downloadBtn = document.getElementById("downloadBtn");
const errorBox = document.getElementById("errorBox");
const errorText = document.getElementById("errorText");
const videoPreview = document.getElementById("videoPreview");
const videoThumb = document.getElementById("videoThumb");
const videoTitle = document.getElementById("videoTitle");
const videoAuthor = document.getElementById("videoAuthor");
const downloadDirectBtn = document.getElementById("downloadDirectBtn");

let currentDownloadUrl = "";

downloadBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();

  if (!url) {
    showError("Silakan masukkan URL TikTok");
    return;
  }

  if (!url.includes("tiktok.com")) {
    showError("URL tidak valid. Pastikan URL dari TikTok");
    return;
  }

  // Reset previous state
  errorBox.classList.add("hidden");
  videoPreview.classList.add("hidden");
  downloadBtn.disabled = true;
  downloadBtn.innerHTML = `<svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"></circle><path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"></path></svg> Processing...`;

  try {
    const response = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url, hd: 1 })
    });

    const data = await response.json();

    if (data.code === 0) {
      const v = data.data;
      videoThumb.src = v.cover || v.origin_cover;
      videoTitle.innerText = v.title || "TikTok Video";
      videoAuthor.innerText = "Oleh: " + (v.author?.nickname || "Unknown");

      currentDownloadUrl = v.hdplay || v.play;

      videoPreview.classList.remove("hidden");
    } else {
      showError("Gagal mengunduh video. Pastikan URL valid & publik.");
    }
  } catch (err) {
    showError("Terjadi kesalahan. Coba lagi.");
  }

  downloadBtn.disabled = false;
  downloadBtn.innerHTML = `<i data-lucide="download" class="w-5 h-5"></i> Download Video`;
  lucide.createIcons();
});

downloadDirectBtn.addEventListener("click", () => {
  if (currentDownloadUrl) {
    window.open(currentDownloadUrl, "_blank");
  }
});

function showError(msg) {
  errorText.innerText = msg;
  errorBox.classList.remove("hidden");
}
