import { useState, useEffect } from 'react'
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
import { TabContent } from './components/TabContent'
import { ImageItem } from './components/ImageItem'
import type { SkinToneData, FeatureType, MetricType, MetricKey, ColorSpace } from './types'
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

function App() {
  const [allData, setAllData] = useState<SkinToneData[]>([])
  const [filteredData, setFilteredData] = useState<SkinToneData[]>([])
  const [filterText, setFilterText] = useState('')
  const [activeFeature, setActiveFeature] = useState<FeatureType>('skin')
  const [activeMetric, setActiveMetric] = useState<MetricType>('temperatura')

  useEffect(() => {
    fetch('/processed.json')
      .then(response => response.json())
      .then(data => {
        setAllData(data)
        setFilteredData(data)
      })
      .catch(error => console.error('Error loading data:', error))
  }, [])

  const handleBarClick = (bin: number, metric: MetricKey, colorSpace: ColorSpace) => {
    const hslKey = `${activeFeature}_hsl` as const
    const lchKey = `${activeFeature}_lch` as const
    
    const filtered = allData.filter(item => {
      const colors = item.input.colors
      const hsl = colors[hslKey] as [number, number, number] | undefined
      const lch = colors[lchKey] as [number, number, number] | undefined
      
      if (!hsl || !lch) return false
      
      let value: number
      if (metric === 'hue') {
        value = colorSpace === 'hsl' ? hsl[0] * 360 : lch[2]
      } else if (metric === 'saturation') {
        value = hsl[1] * 100
      } else if (metric === 'chroma') {
        value = lch[1]
      } else { // lightness
        value = colorSpace === 'hsl' ? hsl[2] * 100 : lch[0]
      }
      return Math.round(value) === bin
    })
    
    setFilteredData(filtered)
    const metricName = metric === 'hue' ? 'tom' : metric === 'saturation' ? 'saturação' : metric === 'chroma' ? 'croma' : 'luminosidade'
    const unit = metric === 'hue' ? '°' : ''
    const featureName = { skin: 'Pele', mouth: 'Boca', hair: 'Cabelo', iris: 'Íris' }[activeFeature]
    setFilterText(`Filtrado por ${metricName} ${bin}${unit} (${colorSpace.toUpperCase()}) - ${featureName}`)
  }

  const handlePointClick = (index: number) => {
    const item = filteredData[index]
    setFilteredData([item])
    setFilterText(`Filtrado por ponto: ${item.input.filename}`)
  }

  const resetFilter = () => {
    setFilteredData(allData)
    setFilterText('')
  }

  const handleFeatureChange = (feature: FeatureType) => {
    setActiveFeature(feature)
    resetFilter()
  }

  const handleMetricChange = (metric: MetricType) => {
    setActiveMetric(metric)
    resetFilter()
  }

  return (
    <div className="container">
      <h1>Visualizador de Cores de Imagens{filterText && ` - ${filterText}`}</h1>
      
      <div className="controls">
        <div className="tabs feature-tabs">
          <button 
            onClick={() => handleFeatureChange('skin')} 
            className={activeFeature === 'skin' ? 'active' : ''}
          >
            Pele
          </button>
          <button 
            onClick={() => handleFeatureChange('mouth')} 
            className={activeFeature === 'mouth' ? 'active' : ''}
          >
            Boca
          </button>
          <button 
            onClick={() => handleFeatureChange('hair')} 
            className={activeFeature === 'hair' ? 'active' : ''}
          >
            Cabelo
          </button>
          <button 
            onClick={() => handleFeatureChange('iris')} 
            className={activeFeature === 'iris' ? 'active' : ''}
          >
            Íris
          </button>
        </div>
        
        <div className="tabs metric-tabs">
          <button 
            onClick={() => handleMetricChange('temperatura')} 
            className={activeMetric === 'temperatura' ? 'active' : ''}
          >
            Temperatura
          </button>
          <button 
            onClick={() => handleMetricChange('intensidade')} 
            className={activeMetric === 'intensidade' ? 'active' : ''}
          >
            Intensidade
          </button>
          <button 
            onClick={() => handleMetricChange('luminosidade')} 
            className={activeMetric === 'luminosidade' ? 'active' : ''}
          >
            Luminosidade
          </button>
        </div>

        {filterText && (
          <button className="reset-btn" onClick={resetFilter}>
            Mostrar Todas as Imagens
          </button>
        )}
      </div>

      <div className="main-layout">
        <div className="charts-section">
          <TabContent
            filteredData={filteredData}
            activeFeature={activeFeature}
            activeMetric={activeMetric}
            onBarClick={handleBarClick}
            onPointClick={handlePointClick}
          />
        </div>
        <div className="images-section">
          {filteredData.map((item, index) => (
            <ImageItem 
              key={index} 
              data={item} 
              activeFeature={activeFeature}
              activeMetric={activeMetric}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
