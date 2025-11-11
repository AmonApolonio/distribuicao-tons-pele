import { useState, useEffect } from 'react'
import { Bar, Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import './App.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
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
  values: number[]
  title: string
  label: string
  colorSpace: 'hsl' | 'lch'
  metric: 'hue' | 'saturation' | 'chroma'
  xTitle: string
  onBarClick: (bin: number, metric: 'hue' | 'saturation' | 'chroma', colorSpace: 'hsl' | 'lch') => void
}

function Chart({ values, title, label, colorSpace, metric, xTitle, onBarClick }: ChartProps) {
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

interface ScatterChartProps {
  points: { x: number; y: number }[]
  title: string
  xTitle: string
  yTitle: string
  onPointClick: (index: number) => void
}

function ScatterChart({ points, title, xTitle, yTitle, onPointClick }: ScatterChartProps) {
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

interface ImageItemProps {
  data: SkinToneData
  activeTab: 'temperatura' | 'intensidade'
}

function ImageItem({ data, activeTab }: ImageItemProps) {
  const { filename, colors } = data.input
  const { skin, skin_hsl, skin_lch } = colors

  const tooltip = `Hex: ${skin}\nHSL: ${(skin_hsl[0] * 360).toFixed(2)}°\nLCH: ${skin_lch[2].toFixed(2)}°`

  return (
    <div className="item" title={tooltip}>
      <div className="filename">{filename}</div>
      <div className="image-and-color">
        <div className="image-container">
          <img src={`/files/${filename}`} alt={filename} />
        </div>
        <div className="color-section">
          <div
            className="color-swatch"
            style={{ backgroundColor: skin }}
          />
          <div className="color-values">
            <div>HSL: {activeTab === 'temperatura' ? (skin_hsl[0] * 360).toFixed(2) + '°' : (skin_hsl[1] * 100).toFixed(2)}</div>
            <div>LCH: {activeTab === 'temperatura' ? skin_lch[2].toFixed(2) + '°' : skin_lch[1].toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [allData, setAllData] = useState<SkinToneData[]>([])
  const [filteredData, setFilteredData] = useState<SkinToneData[]>([])
  const [filterText, setFilterText] = useState('')
  const [activeTab, setActiveTab] = useState<'temperatura' | 'intensidade'>('temperatura')

  useEffect(() => {
    fetch('/processed.json')
      .then(response => response.json())
      .then(data => {
        setAllData(data)
        setFilteredData(data)
      })
      .catch(error => console.error('Error loading data:', error))
  }, [])

  const handleBarClick = (bin: number, metric: 'hue' | 'saturation' | 'chroma', colorSpace: 'hsl' | 'lch') => {
    const filtered = allData.filter(item => {
      let value: number;
      if (metric === 'hue') {
        value = colorSpace === 'hsl' ? item.input.colors.skin_hsl[0] * 360 : item.input.colors.skin_lch[2];
      } else if (metric === 'saturation') {
        value = item.input.colors.skin_hsl[1] * 100;
      } else { // chroma
        value = item.input.colors.skin_lch[1];
      }
      return Math.round(value) === bin;
    });
    setFilteredData(filtered);
    const metricName = metric === 'hue' ? 'tom' : metric === 'saturation' ? 'saturação' : 'croma';
    const unit = metric === 'hue' ? '°' : '';
    setFilterText(`Filtrado por ${metricName} ${bin}${unit} (${colorSpace.toUpperCase()})`);
  };

  const handlePointClick = (index: number) => {
    const item = filteredData[index];
    setFilteredData([item]);
    setFilterText(`Filtrado por ponto: ${item.input.filename}`);
  };

  const resetFilter = () => {
    setFilteredData(allData)
    setFilterText('')
  }

  const hslHues = filteredData.map(item => item.input.colors.skin_hsl[0] * 360)
  const lchHues = filteredData.map(item => item.input.colors.skin_lch[2])
  const hslSaturations = filteredData.map(item => item.input.colors.skin_hsl[1] * 100)
  const lchChromas = filteredData.map(item => item.input.colors.skin_lch[1])

  const scatterPoints = hslSaturations.map((sat, i) => ({ x: sat, y: lchChromas[i] }))
  const hueScatterPoints = hslHues.map((h, i) => ({ x: h, y: lchHues[i] }))

  return (
    <div className="container">
      <h1>Visualizador de Cores de Imagens{filterText && ` - ${filterText}`}</h1>
      <div className="controls">
        <div className="tabs">
          <button onClick={() => { setActiveTab('temperatura'); resetFilter(); }} className={activeTab === 'temperatura' ? 'active' : ''}>Temperatura</button>
          <button onClick={() => { setActiveTab('intensidade'); resetFilter(); }} className={activeTab === 'intensidade' ? 'active' : ''}>Intensidade</button>
        </div>
        {filterText && (
          <button className="reset-btn" onClick={resetFilter}>
            Mostrar Todas as Imagens
          </button>
        )}
      </div>
      <div className="main-layout">
        <div className="charts-section">
          {activeTab === 'temperatura' && (
            <>
              <Chart
                values={hslHues}
                title="Distribuição de Tons HSL"
                label="Quantidade"
                colorSpace="hsl"
                metric="hue"
                xTitle="Tom (°)"
                onBarClick={handleBarClick}
              />
              <Chart
                values={lchHues}
                title="Distribuição de Tons LCH"
                label="Quantidade"
                colorSpace="lch"
                metric="hue"
                xTitle="Tom (°)"
                onBarClick={handleBarClick}
              />
              <ScatterChart
                points={hueScatterPoints}
                title="Correlação entre Tom HSL e Tom LCH"
                xTitle="Tom HSL (°)"
                yTitle="Tom LCH (°)"
                onPointClick={handlePointClick}
              />
            </>
          )}
          {activeTab === 'intensidade' && (
            <>
              <Chart
                values={hslSaturations}
                title="Distribuição de Saturação HSL"
                label="Quantidade"
                colorSpace="hsl"
                metric="saturation"
                xTitle="Saturação"
                onBarClick={handleBarClick}
              />
              <Chart
                values={lchChromas}
                title="Distribuição de Croma LCH"
                label="Quantidade"
                colorSpace="lch"
                metric="chroma"
                xTitle="Croma"
                onBarClick={handleBarClick}
              />
              <ScatterChart
                points={scatterPoints}
                title="Correlação entre Saturação e Croma"
                xTitle="Saturação"
                yTitle="Croma"
                onPointClick={handlePointClick}
              />
            </>
          )}
        </div>
        <div className="images-section">
          {filteredData.map((item, index) => (
            <ImageItem key={index} data={item} activeTab={activeTab} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
