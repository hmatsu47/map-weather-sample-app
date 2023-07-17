import { useCallback, useEffect, useState } from 'react'
import { Map } from 'leaflet'

type Props = {
  map: Map | null
}

function DisplayPosition(props: Props) {
  const map = props.map
  if (map === null) {
    return null
  }
  const [position, setPosition] = useState(() => map.getCenter())

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
    </p>
  )
}

export default DisplayPosition
