import { useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { LatLng, Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DisplayWeather } from './DisplayWeather'
import './Map.css'

export function MainMap() {
  // 初期表示時、地図の中心を名古屋に
  const position = new LatLng(35.1815, 136.9064)
  const zoom = 13
  const [map, setMap] = useState<Map | null>(null)
  // 生成した地図のrefからsetMapできるように（生成した地図はメモ化）
  const displayMap = useMemo(
    () => (
      <MapContainer center={position} zoom={zoom} ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    []
  )

  if (!map) {
    return (
      <div>
        <p>Loading...</p>
        {displayMap}
      </div>
    )
  }
  return (
    <div>
      <DisplayWeather map={map} />
      {displayMap}
    </div>
  )
}
