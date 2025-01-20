type Job = {
  repo: string
  name: string
  event: string
  status: string
  conclusion: string
  number: number
  created: string
  updated: string
  title: string
  url: string
  commit: string
  author: string
}

function init (value: any) {
  const element = document.getElementById('container')
  if (element == null) {
    return
  }

  const repositories = new Map<string, Job[]>()
  for (const job of value.jobs) {
    if (repositories.has(job.repo)) {
      repositories.get(job.repo)!.push(job)
    } else {
      repositories.set(job.repo, [job])
    }
  }

  let html = ''
  for (const [repo, jobs] of repositories) {
    jobs.sort((a, b) => {
      return a.number - b.number
    })
    const lastJob = jobs[jobs.length - 1]
    const status = lastJob.conclusion === 'success' ? 'status-success'
      : lastJob.conclusion === 'failure' ? 'status-fail'
      : 'status-in-progress'

    const prevJob = jobs[jobs.length - 2]

    html += `
      <div class="shadow card m-2" style="width: 18rem;">
        <div class="card-img-top status ${status}">
          <a href="${lastJob.url}">
            ${(lastJob.conclusion ?? lastJob.status)?.toUpperCase() ?? ''}
          </a>
        </div>
        <div class="card-body">
          <h5 class="card-title">&#9673; ${repo}</h5>
          <p class="card-text author-text">${lastJob.author}</p>
          <p class="card-text commit-text">${lastJob.commit}</p>
    `
    if (prevJob != null) {
      html += `
          <p class="card-text author-text">${prevJob.author}</p>
          <p class="card-text commit-text">${prevJob.commit}</p>
      `
    }

    html += `
        </div>
      </div>
    `
  }
  element.innerHTML = html
}

(window as any).electron.onRenderValue(async (value: any) => {
  init(value)
})
