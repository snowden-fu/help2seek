import React from "react"
import "../style.css"
const JobDetail: React.FC = () => {
  return (
    <div>
      <h1>AI analysis</h1>
      <section>
        <h2>Overall Score</h2>
        <p>80%</p>
      </section>
      <section>
        <h2>visa check</h2>
        <p>PR required</p>
      </section>
      <section>
        <h2>Skills matched</h2>
        <ul>
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>PHP</li>
          <li>MySQL</li>
        </ul>
      </section>
      <section>
        <h2>skill missed</h2>
        <ul>
          <li>Java</li>
          <li>Python</li>
          <li>SQL</li>
        </ul>
      </section>
    </div>
  )
}

export default JobDetail
