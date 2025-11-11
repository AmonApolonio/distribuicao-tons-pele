import type { ImageItemProps, FeatureType, MetricType } from '../types'

export function ImageItem({ data, activeFeature, activeMetric }: ImageItemProps) {
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
  
  const { hex, hsl, lch } = getColorValues(activeFeature)
  
  if (!hex || !hsl || !lch) {
    return null
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
