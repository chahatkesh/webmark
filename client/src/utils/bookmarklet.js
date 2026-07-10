export const BOOKMARKLET_TITLE = "Save to Webmark";

/**
 * Build a bookmarklet href. Do not URL-encode the script body — Chrome uses the
 * href as the bookmark title for javascript: links, and encoding produces the
 * unreadable "javascript:(function()%7B..." label users see in the bar.
 *
 * The leading block comment gives Chrome a readable title on drag-and-drop.
 */
export const buildBookmarklet = (apiUrl) => {
  const code =
    `/*/Save to Webmark*/` +
    `(function(){` +
    `var t=encodeURIComponent(document.title||location.hostname),` +
    `u=encodeURIComponent(location.href),` +
    `fav=encodeURIComponent('https://www.google.com/s2/favicons?domain='+location.hostname+'&sz=128'),` +
    `w=420,h=300,` +
    `x=Math.round(screen.width/2-210),` +
    `y=Math.round(screen.height/2-150),` +
    `dest='${apiUrl}/api/bookmarks/save?url='+u+'&title='+t+'&logo='+fav;` +
    `window.open(dest,'_webmark','width='+w+',height='+h+',top='+y+',left='+x+',noopener=no');` +
    `})();`;

  return `javascript:${code}`;
};

export const applyBookmarkletDragData = (event, bookmarkletHref, appUrl) => {
  const title = BOOKMARKLET_TITLE;
  const faviconUrl = `${appUrl}/favicon.png`;

  event.dataTransfer.setData("text/x-moz-url", `${bookmarkletHref}\n${title}`);
  event.dataTransfer.setData("text/uri-list", `# ${title}\n${bookmarkletHref}`);
  event.dataTransfer.setData(
    "text/html",
    `<meta charset="utf-8"><a href="${bookmarkletHref}" icon="${faviconUrl}">${title}</a>`,
  );
  event.dataTransfer.setData("text/plain", bookmarkletHref);
  event.dataTransfer.effectAllowed = "copy";
};

const escapeHtmlAttribute = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

export const downloadBookmarkletFile = async (bookmarkletHref, appUrl) => {
  let iconAttribute = "";

  try {
    const response = await fetch(`${appUrl}/favicon.png`);
    if (response.ok) {
      const bytes = new Uint8Array(await response.arrayBuffer());
      const base64 = btoa(String.fromCharCode(...bytes));
      iconAttribute = ` ICON="data:image/png;base64,${base64}"`;
    }
  } catch (error) {
    console.error("Failed to load favicon for bookmark export:", error);
  }

  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file. -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="${escapeHtmlAttribute(bookmarkletHref)}"${iconAttribute}>${BOOKMARKLET_TITLE}</A>
</DL><p>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = "webmark-bookmarklet.html";
  link.click();
  URL.revokeObjectURL(objectUrl);
};
