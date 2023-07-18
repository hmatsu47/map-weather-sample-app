import { useCallback, useEffect, useRef, useState } from 'react'
import { Map } from 'leaflet'
import { getApiData } from '../api/apiHandler'

type Props = {
  map: Map | null
}

type CurrentWeather = {
  temperature?: number
  windspeed?: number
  winddirection?: number
  weathercode?: number
  time?: string
}
type Result = {
  latitude?: number
  longitude?: number
  generationtime_ms?: number
  utc_offset_seconds?: number
  timezone?: string
  timezone_abbreviation?: string
  elevation?: string
  current_weather?: CurrentWeather
  error?: boolean
  reason?: string
}

export function DisplayPosition(props: Props) {
  const map = props.map
  if (map === null) {
    return null
  }
  const [position, setPosition] = useState(() => map.getCenter())
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
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
    const load = async (): Promise<void> => {
      const data: Result = await getApiData(
        `https://api.open-meteo.com/v1/forecast?latitude=${position.lat}&longitude=${position.lng}&current_weather=true`
      )
      setWeather((data as Result).current_weather as CurrentWeather)
    }
    void load()
  }, [position])

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)},
      weather_code: {weather ? weather.weathercode || '--' : '--'}, temperature:{' '}
      {weather ? weather.temperature || '--' : '--'}, wind_speed:{' '}
      {weather ? weather.windspeed || '--' : '--'}{' '}
    </p>
  )
}
