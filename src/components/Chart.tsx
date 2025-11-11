import { Bar, Scatter } from 'react-chartjs-2'
import type { ChartProps, ScatterChartProps } from '../types'

export function Chart({ values, title, label, colorSpace, metric, xTitle, onBarClick }: ChartProps) {
  const bins: { [key: number]: number } = {}
  values.forEach(value => {
    const bin = Math.round(value)
    bins[bin] = (bins[bin] || 0) + 1
  })

  const labels = Object.keys(bins).sort((a, b) => parseInt(a) - parseInt(b))
  const data = labels.map(label => bins[parseInt(label)])

  const chartData = {
    labels: labels.map(l => `${l}${metric === 'hue' ? '°' : ''}`),
    datasets: [{
      label: label,
      data: data,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    onClick: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index
        const bin = parseInt(labels[index])
        onBarClick(bin, metric, colorSpace)
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequência'
        }
      },
      x: {
        title: {
          display: true,
          text: xTitle
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: title
      }
    }
  }

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export function ScatterChart({ points, title, xTitle, yTitle, onPointClick }: ScatterChartProps) {
  const chartData = {
    datasets: [{
      label: 'Pontos',
      data: points,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    onClick: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index
        onPointClick(index)
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xTitle
        }
      },
      y: {
        title: {
          display: true,
          text: yTitle
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: title
      }
    }
  }

  return (
    <div className="chart-wrapper">
      <Scatter data={chartData} options={options} />
    </div>
  )
}
