import { Chart, ScatterChart } from './Chart'
import type { ContrastTabContentProps } from '../types'
import { calculateContrast } from '../utils/contrast'

export function ContrastTabContent({
  filteredData,
  contrastType,
  onBarClick,
  onPointClick
}: ContrastTabContentProps) {
  
  // Get the two features to compare
  let feature1: string, feature2: string, featureLabel: string
  
  if (contrastType === 'skin_hair') {
    feature1 = 'skin'
    feature2 = 'hair'
    featureLabel = 'Pele x Cabelo'
  } else if (contrastType === 'skin_iris') {
    feature1 = 'skin'
    feature2 = 'iris'
    featureLabel = 'Pele x Íris'
  } else if (contrastType === 'mouth_contour') {
    feature1 = 'mouth'
    feature2 = 'mouth_contour'
    featureLabel = 'Boca x Contorno da Boca'
  } else {
    feature1 = 'skin'
    feature2 = 'under_eye_skin'
    featureLabel = 'Pele x Cavidade Ocular'
  }
  
  // Calculate luminosity contrast values for all items
  const contrastValues = filteredData
    .filter(item => {
      const colors = item.input.colors as any
      const hsl1Key = `${feature1}_hsl`
      const lch1Key = `${feature1}_lch`
      const hsl2Key = `${feature2}_hsl`
      const lch2Key = `${feature2}_lch`
      
      return colors[hsl1Key] && colors[lch1Key] && colors[hsl2Key] && colors[lch2Key]
    })
    .map(item => {
      const colors = item.input.colors as any
      const hsl1 = colors[`${feature1}_hsl`] as [number, number, number]
      const lch1 = colors[`${feature1}_lch`] as [number, number, number]
      const hsl2 = colors[`${feature2}_hsl`] as [number, number, number]
      const lch2 = colors[`${feature2}_lch`] as [number, number, number]
      
      return calculateContrast(hsl1, lch1, hsl2, lch2, 'lightness')
    })
  
  // luminosidade
  const hslLightnessContrasts = contrastValues.map(v => v.hslContrast)
  const lchLightnessContrasts = contrastValues.map(v => v.lchContrast)
  const contrastScatterPoints = hslLightnessContrasts.map((l, i) => ({ x: l, y: lchLightnessContrasts[i] }))
  
  return (
    <>
      <Chart
        values={hslLightnessContrasts}
        title={`Distribuição de Contraste de Luminosidade HSL - ${featureLabel}`}
        label="Quantidade"
        colorSpace="hsl"
        metric="lightness"
        xTitle="Contraste de Luminosidade"
        onBarClick={onBarClick}
      />
      <Chart
        values={lchLightnessContrasts}
        title={`Distribuição de Contraste de Luminosidade LCH - ${featureLabel}`}
        label="Quantidade"
        colorSpace="lch"
        metric="lightness"
        xTitle="Contraste de Luminosidade"
        onBarClick={onBarClick}
      />
      <ScatterChart
        points={contrastScatterPoints}
        title={`Correlação entre Contraste de Luminosidade HSL e LCH - ${featureLabel}`}
        xTitle="Contraste Luminosidade HSL"
        yTitle="Contraste Luminosidade LCH"
        onPointClick={onPointClick}
      />
    </>
  )
}
