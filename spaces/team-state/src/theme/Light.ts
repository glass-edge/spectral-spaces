import Theme, { ThemeLayout } from "./Theme";

export default class Light extends Theme {
  static style: ThemeLayout = {
    background: {
      fill: '#fff',
      stroke: '#999',
      shadowColor: '#bbb',
      shadowBlur: 10,
      lineWidth: 1
    },
    neutral: {
      fill: '#f8f8f8',
      stroke: '#999',
      shadowColor: '#bbb',
      shadowBlur: 10,
      lineWidth: 1,
      text: {
        fill: '#000'
      }
    },
    leftArc: {
      fill: '#f8f8f8',
      stroke: '#600',
      shadowColor: '#c00',
      shadowBlur: 10,
      lineWidth: 2
    },
    rightArc: {
      fill: '#f8f8f8',
      stroke: '#006',
      shadowColor: '#00c',
      shadowBlur: 10,
      lineWidth: 2
    },
    status: {
      missing: {
        fill: '#fff',
        stroke: '#999',
        shadowBlur: 0,
        lineWidth: 1,
        text: {
          fill: '#aaa'
        }
      },
      todo: {
        fill: '#f8f8f8',
        stroke: '#999',
        shadowBlur: 0,
        lineWidth: 1
      },
      inProgress: {
        fill: '#d3d9fe',
        stroke: '#7a87dd',
        shadowColor: '#7a87dd',
        shadowBlur: 16,
        lineWidth: 3
      },
      inReview: {
        fill: '#cefffc',
        stroke: '#6dcdc6',
        shadowColor: '#6dcdc6',
        shadowBlur: 16,
        lineWidth: 3
      },
      done: {
        fill: '#c0ffbc',
        stroke: '#7ee177',
        shadowColor: '#7ee177',
        shadowBlur: 16,
        lineWidth: 3
      }
    }
  }

  constructor () {
    super(Light.style)
  }

  enable () {
    Theme.style = Light.style
  }
}
