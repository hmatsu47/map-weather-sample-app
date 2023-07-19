import { useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { LatLng, Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DisplayPosition } from './DisplayPosition'
import './Map.css'

export function MainMap() {
  // 地図の中心を名古屋に
  const position = new LatLng(35.1815, 136.9064)
  const zoom = 13
  const [map, setMap] = useState<Map | null>(null)

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

  return (
    <div>
      {map ? <DisplayPosition map={map} /> : ''}
      {displayMap}
    </div>
  )
}
