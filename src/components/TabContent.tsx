import { Chart, ScatterChart } from './Chart'
import type { TabContentProps, FeatureType } from '../types'

export function TabContent({ 
  filteredData, 
  activeFeature, 
  activeMetric, 
  onBarClick, 
  onPointClick 
}: TabContentProps) {
  
  // Helper function to get color values for a specific feature
  const getFeatureValues = (feature: FeatureType) => {
    const hslKey = `${feature}_hsl` as const
    const lchKey = `${feature}_lch` as const
    
    return filteredData
      .filter(item => item.input.colors[hslKey] && item.input.colors[lchKey])
      .map(item => ({
        hsl: item.input.colors[hslKey] as [number, number, number],
        lch: item.input.colors[lchKey] as [number, number, number]
      }))
  }
  
  const values = getFeatureValues(activeFeature)
  
  if (activeMetric === 'temperatura') {
    const hslHues = values.map(v => v.hsl[0] * 360)
    const lchHues = values.map(v => v.lch[2])
    const hueScatterPoints = hslHues.map((h, i) => ({ x: h, y: lchHues[i] }))
    
    const featureLabel = {
      skin: 'Pele',
      mouth: 'Boca',
      hair: 'Cabelo',
      iris: 'Íris',
      mouth_contour: 'Contorno da Boca',
      under_eye_skin: 'Cavidade Ocular'
    }[activeFeature]
    
    return (
      <>
        <Chart
          values={hslHues}
          title={`Distribuição de Tons HSL - ${featureLabel}`}
          label="Quantidade"
          colorSpace="hsl"
          metric="hue"
          xTitle="Tom (°)"
          onBarClick={onBarClick}
        />
        <Chart
          values={lchHues}
          title={`Distribuição de Tons LCH - ${featureLabel}`}
          label="Quantidade"
          colorSpace="lch"
          metric="hue"
          xTitle="Tom (°)"
          onBarClick={onBarClick}
        />
        <ScatterChart
          points={hueScatterPoints}
          title={`Correlação entre Tom HSL e Tom LCH - ${featureLabel}`}
          xTitle="Tom HSL (°)"
          yTitle="Tom LCH (°)"
          onPointClick={onPointClick}
        />
      </>
    )
  }
  
  if (activeMetric === 'intensidade') {
    const hslSaturations = values.map(v => v.hsl[1] * 100)
    const lchChromas = values.map(v => v.lch[1])
    const scatterPoints = hslSaturations.map((sat, i) => ({ x: sat, y: lchChromas[i] }))
    
    const featureLabel = {
      skin: 'Pele',
      mouth: 'Boca',
      hair: 'Cabelo',
      iris: 'Íris',
      mouth_contour: 'Contorno da Boca',
      under_eye_skin: 'Cavidade Ocular'
    }[activeFeature]
    
    return (
      <>
        <Chart
          values={hslSaturations}
          title={`Distribuição de Saturação HSL - ${featureLabel}`}
          label="Quantidade"
          colorSpace="hsl"
          metric="saturation"
          xTitle="Saturação"
          onBarClick={onBarClick}
        />
        <Chart
          values={lchChromas}
          title={`Distribuição de Croma LCH - ${featureLabel}`}
          label="Quantidade"
          colorSpace="lch"
          metric="chroma"
          xTitle="Croma"
          onBarClick={onBarClick}
        />
        <ScatterChart
          points={scatterPoints}
          title={`Correlação entre Saturação e Croma - ${featureLabel}`}
          xTitle="Saturação"
          yTitle="Croma"
          onPointClick={onPointClick}
        />
      </>
    )
  }
  
  // luminosidade
  const hslLightness = values.map(v => v.hsl[2] * 100)
  const lchLightness = values.map(v => v.lch[0])
  const lightnessScatterPoints = hslLightness.map((l, i) => ({ x: l, y: lchLightness[i] }))
  
  const featureLabel = {
    skin: 'Pele',
    mouth: 'Boca',
    hair: 'Cabelo',
    iris: 'Íris',
    mouth_contour: 'Contorno da Boca',
    under_eye_skin: 'Cavidade Ocular'
  }[activeFeature]
  
  return (
    <>
      <Chart
        values={hslLightness}
        title={`Distribuição de Luminosidade HSL - ${featureLabel}`}
        label="Quantidade"
        colorSpace="hsl"
        metric="lightness"
        xTitle="Luminosidade"
        onBarClick={onBarClick}
      />
      <Chart
        values={lchLightness}
        title={`Distribuição de Luminosidade LCH - ${featureLabel}`}
        label="Quantidade"
        colorSpace="lch"
        metric="lightness"
        xTitle="Luminosidade"
        onBarClick={onBarClick}
      />
      <ScatterChart
        points={lightnessScatterPoints}
        title={`Correlação entre Luminosidade HSL e LCH - ${featureLabel}`}
        xTitle="Luminosidade HSL"
        yTitle="Luminosidade LCH"
        onPointClick={onPointClick}
      />
    </>
  )
}
