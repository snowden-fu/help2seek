import { json } from "stream/consumers"

export {}

console.log(
  "Live now; make now always the most precious time. Now will never come again."
)
function uploadResume(resume: File) {
  console.log(`uploadResume ${resume.name} ${resume.size} ${resume.type}`)
  let formData = new FormData()
  formData.append("resume", resume)
  const api_url = process.env.RESUME_PARSING_API
  console.log(`api_url ${api_url}`)
  fetch(api_url, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}
/**
 * get job detail from seek detail page,
 * trigger by tab url match
 * saved in session storage
 * @param url url of job detail page, should be from tab.url
 */
function get_job_detail(url: string) {
  console.log(`get_job_detail url ${url}`)
  const api_url =
    "https://australia-southeast1-help2seek.cloudfunctions.net/fetch_seek_job_details"
  return fetch(api_url, {
    method: "POST",
    body: JSON.stringify({ job_url: url }),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

/**
 * analyze job detail and resume,
 * job detail and resume should both submitted from local to server for asessment
 * @param resume resume text parsed from pdf
 * @param job_detail job detail text parsed from seek job detail page, saved in session storage
 */
function analyze_job_detail(resume: string, job_detail: string) {
  const api_url = "https://australia-southeast1-help2seek.cloudfunctions.net/analyze_job"
  console.log(`analyze_job_detail api_url ${api_url}`)
  return fetch(api_url, {
    method: "POST",
    body: JSON.stringify({ resume_text: resume, job_desc: job_detail }),
    headers: {
      "Content-Type": "application/json"
    }
  })
}
const url_pattern = /https:\/\/www.seek.com.au\/job\/.*/
function checkTabURL(tabId: number) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url && url_pattern.test(tab.url)) {
      console.log("URL matches the pattern:", tab.url)
      get_job_detail(tab.url).then((res) => {
        return res.json()
      })
      .then(data=>{
        console.log(`job detail: ${data["job_desc"]}`);
        // get resime text from local storage
        chrome.storage.local.get('resume_txt', function(result) {
          if (result.resume_txt!== undefined){
            console.log('Value currently is ' + result.resume_txt);
            analyze_job_detail(result.resume_txt, data["job_desc"])
            .then((res) => {
              return res.json()
            }
            )
          } else {
            console.log('Value is undefined');
          }
        });
        // if resume text is in global storage
        // call analyze_job_detail
        // get resume text out of storage
        // call analyze_job_detail
      }
      )
    }
  })
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  checkTabURL(activeInfo.tabId)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    checkTabURL(tabId)
  }
})
