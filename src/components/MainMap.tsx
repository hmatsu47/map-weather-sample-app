import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Marker as LeafletMarker, DivIcon, LatLng, Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DisplayWeather } from './DisplayWeather'
import './Map.css'

export function MainMap() {
  // 初期表示時、地図の中心を名古屋に
  const position = new LatLng(35.1815, 136.9064)
  const zoom = 13
  const [map, setMap] = useState<Map | null>(null)
  // 地図の中心（十字マーク）
  const [mark, setMark] = useState<LeafletMarker<DivIcon> | null>(null)
  const cross = new DivIcon({ className: 'cross', bgPos: [18, 18] })
  // 生成した地図のrefからsetMapできるように（生成した地図はメモ化）
  const displayMap = useMemo(
    () => (
      <MapContainer center={position} zoom={zoom} ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          icon={cross}
          zIndexOffset={100}
          interactive={true}
          ref={setMark}
        />
      </MapContainer>
    ),
    []
  )
  // 十字マークを地図の中心に表示し続ける
  useEffect(() => {
    if (!map || !mark) {
      return
    }
    map.on('move', function () {
      // mousemoveイベントでマーカを移動
      mark.setLatLng(map.getCenter())
    })
  }, [map])

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
