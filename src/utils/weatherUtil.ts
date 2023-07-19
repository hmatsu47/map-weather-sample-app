import { Weather } from '../type'

// 気象コードから天気の絵文字に変換
export function getWeatherIcon(weatherCode: number) {
  switch (weatherCode) {
    case 0:
      return '☀'
    case 1:
      return '🌤'
    case 2:
      return '⛅'
    case 3:
      return '☁'
    case 45:
    case 48:
      return '🌫'
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 80:
    case 81:
    case 82:
      return '🌧'
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return '☔'
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return '☃'
    case 95:
    case 96:
    case 99:
      return '⛈'
    default:
      return '--'
  }
}

// 現在天気情報の指定項目を取得
export function getWeatherItem(
  weather: Weather | null,
  item: number | null | undefined
) {
  return weather ? (item !== undefined ? item : null) : null
}

const windDirectionPattern = [
  '北',
  '北北東',
  '北東',
  '東北東',
  '東',
  '東南東',
  '南東',
  '南南東',
  '南',
  '南南西',
  '南西',
  '西南西',
  '西',
  '西北西',
  '北西',
  '北北西'
]

// 風向を角度から16方位に変換
export function getWindDirectionName(windDirection: number) {
  if (windDirection < 0 || 360 <= windDirection) {
    return ''
  }
  if (windDirection === 0) {
    // 0は無風を表す（真北の風は360）
    return '無風'
  }
  const windDirectionCode = Math.floor(
    (windDirection < 360 - 11.25
      ? windDirection + 11.25
      : windDirection - (360 - 11.25)) / 22.5
  )
  return windDirectionPattern[windDirectionCode]
}
