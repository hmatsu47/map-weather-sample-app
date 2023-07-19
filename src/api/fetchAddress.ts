import { getApiData } from './apiHandler'
import { LatLng } from 'leaflet'
import { Address } from '../type'

export const fetchAddress = async (position: LatLng) => {
  const load = async (position: LatLng): Promise<string> => {
    const data: Address = await getApiData(
      `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${position.lat}&lon=${position.lng}`
    )
    const result = data as Address
    const address = `${result.results.muniCd}（${result.results.lv01Nm}）`
    return address
  }
  return load(position)
}
