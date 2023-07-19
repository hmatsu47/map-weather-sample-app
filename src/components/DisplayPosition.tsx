import { useCallback, useEffect, useRef, useState } from 'react'
import { Map } from 'leaflet'
import { fetchWeatherData } from '../api/fetchWeatherData'

type Props = {
  map: Map | null
}

export function DisplayPosition(props: Props) {
  const map = props.map
  if (map === null) {
    return null
  }
  const [position, setPosition] = useState(() => map.getCenter())
  const [weatherCode, setWeatherCode] = useState<number | null>(null)
  const [temperature, setTemperature] = useState<number | null>(null)
  const [windSpeed, setWindSpeed] = useState<number | null>(null)
  const requestTime = useRef<number>(0)

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  useEffect(() => {
    const currentTime = new Date().getTime()
    const timeDiff = currentTime - requestTime.current
    if (timeDiff < 1000) {
      return
    }
    requestTime.current = currentTime
    const load = async () => {
      const weather = await fetchWeatherData(position)
      setWeatherCode(
        weather
          ? weather.weathercode !== undefined
            ? weather.weathercode
            : null
          : null
      )
      setTemperature(
        weather
          ? weather.temperature !== undefined
            ? weather.temperature
            : null
          : null
      )
      setWindSpeed(
        weather
          ? weather.windspeed !== undefined
            ? weather.windspeed
            : null
          : null
      )
    }
    load()
  }, [position])

  function weatherIcon(weatherCode: number) {
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

  return (
    <p>
      緯度: {position.lat.toFixed(4)}, 経度: {position.lng.toFixed(4)}, 天気:{' '}
      {weatherCode !== null ? weatherIcon(weatherCode) || '--' : '--'}, 気温:{' '}
      {temperature !== null ? temperature.toFixed(1) || '-.-' : '-.-'} ℃, 風速:{' '}
      {windSpeed !== null ? windSpeed.toFixed(1) || '-.-' : '-.-'} m/s{' '}
    </p>
  )
}
