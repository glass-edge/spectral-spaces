import Constellation from "./elements/Constellation"
import TaskArc from "./elements/TaskArc"
import TaskWheel from "./elements/TaskWheel"
import Light from "./theme/Light"
import Theme from "./theme/Theme"

const lightTheme = new Light()

const dataRoot = eval(
  (window as any).electron.fs.readFileSync('src/test-data.js',
    { encoding: 'utf-8' }))

function init (value: any) {
  const container = document.getElementById('viewportContainer') as HTMLDivElement
  const canvas = document.getElementById('viewport') as HTMLCanvasElement
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.translate(canvas.width / 2, canvas.height / 2)

  {
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    g.addColorStop(0, 'rgba(206, 197, 174, 0.5)') // '#cec5ae')
    g.addColorStop(1, 'rgba(39, 4, 182, 0.5)')  //'#2704b6')

    ctx.fillStyle = g
    // ctx.fillStyle = Theme.style.background.fill ?? ctx.fillStyle
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
  }

  const innerRadius = 140
  const outerRadius = 360
  const externalRadius = 720

  ctx.beginPath()
  Theme.style.background.apply!(ctx)
  {
    const g = ctx.createRadialGradient(0, 0, outerRadius + 56, 0, 0, outerRadius + 76)
    g.addColorStop(0, 'rgba(255, 255, 255, 0)')
    g.addColorStop(1, 'rgba(255, 255, 255, 0.5)')
    ctx.fillStyle = g
  }
  ctx.arc(0, 0, outerRadius + 76, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.closePath()

  const constellation = new Constellation(dataRoot)
  constellation.draw(ctx, innerRadius)

  const taskWheel = new TaskWheel(constellation.outerNodes)
  taskWheel.draw(ctx, innerRadius, outerRadius)

  const leftData = []
  for (let i = 0; i < 60; i++) {
    leftData.push({
      name: 'DMC-1250 Some bug' + ' to fix'.repeat(i % 5),
      assignee: 'John Doe'.repeat(i % 3 + 1),
    })
  }

  const rightData = []
  for (let i = 0; i < 5; i++) {
    rightData.push({
      name: 'DMC-1351 Some activity' + ' to do'.repeat(i % 5),
      assignee: 'Jane Doe'.repeat(i % 3 + 1),
    })
  }

  const leftArc = new TaskArc(leftData, 'left')
  leftArc.draw(ctx, outerRadius + 80, externalRadius)

  const rightArc = new TaskArc(rightData, 'right')
  rightArc.draw(ctx, outerRadius + 80, externalRadius)

  ctx.restore()
}

(window as any).electron.onRenderValue(async (value: any) => {
  init(value)
})
