import { truncateText } from '../common/Util'
import Theme from '../theme/Theme'
import { ActionItem } from '../types/DataTypes'

export default class TaskArc {
  private _data: ActionItem[]
  private _leftSide: boolean

  constructor (data: ActionItem[], side: 'left' | 'right') {
    this._data = data
    this._leftSide = side === 'left'
  }

  draw (ctx: CanvasRenderingContext2D, innerRadius: number, outerRadius: number) {
    ctx.save()

    const externalAngle = Math.PI * 0.2
    const namePartition = 0.66
    const startAngle = this._leftSide ? Math.PI - externalAngle : -externalAngle
    const endAngle = this._leftSide ? Math.PI + externalAngle : externalAngle

    ctx.save()
    if (this._leftSide) {
      Theme.style.leftArc.apply!(ctx, true)
    } else {
      Theme.style.rightArc.apply!(ctx, true)
    }
    ctx.beginPath()
    ctx.arc(0, 0, outerRadius, startAngle, endAngle)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()

    const maxItemCount = 50
    const itemCount = Math.min(maxItemCount, this._data.length)
    const stepAngle = externalAngle * 2 / (maxItemCount - 1)
    const extraCount = this._data.length - itemCount
    for (let i = 0; i < itemCount; i++) {
      const item = this._data[i]
      const angle = this._leftSide
        ? endAngle - i * stepAngle - externalAngle * (1 - itemCount / maxItemCount)
        : startAngle + i * stepAngle + externalAngle * (1 - itemCount / maxItemCount)

      ctx.save()
      if (this._leftSide) {
        ctx.scale(-1, -1)
        ctx.rotate(angle)
        ctx.translate(-outerRadius + 10, 0)
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        Theme.style.neutral.text?.apply!(ctx)
        ctx.font = '10px Arial'

        if (i == itemCount - 1 && extraCount > 0) {
          ctx.fillText(`...and ${extraCount + 1} more`, 0, 0)
        } else {
          ctx.fillText(
            truncateText(ctx, item.name, (outerRadius - innerRadius) * namePartition),
            0, 0)
          if (item.assignee != null) {
            ctx.fillText(
              truncateText(ctx, item.assignee, (outerRadius - innerRadius) * (1 - namePartition) - 20),
              (outerRadius - innerRadius) * namePartition + 10, 0)
          }
        }
      } else {
        ctx.rotate(angle)
        ctx.translate(outerRadius - 10, 0)
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        Theme.style.neutral.text?.apply!(ctx)
        ctx.font = '10px Arial'

        if (i == itemCount - 1 && extraCount > 0) {
          ctx.fillText(`...and ${extraCount + 1} more`, 0, 0)
        } else {
          ctx.fillText(
            truncateText(ctx, item.name, (outerRadius - innerRadius) * namePartition),
            0, 0)
          if (item.assignee != null) {
            ctx.fillText(
              truncateText(ctx, item.assignee, (outerRadius - innerRadius) * (1 - namePartition) - 20),
              -(outerRadius - innerRadius) * namePartition - 10, 0)
          }
        }
      }
      ctx.restore()
    }

    ctx.restore()
  }
}
