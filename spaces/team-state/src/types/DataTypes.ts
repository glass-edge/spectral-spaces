type PRItem = {
  status: string
}

export type TreeNode = {
  name?: string
  status?: string
  completion?: number
  assignee?: string
  prs?: PRItem[]

  renderData?: any
  children?: TreeNode[]
}

export type ActionItem = {
  name: string
  status?: string
  assignee?: string
}
