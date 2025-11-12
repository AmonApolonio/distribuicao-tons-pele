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
import { ContrastTabContent } from './components/ContrastTabContent'
import { ImageItem } from './components/ImageItem'
import type { SkinToneData, FeatureType, MetricType, MetricKey, ColorSpace, ViewMode, ContrastType } from './types'
import { calculateContrast } from './utils/contrast'
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
  const [viewMode, setViewMode] = useState<ViewMode>('normal')
  const [contrastType, setContrastType] = useState<ContrastType>('skin_hair')

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
    if (viewMode === 'contrast') {
      // Filter by contrast values
      let feature1: string, feature2: string, contrastLabel: string
      
      if (contrastType === 'skin_hair') {
        feature1 = 'skin'
        feature2 = 'hair'
        contrastLabel = 'Pele x Cabelo'
      } else if (contrastType === 'skin_iris') {
        feature1 = 'skin'
        feature2 = 'iris'
        contrastLabel = 'Pele x Íris'
      } else if (contrastType === 'mouth_contour') {
        feature1 = 'mouth'
        feature2 = 'mouth_contour'
        contrastLabel = 'Boca x Contorno da Boca'
      } else {
        feature1 = 'skin'
        feature2 = 'under_eye_skin'
        contrastLabel = 'Pele x Cavidade Ocular'
      }
      
      const filtered = allData.filter(item => {
        const colors = item.input.colors as any
        const hsl1 = colors[`${feature1}_hsl`] as [number, number, number] | undefined
        const lch1 = colors[`${feature1}_lch`] as [number, number, number] | undefined
        const hsl2 = colors[`${feature2}_hsl`] as [number, number, number] | undefined
        const lch2 = colors[`${feature2}_lch`] as [number, number, number] | undefined
        
        if (!hsl1 || !lch1 || !hsl2 || !lch2) return false
        
        const contrast = calculateContrast(hsl1, lch1, hsl2, lch2, metric)
        const value = colorSpace === 'hsl' ? contrast.hslContrast : contrast.lchContrast
        return Math.round(value) === bin
      })
      
      setFilteredData(filtered)
      const metricName = metric === 'hue' ? 'tom' : metric === 'saturation' ? 'saturação' : metric === 'chroma' ? 'croma' : 'luminosidade'
      const unit = metric === 'hue' ? '°' : ''
      setFilterText(`Filtrado por contraste de ${metricName} ${bin}${unit} (${colorSpace.toUpperCase()}) - ${contrastLabel}`)
    } else {
      // Normal filtering
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
      const featureName = { 
        skin: 'Pele', 
        mouth: 'Boca', 
        hair: 'Cabelo', 
        iris: 'Íris',
        mouth_contour: 'Contorno da Boca',
        under_eye_skin: 'Cavidade Ocular'
      }[activeFeature]
      setFilterText(`Filtrado por ${metricName} ${bin}${unit} (${colorSpace.toUpperCase()}) - ${featureName}`)
    }
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
        {viewMode === 'normal' ? (
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
        ) : (
          <div className="tabs feature-tabs">
            <button 
              onClick={() => setContrastType('skin_hair')} 
              className={contrastType === 'skin_hair' ? 'active' : ''}
            >
              Pele x Cabelo
            </button>
            <button 
              onClick={() => setContrastType('skin_iris')} 
              className={contrastType === 'skin_iris' ? 'active' : ''}
            >
              Pele x Íris
            </button>
            <button 
              onClick={() => setContrastType('mouth_contour')} 
              className={contrastType === 'mouth_contour' ? 'active' : ''}
            >
              Boca x Contorno da Boca
            </button>
            <button 
              onClick={() => setContrastType('skin_undereye')} 
              className={contrastType === 'skin_undereye' ? 'active' : ''}
            >
              Pele x Cavidade Ocular
            </button>
          </div>
        )}
        
        {viewMode === 'normal' ? (
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
        ) : (
          <div className="tabs metric-tabs">
            <button 
              onClick={() => handleMetricChange('luminosidade')} 
              className="active"
            >
              Profundidade
            </button>
          </div>
        )}

        <div className="tabs metric-tabs">
          <button 
            onClick={() => { setViewMode('normal'); resetFilter(); }} 
            className={viewMode === 'normal' ? 'active' : ''}
          >
            Normal
          </button>
          <button 
            onClick={() => { 
              setViewMode('contrast'); 
              setActiveMetric('luminosidade');
              resetFilter(); 
            }} 
            className={viewMode === 'contrast' ? 'active' : ''}
          >
            Contraste
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
          {viewMode === 'normal' ? (
            <TabContent
              filteredData={filteredData}
              activeFeature={activeFeature}
              activeMetric={activeMetric}
              onBarClick={handleBarClick}
              onPointClick={handlePointClick}
            />
          ) : (
            <ContrastTabContent
              filteredData={filteredData}
              contrastType={contrastType}
              onBarClick={handleBarClick}
              onPointClick={handlePointClick}
            />
          )}
        </div>
        <div className="images-section">
          {filteredData.map((item, index) => (
            <ImageItem 
              key={index} 
              data={item} 
              activeFeature={activeFeature}
              activeMetric={activeMetric}
              viewMode={viewMode}
              contrastType={contrastType}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
