import { useCallback, useEffect, useRef, useState } from 'react'
import { LatLng, Map } from 'leaflet'
import { fetchAddress } from '../api/fetchAddress'
import { fetchWeatherData } from '../api/fetchWeatherData'
import {
  getWeatherIcon,
  getWeatherItem,
  getWindDirectionName
} from '../utils/weatherUtil'

type Props = {
  map: Map | null
}

export function DisplayPosition(props: Props) {
  const map = props.map
  if (map === null) {
    // 地図未表示→処理しない
    return null
  }
  // 地図の中心座標（緯度・軽度）
  const [position, setPosition] = useState(() => map.getCenter())
  // 現在地の住所
  const [address, setAddress] = useState<string | null>(null)
  // 現在天気の表示項目
  const [weatherCode, setWeatherCode] = useState<number | null>(null)
  const [temperature, setTemperature] = useState<number | null>(null)
  const [windSpeed, setWindSpeed] = useState<number | null>(null)
  const [windDirection, setWindDirection] = useState<number | null>(null)
  const requestTime = useRef<number>(0)
  // 地図のドラッグ／移動完了時に地図の中心座標を更新
  const onMoveEnd = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])
  // 地図のドラッグ／移動完了イベントに対する呼び出しをセット／アンセット
  useEffect(() => {
    map.on('moveend', onMoveEnd)
    return () => {
      map.off('moveend', onMoveEnd)
    }
  }, [map, onMoveEnd])
  // 地図の中心座標が変更されたらその場所の住所を国土地理院のAPIで取得し、現在の天気をOpen-MeteoのAPIで取得
  useEffect(() => {
    const currentTime = new Date().getTime()
    const timeDiff = currentTime - requestTime.current
    if (timeDiff < 1000) {
      // 前回のAPI呼び出しから1秒経過していなければAPI呼び出しをやめる（APIリクエスト負荷対策）
      return
    }
    requestTime.current = currentTime
    const addressLoad = async () => {
      const address = await fetchAddress(position)
      setAddress(address)
    }
    addressLoad()
    const weatherLoad = async () => {
      const weather = await fetchWeatherData(position)
      setWeatherCode(getWeatherItem(weather, weather?.weathercode))
      setTemperature(getWeatherItem(weather, weather?.temperature))
      setWindSpeed(getWeatherItem(weather, weather?.windspeed))
      setWindDirection(getWeatherItem(weather, weather?.winddirection))
    }
    weatherLoad()
  }, [position])
  // ブラウザから取得した現在位置に地図の中心を移動
  function moveToCurrentPosition() {
    if (!('geolocation' in navigator) || !map) {
      // ブラウザから位置情報が取得できなければ何もしない
      return
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      const latLng = new LatLng(latitude, longitude)
      setPosition(latLng)
      map.panTo(latLng)
    })
  }

  return (
    <p>
      緯度: {position.lat.toFixed(4)}, 経度: {position.lng.toFixed(4)},{' '}
      {address !== null ? `${address}の` : ''}天気:{' '}
      {weatherCode !== null ? getWeatherIcon(weatherCode) || '--' : '--'}, 気温:{' '}
      {temperature !== null ? temperature.toFixed(1) || '-.-' : '-.-'} ℃, 風:{' '}
      {windDirection !== null ? getWindDirectionName(windDirection) : ''}{' '}
      {windSpeed !== null ? windSpeed.toFixed(1) || '-.-' : '-.-'} m/s{' '}
      <input
        type="button"
        value={'現在地へ移動'}
        onClick={moveToCurrentPosition}
      />
    </p>
  )
}
