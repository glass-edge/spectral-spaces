function init (value: any) {
  const element = document.getElementById('value')
  if (element != null) {
    element.innerHTML = JSON.stringify(value, null, 2)
  }
}

(window as any).electron.onRenderValue(async (value: any) => {
  init(value)
})
