import type { ImageItemProps, FeatureType, MetricType } from '../types'

export function ImageItem({ data, activeFeature, activeMetric, viewMode, contrastType }: ImageItemProps) {
  const { filename, colors } = data.input
  
  // Get the color values based on active feature
  const getColorValues = (feature: FeatureType) => {
    const hexKey = `${feature}_hex` as keyof typeof colors
    const hslKey = `${feature}_hsl` as keyof typeof colors
    const lchKey = `${feature}_lch` as keyof typeof colors
    
    const hex = (colors[hexKey] || colors[feature]) as string | undefined
    const hsl = colors[hslKey] as [number, number, number] | undefined
    const lch = colors[lchKey] as [number, number, number] | undefined
    
    return { hex, hsl, lch }
  }
  
  const getMetricValue = (metric: MetricType, hsl: [number, number, number], lch: [number, number, number]) => {
    if (metric === 'temperatura') {
      return {
        hsl: (hsl[0] * 360).toFixed(2) + '°',
        lch: lch[2].toFixed(2) + '°'
      }
    } else if (metric === 'intensidade') {
      return {
        hsl: (hsl[1] * 100).toFixed(2),
        lch: lch[1].toFixed(2)
      }
    } else { // luminosidade
      return {
        hsl: (hsl[2] * 100).toFixed(2),
        lch: lch[0].toFixed(2)
      }
    }
  }
  
  // Contrast mode: show two colors side by side
  if (viewMode === 'contrast' && contrastType) {
    let feature1: FeatureType, feature2: FeatureType, featureLabel1: string, featureLabel2: string
    
    if (contrastType === 'skin_hair') {
      feature1 = 'skin'
      feature2 = 'hair'
      featureLabel1 = 'Pele'
      featureLabel2 = 'Cabelo'
    } else if (contrastType === 'skin_iris') {
      feature1 = 'skin'
      feature2 = 'iris'
      featureLabel1 = 'Pele'
      featureLabel2 = 'Íris'
    } else if (contrastType === 'mouth_contour') {
      feature1 = 'mouth'
      feature2 = 'mouth_contour'
      featureLabel1 = 'Boca'
      featureLabel2 = 'Contorno'
    } else {
      feature1 = 'skin'
      feature2 = 'under_eye_skin'
      featureLabel1 = 'Pele'
      featureLabel2 = 'Cavidade'
    }
    
    const color1 = getColorValues(feature1)
    const color2 = getColorValues(feature2)
    
    if (!color1.hex || !color1.hsl || !color1.lch || !color2.hex || !color2.hsl || !color2.lch) {
      return null
    }
    
    const metricValues1 = getMetricValue(activeMetric, color1.hsl, color1.lch)
    const metricValues2 = getMetricValue(activeMetric, color2.hsl, color2.lch)
    
    return (
      <div className="item contrast-item">
        <div className="filename">{filename}</div>
        <div className="image-container">
          <img src={`/files/${filename}`} alt={filename} />
        </div>
        <div className="contrast-colors">
          <div className="color-section">
            <div className="color-label">{featureLabel1}</div>
            <div
              className="color-swatch"
              style={{ backgroundColor: color1.hex }}
            />
            <div className="color-values">
              <div>HSL: {metricValues1.hsl}</div>
              <div>LCH: {metricValues1.lch}</div>
            </div>
          </div>
          <div className="color-section">
            <div className="color-label">{featureLabel2}</div>
            <div
              className="color-swatch"
              style={{ backgroundColor: color2.hex }}
            />
            <div className="color-values">
              <div>HSL: {metricValues2.hsl}</div>
              <div>LCH: {metricValues2.lch}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Normal mode: show single color
  const { hex, hsl, lch } = getColorValues(activeFeature)
  
  if (!hex || !hsl || !lch) {
    return null
  }
  
  const metricValues = getMetricValue(activeMetric, hsl, lch)
  
  const tooltip = `Hex: ${hex}\nHSL: ${(hsl[0] * 360).toFixed(2)}°\nLCH: ${lch[2].toFixed(2)}°`

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
            style={{ backgroundColor: hex }}
          />
          <div className="color-values">
            <div>HSL: {metricValues.hsl}</div>
            <div>LCH: {metricValues.lch}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
