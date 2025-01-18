export function truncateText (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let width = ctx.measureText(text).width
  const ellipsis = '...'
  const ellipsisWidth = ctx.measureText(ellipsis).width
  if (width <= maxWidth || width <= ellipsisWidth) {
    return text
  }
  let len = text.length
  while (width >= maxWidth - ellipsisWidth && len-- > 0) {
    text = text.substring(0, len)
    width = ctx.measureText(text).width
  }
  return text + ellipsis
}
