export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)
function uploadResume(resume:File) {
  console.log(`uploadResume ${resume.name} ${resume.size} ${resume.type}`)
  let formData = new FormData()
  formData.append("resume", resume)
  const api_url = process.env.RESUME_PARSING_API
  console.log(`api_url ${api_url}`)
  fetch(api_url, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  
}