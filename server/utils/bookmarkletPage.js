const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const baseStyles = `
  * { box-sizing: border-box; margin: 0; }
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: linear-gradient(135deg, #eff6ff, #e0e7ff);
    color: #1f2937;
  }
  .card {
    width: 100%;
    max-width: 280px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    padding: 28px 24px;
    text-align: center;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #2563eb;
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .subtitle {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
  }
  .success { color: #16a34a; font-size: 42px; line-height: 1; margin-bottom: 16px; }
  .error { color: #dc2626; font-size: 42px; line-height: 1; margin-bottom: 16px; }
  button {
    margin-top: 18px;
    border: 0;
    border-radius: 10px;
    background: #f3f4f6;
    color: #374151;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
    cursor: pointer;
  }
`;

export const sendBookmarkletPage = (res, { status, title, message, autoCloseMs = 0, syncUrl = null }) => {
  const icon = status === "success" ? "✓" : status === "error" ? "✕" : "…";
  const iconClass = status === "success" ? "success" : status === "error" ? "error" : "";
  const autoCloseScript = autoCloseMs > 0
    ? `<script>setTimeout(function(){try{window.close()}catch(e){}},${autoCloseMs});</script>`
    : "";
  const syncIframe = status === "success" && syncUrl
    ? `<iframe src="${escapeHtml(syncUrl)}" style="display:none" title="" tabindex="-1"></iframe>`
    : "";

  res
    .status(status === "error" ? 400 : 200)
    .type("html")
    .send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Webmark</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="card">
    <div class="brand">Webmark</div>
    <div class="${iconClass}">${icon}</div>
    <p class="title">${escapeHtml(title)}</p>
    ${message ? `<p class="subtitle">${escapeHtml(message)}</p>` : ""}
    ${status === "error" ? '<button type="button" onclick="window.close()">Close</button>' : ""}
  </div>
  ${syncIframe}
  ${autoCloseScript}
</body>
</html>`);
};
