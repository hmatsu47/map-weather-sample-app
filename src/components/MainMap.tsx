import { useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { LatLngTuple, Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import './Map.css'
import { DisplayPosition } from './DisplayPosition'
import { useDidMount } from 'rooks'

export function MainMap() {
  const [position, setPosition] = useState<LatLngTuple | null>(null)
  const zoom = 13
  const [map, setMap] = useState<Map | null>(null)

  useDidMount(() => {
    if (!('geolocation' in navigator)) {
      // ブラウザで位置情報が使えない場合は名古屋が中心
      setPosition([35.1815, 136.9064])
      return
    }
    // ブラウザの位置情報を地図の中心とする
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      setPosition([latitude, longitude])
    })
  })

  const displayMap = useMemo(
    () =>
      // 地図の中心がセットされていれば地図を表示
      position ? (
        <MapContainer center={position} zoom={zoom} ref={setMap}>
          <TileLayer
            attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
            url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
          />
        </MapContainer>
      ) : (
        ''
      ),
    [position]
  )

  return (
    <div>
      {map ? <DisplayPosition map={map} /> : ''}
      {displayMap}
    </div>
  )
}
