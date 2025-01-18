import { TreeNode } from '../types/DataTypes'
import Theme from '../theme/Theme'

export default class Constellation {
  private _data: TreeNode
  private _depth: number

  constructor (data: TreeNode) {
    this._data = data
    this._depth = this._treeDepth(data)
    this._normalizeTree(data, 0, this._depth - 1)
  }

  get outerNodes () {
    return this._getNodesAtDepth(this._data, this._depth - 1)
  }

  draw (ctx: CanvasRenderingContext2D, radius: number = 180) {
    ctx.save()

    const radiusStep = radius / (this._depth - 1)

    let prevLevelNodes: TreeNode[] | undefined = undefined
    for (let ilevel = this._depth - 1; ilevel >= 0; ilevel--) {
      const levelRadius = radiusStep * ilevel

      if (ilevel === 0) {
        Theme.style.background.apply!(ctx)
        this._data.children?.forEach((node, i) => {
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(node.renderData.x, node.renderData.y)
          ctx.stroke()
        })
        break
      }

      const levelNodes = this._getNodesAtDepth(this._data, ilevel)

      if (prevLevelNodes == null) {
        const angleStep = 2 * Math.PI / levelNodes.length
        levelNodes.forEach((node, i) => {
          const angle = i * angleStep
          const x = Math.cos(angle) * levelRadius
          const y = Math.sin(angle) * levelRadius
          node.renderData = { x, y, angle }
        })
        prevLevelNodes = levelNodes
        continue
      }

      ctx.save()
      ctx.beginPath()
      if (ilevel % 2 === 0) {
        Theme.style.neutral.apply!(ctx, true)
      } else {
        Theme.style.background.apply!(ctx, true)
      }
      ctx.arc(0, 0, levelRadius, 0, 2 * Math.PI)
      ctx.shadowBlur = radiusStep * 0.25
      ctx.stroke()
      ctx.fill()
      ctx.closePath()
      ctx.restore()

      levelNodes.forEach(node => {
        if (node.children == null || node.children.length === 0) {
          return
        }

        const averageAngle = node.children.reduce((acc, child) => {
          return acc + child.renderData.angle
        }, 0) / node.children.length

        const x = Math.cos(averageAngle) * levelRadius
        const y = Math.sin(averageAngle) * levelRadius
        node.renderData = { x, y, angle: averageAngle }

        Theme.style.background.apply!(ctx)
        node.children
          .filter(child => child.name != null)
          .forEach(child => {
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(child.renderData.x, child.renderData.y)
            ctx.stroke()
          })
      })
    }

    this._allNodes(this._data).forEach(node => {
      if (node.name != null && node.renderData != null) {
        this._drawDot(ctx, node.renderData.x, node.renderData.y, node)
      }
    })

    this._drawDot(ctx, 0, 0, this._data)

    ctx.restore()
  }

  private _allNodes (node: TreeNode): TreeNode[] {
    if (node == null) {
      return []
    }
    return [node, ...(node.children?.flatMap(this._allNodes.bind(this)) ?? [])]
  }

  private _getNodesAtDepth (node: TreeNode, depth: number): TreeNode[] {
    if (node == null) {
      return []
    }
    if (depth === 0) {
      return [node]
    }
    return node.children?.flatMap(child => this._getNodesAtDepth(child, depth - 1)) ?? []
  }

  private _normalizeTree (node: TreeNode, depth: number, toDepth: number) {
    if (node == null || depth === toDepth) {
      return
    }
    if (node.children == null || node.children.length === 0) {
      node.children = [{ status: 'missing' }]
    }
    node.children.forEach(child => {
      this._normalizeTree(child, depth + 1, toDepth)
    })
  }

  private _treeDepth (node: TreeNode): number {
    if (node == null) {
      return 0
    }
    if (node.children == null || node.children.length === 0) {
      return 1
    }
    return 1 + Math.max(...node.children.map(this._treeDepth.bind(this)))
  }

  private _drawDot (ctx: CanvasRenderingContext2D, x: number, y: number, node: TreeNode) {
    ctx.save()
    Theme.status(node.status).apply!(ctx)
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
}
