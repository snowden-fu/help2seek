const pattern = "https://www.seek.com.au/job/.*";

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on string matches pattern
  if (url.href.match(pattern)) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "sidepanel.html",
      enabled: true,
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });
  }
});

function getResumePdfToTxt(getResumePdf) {
  return fetch("http://localhost:5000/convert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume: getResumePdf,
    }),
  }).then((res) => res.json());
}
function getJobDetailTxt(jobDetailUrl) {
  return fetch("http://localhost:5000/job", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_detail_url: jobDetailUrl,
    }),
  }).then((res) => res.json());
}
function getJobAnalysis(jobDetailTxt, resumeTxt) {
  return fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_detail: jobDetailTxt,
      resume: resumeTxt,
    }),
  }).then((res) => res.json());
}