import { getApiData } from '../api/apiHandler'
import { LatLng } from 'leaflet'
import { Weather, Result } from '../type'

export const fetchWeatherData = async (position: LatLng) => {
  const load = async (position: LatLng): Promise<Weather | null> => {
    const data: Result = await getApiData(
      `https://api.open-meteo.com/v1/forecast?latitude=${position.lat}&longitude=${position.lng}&current_weather=true&windspeed_unit=ms`
    )
    const result = data as Result
    const weather = result
      ? result.current_weather
        ? (result.current_weather as Weather)
        : null
      : null
    return weather
  }
  return load(position)
}
