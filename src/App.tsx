import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface SkinToneData {
  input: {
    filename: string
    colors: {
      skin: string
      skin_hsl: [number, number, number]
      skin_lch: [number, number, number]
    }
  }
}

interface ChartProps {
  hues: number[]
  title: string
  label: string
  colorSpace: 'hsl' | 'lch'
  onBarClick: (hueBin: number, colorSpace: 'hsl' | 'lch') => void
}

function Chart({ hues, title, label, colorSpace, onBarClick }: ChartProps) {
  // Create bins (every 1 degree)
  const bins: { [key: number]: number } = {}
  hues.forEach(hue => {
    const bin = Math.floor(hue)
    bins[bin] = (bins[bin] || 0) + 1
  })

  const labels = Object.keys(bins).sort((a, b) => parseInt(a) - parseInt(b))
  const data = labels.map(label => bins[parseInt(label)])

  const chartData = {
    labels: labels.map(l => `${l}°`),
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
        const hueBin = parseInt(labels[index])
        onBarClick(hueBin, colorSpace)
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
          text: 'Tom (°)'
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

interface ImageItemProps {
  data: SkinToneData
}

function ImageItem({ data }: ImageItemProps) {
  const { filename, colors } = data.input
  const { skin, skin_hsl, skin_lch } = colors

  const tooltip = `Hex: ${skin}\nHSL: ${Math.round(skin_hsl[0] * 360)}°\nLCH: ${Math.round(skin_lch[2])}°`

  return (
    <div className="item" title={tooltip}>
      <div className="filename">{filename}</div>
      <div className="image-and-color">
        <div className="image-container">
          <img src={`/files/${filename}`} alt={filename} />
        </div>
        <div
          className="color-swatch"
          style={{ backgroundColor: skin }}
        />
      </div>
    </div>
  )
}

function App() {
  const [allData, setAllData] = useState<SkinToneData[]>([])
  const [filteredData, setFilteredData] = useState<SkinToneData[]>([])
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    fetch('/processed.json')
      .then(response => response.json())
      .then(data => {
        setAllData(data)
        setFilteredData(data)
      })
      .catch(error => console.error('Error loading data:', error))
  }, [])

  const handleBarClick = (hueBin: number, colorSpace: 'hsl' | 'lch') => {
    const filtered = allData.filter(item => {
      const hue = colorSpace === 'hsl'
        ? item.input.colors.skin_hsl[0] * 360
        : item.input.colors.skin_lch[2]
      return Math.floor(hue) === hueBin
    })
    setFilteredData(filtered)
    setFilterText(`Filtrado por tom ${hueBin}° (${colorSpace.toUpperCase()})`)
  }

  const resetFilter = () => {
    setFilteredData(allData)
    setFilterText('')
  }

  const hslHues = filteredData.map(item => item.input.colors.skin_hsl[0] * 360)
  const lchHues = filteredData.map(item => item.input.colors.skin_lch[2])

  return (
    <div className="container">
      <h1>Visualizador de Cores de Imagens{filterText && ` - ${filterText}`}</h1>
      {filterText && (
        <button className="reset-btn" onClick={resetFilter}>
          Mostrar Todas as Imagens
        </button>
      )}
      <div className="main-layout">
        <div className="charts-section">
          <Chart
            hues={hslHues}
            title="Distribuição de Tons HSL"
            label="Quantidade"
            colorSpace="hsl"
            onBarClick={handleBarClick}
          />
          <Chart
            hues={lchHues}
            title="Distribuição de Tons LCH"
            label="Quantidade"
            colorSpace="lch"
            onBarClick={handleBarClick}
          />
        </div>
        <div className="images-section">
          {filteredData.map((item, index) => (
            <ImageItem key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
