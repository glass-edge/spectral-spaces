import { truncateText } from '../common/Util'
import Theme from '../theme/Theme'
import { TreeNode } from '../types/DataTypes'

export default class TaskWheel {
  private _data: TreeNode[]

  constructor (data: TreeNode[]) {
    this._data = data
  }

  draw (ctx: CanvasRenderingContext2D, innerRadius: number = 140, outerRadius: number = 360) {
    ctx.save()
    const step = 2 * Math.PI / this._data.length

    // Draw basic setup
    ctx.save()
    this._data.forEach((node, i) => {
      Theme.status(node.status).apply!(ctx)
      ctx.beginPath()
      this._drawGeometry(ctx, step, step * i, innerRadius, outerRadius)
      ctx.stroke()
      ctx.fill()
      ctx.closePath()
    })
    ctx.restore()

    // Draw highlighted elements
    ctx.save()
    this._data.forEach((node, i) => {
      if (![ 'In Progress', 'In Review', 'Done' ].includes(node.status ?? '')) {
        return
      }

      Theme.status(node.status).apply!(ctx, true)
      ctx.beginPath()
      this._drawGeometry(ctx, step, step * i, innerRadius, outerRadius)
      ctx.stroke()
    })
    ctx.restore()

    // Fill elements
    ctx.save()
    this._data.forEach((node, i) => {
      if (!this._setupFills(ctx, node, innerRadius, outerRadius)) {
        return
      }

      ctx.beginPath()
      this._drawGeometry(ctx, step, step * i, innerRadius, outerRadius)
      ctx.fill()
      ctx.closePath()
    })
    ctx.restore()

    // Draw text
    ctx.save()
    this._data.forEach((node, i) => {
      const angle = step * i

      if (node.name == null) {
        Theme.style.status.missing.text?.apply!(ctx)
      } else {
        Theme.style.neutral.text?.apply!(ctx)
      }

      if (node.name != null) {
        this._drawText(ctx,
          truncateText(ctx, node.name ?? 'Unavailable', outerRadius - innerRadius - 50),
          angle, innerRadius, 0, 2)
      }

      if (node.assignee == null) {
        Theme.style.status.missing.text?.apply!(ctx)
      } else {
        Theme.style.neutral.text?.apply!(ctx)
      }

      if (node.assignee != null) {
        this._drawText(ctx,
          truncateText(ctx, node.assignee != null ? node.assignee : 'Unassigned', outerRadius - innerRadius - 50),
          angle, innerRadius, 1, 2)
      }
    })
    ctx.restore()

    // Draw PRs
    ctx.save()
    this._data.forEach((node, i) => {
      node.prs?.forEach((pr, j) => {
        this._drawPR(ctx, step, step * i, j, node.prs?.length ?? 0, pr.status, outerRadius + 4)
      })
    })
    ctx.restore()
  }

  private _drawText (ctx: CanvasRenderingContext2D,
    text: string, angle: number, radius: number, lineNumber: number, lineCount: number) {
    ctx.save()

    const lineAngle = 2 * Math.atan2(8, radius)
    const curLineAngle = lineAngle * (lineNumber - (lineCount - 1) / 2)
    if (Math.cos(angle) > 0) {
      ctx.rotate(angle + curLineAngle)
      ctx.translate(radius + 10, 0)
      ctx.textAlign = 'left'
    } else {
      ctx.scale(-1, -1)
      ctx.rotate(angle - curLineAngle)
      ctx.translate(-radius - 10, 0)
      ctx.textAlign = 'right'
    }
    ctx.textBaseline = 'middle'
    ctx.font = '12px Arial'
    ctx.fillText(text, 0, 0)

    ctx.restore()
  }

  private _drawPR (ctx: CanvasRenderingContext2D, fullStep: number, fullAngle: number,
    currentItemIndex: number, itemCount: number, itemStatus: string, outerRadius: number) {
    const shrink = 0.8
    const itemSpan = Math.PI * 0.01739
    const itemRadiusStep = 10
    const rowSize = Math.floor(fullStep / itemSpan)
    const angle = fullAngle - itemSpan * Math.min(itemCount, rowSize) / 2 + itemSpan * (0.5 + currentItemIndex % rowSize)
    const step = itemSpan * 0.6
    const minRadius = outerRadius + itemRadiusStep * Math.floor(currentItemIndex / rowSize)
    const maxRadius = minRadius + itemRadiusStep * shrink

    ctx.beginPath()
    ctx.arc(0, 0, (minRadius + maxRadius) / 2, angle - step / 2, angle + step / 2)
    Theme.status(itemStatus).apply!(ctx)
    ctx.lineWidth = itemRadiusStep * 0.5
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.closePath()
  }

  private _drawGeometry (ctx: CanvasRenderingContext2D, step: number, angle: number, innerRadius: number, outerRadius: number) {
    const csNext = { cos: Math.cos(angle + step / 2), sin: Math.sin(angle + step / 2) }
    const csPrev = { cos: Math.cos(angle - step / 2), sin: Math.sin(angle - step / 2) }

    ctx.moveTo(csPrev.cos * innerRadius, csPrev.sin * innerRadius)
    ctx.lineTo(csPrev.cos * outerRadius, csPrev.sin * outerRadius)
    ctx.arc(0, 0, outerRadius, angle - step / 2, angle + step / 2)
    ctx.lineTo(csNext.cos * innerRadius, csNext.sin * innerRadius)
    ctx.arc(0, 0, innerRadius, angle + step / 2, angle - step / 2, true)
  }

  private _setupFills (ctx: CanvasRenderingContext2D, node: TreeNode, innerRadius: number, outerRadius: number): boolean {
    // TODO: Support completion for all statuses
    if (node.status === 'In Progress') {
      if (node.completion != null) {
        const g = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius)
        g.addColorStop(0, Theme.style.status.inProgress.fill ?? 'black')
        g.addColorStop(node.completion, Theme.style.status.inProgress.fill ?? 'black')
        g.addColorStop(node.completion, Theme.style.neutral.fill ?? 'white')
        g.addColorStop(1, Theme.style.neutral.fill ?? 'white')
        ctx.fillStyle = g
      } else {
        Theme.status(node.status).apply!(ctx)
      }
      return true
    } else if (node.status === 'In Review') {
      Theme.status(node.status).apply!(ctx)
      return true
    } else if (node.status === 'Done') {
      Theme.status(node.status).apply!(ctx)
      return true
    }
    return false
  }
}
