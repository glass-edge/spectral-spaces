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

    html += `
      <div class="card m-2" style="width: 18rem;">
        <div class="card-img-top status ${status}">
          <a href="${lastJob.url}">
            ${(lastJob.conclusion ?? lastJob.status)?.toUpperCase() ?? ''}
          </a>
        </div>
        <div class="card-body">
          <h5 class="card-title">${repo}</h5>
          <p class="card-text job-text">${lastJob.author}<br/>${lastJob.commit}</p>
        </div>
      </div>
    `
  }
  element.innerHTML = html
}

(window as any).electron.onRenderValue(async (value: any) => {
  init(value)
})
