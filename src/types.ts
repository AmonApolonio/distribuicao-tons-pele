export interface ColorData {
  [key: string]: string | [number, number, number]
}

export interface SkinToneData {
  input: {
    filename: string
    colors: {
      skin?: string
      skin_hex?: string
      skin_hsl?: [number, number, number]
      skin_lch?: [number, number, number]
      mouth?: string
      mouth_hex?: string
      mouth_hsl?: [number, number, number]
      mouth_lch?: [number, number, number]
      hair?: string
      hair_hex?: string
      hair_hsl?: [number, number, number]
      hair_lch?: [number, number, number]
      iris?: string
      iris_hex?: string
      iris_hsl?: [number, number, number]
      iris_lch?: [number, number, number]
      mouth_contour?: string
      mouth_contour_hex?: string
      mouth_contour_hsl?: [number, number, number]
      mouth_contour_lch?: [number, number, number]
      under_eye_skin?: string
      under_eye_skin_hex?: string
      under_eye_skin_hsl?: [number, number, number]
      under_eye_skin_lch?: [number, number, number]
    }
  }
}

export type FeatureType = 'skin' | 'mouth' | 'hair' | 'iris' | 'mouth_contour' | 'under_eye_skin'
export type MetricType = 'temperatura' | 'intensidade' | 'luminosidade'
export type ColorSpace = 'hsl' | 'lch'
export type MetricKey = 'hue' | 'saturation' | 'chroma' | 'lightness'
export type ContrastType = 'skin_hair' | 'skin_iris' | 'mouth_contour' | 'skin_undereye'
export type ViewMode = 'normal' | 'contrast'

export interface ChartProps {
  values: number[]
  title: string
  label: string
  colorSpace: ColorSpace
  metric: MetricKey
  xTitle: string
  onBarClick: (bin: number, metric: MetricKey, colorSpace: ColorSpace) => void
}

export interface ScatterChartProps {
  points: { x: number; y: number }[]
  title: string
  xTitle: string
  yTitle: string
  onPointClick: (index: number) => void
}

export interface ImageItemProps {
  data: SkinToneData
  activeFeature: FeatureType
  activeMetric: MetricType
  viewMode: ViewMode
  contrastType?: ContrastType
}

export interface TabContentProps {
  filteredData: SkinToneData[]
  activeFeature: FeatureType
  activeMetric: MetricType
  onBarClick: (bin: number, metric: MetricKey, colorSpace: ColorSpace) => void
  onPointClick: (index: number) => void
}

export interface ContrastTabContentProps {
  filteredData: SkinToneData[]
  contrastType: ContrastType
  onBarClick: (bin: number, metric: MetricKey, colorSpace: ColorSpace) => void
  onPointClick: (index: number) => void
}
