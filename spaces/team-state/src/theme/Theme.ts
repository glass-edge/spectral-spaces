type ApplyFunction = (ctx: CanvasRenderingContext2D, shadow?: boolean) => void

interface ThemeItem {
  fill?: string
  stroke?: string
  shadowColor?: string
  shadowBlur?: number
  lineWidth?: number
  font?: string

  text?: {
    fill?: string
    stroke?: string
    font?: string

    apply?: ApplyFunction
  }

  apply?: ApplyFunction
}

type StatusKeys = 'missing' | 'todo' | 'inProgress' | 'inReview' | 'done'

export interface ThemeLayout {
  background: ThemeItem
  neutral: ThemeItem
  leftArc: ThemeItem
  rightArc: ThemeItem
  status: {
    [key in StatusKeys]: ThemeItem
  }
}

export default class Theme {
  static style: ThemeLayout

  constructor (root: ThemeLayout) {
    Theme.style = root

    const walk = (node: any) => {
      if (typeof node !== 'object') {
        return
      }

      for (const key in node) {
        if (typeof node[key] !== 'object') {
          continue
        }
        node[key].apply = (ctx: CanvasRenderingContext2D, shadow?: boolean) => {
          this._apply(ctx, node[key], shadow)
        }
        walk(node[key] as any)
      }
    }
    walk(root)
  }

  static status (status?: string): ThemeItem {
    if (status != null && status in Theme.style.status) {
      return Theme.style.status[status as StatusKeys]
    }
    switch (status) {
      case 'Missing':
        return Theme.style.status.missing
      case 'In Progress':
        return Theme.style.status.inProgress
      case 'In Review':
        return Theme.style.status.inReview
      case 'Done':
        return Theme.style.status.done
      default:
        return Theme.style.status.todo
    }
  }

  private _apply (ctx: CanvasRenderingContext2D, item: ThemeItem, shadow: boolean = false) {
    ctx.fillStyle = item.fill ?? ctx.fillStyle
    ctx.strokeStyle = item.stroke ?? ctx.strokeStyle
    ctx.font = item.font ?? ctx.font
    ctx.lineWidth = item.lineWidth ?? ctx.lineWidth

    if (shadow) {
      ctx.shadowBlur = item.shadowBlur ?? ctx.shadowBlur
      ctx.shadowColor = item.shadowColor ?? ctx.shadowColor
    }
  }
}
