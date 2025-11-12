export interface ContrastValues {
  hslContrast: number
  lchContrast: number
}

// Calculate the absolute difference between two hue values (handling circular nature of hue)
export function calculateHueContrast(hue1: number, hue2: number): number {
  const diff = Math.abs(hue1 - hue2)
  return Math.min(diff, 360 - diff)
}

// Calculate contrast between two color features
export function calculateContrast(
  color1_hsl: [number, number, number],
  color1_lch: [number, number, number],
  color2_hsl: [number, number, number],
  color2_lch: [number, number, number],
  metric: 'hue' | 'saturation' | 'chroma' | 'lightness'
): ContrastValues {
  let hslContrast: number
  let lchContrast: number

  if (metric === 'hue') {
    // For hue, calculate circular difference
    hslContrast = calculateHueContrast(color1_hsl[0] * 360, color2_hsl[0] * 360)
    lchContrast = calculateHueContrast(color1_lch[2], color2_lch[2])
  } else if (metric === 'saturation') {
    // For saturation (HSL) vs chroma (LCH)
    hslContrast = Math.abs(color1_hsl[1] * 100 - color2_hsl[1] * 100)
    lchContrast = Math.abs(color1_lch[1] - color2_lch[1])
  } else if (metric === 'chroma') {
    // For chroma (only in LCH)
    hslContrast = Math.abs(color1_hsl[1] * 100 - color2_hsl[1] * 100)
    lchContrast = Math.abs(color1_lch[1] - color2_lch[1])
  } else {
    // For lightness
    hslContrast = Math.abs(color1_hsl[2] * 100 - color2_hsl[2] * 100)
    lchContrast = Math.abs(color1_lch[0] - color2_lch[0])
  }

  return { hslContrast, lchContrast }
}
