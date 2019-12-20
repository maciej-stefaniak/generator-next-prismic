import React from 'react'
import { GoogleMap as GMap, LoadScript, Marker } from '@react-google-maps/api'

import { GOOGLE_MAPS_KEY, GOOGLE_MAPS_STYLES } from '../../constants/'

import './styles.scss'

type TGoogleMapProps = {
  gpsPosition: {
    latitude: number
    longitude: number
  }
  markerIcon?: string
}

const GoogleMap = ({
    gpsPosition: { latitude, longitude },
    markerIcon
}: TGoogleMapProps) => {
  return (
    <div className="GoogleMap">
      <div className="GoogleMap-map">
        <LoadScript
          id="script-loader"
          googleMapsApiKey={GOOGLE_MAPS_KEY}
          loadingElement={<span />}
        >
          <GMap
            id="GoogleMap-map"
            zoom={12}
            options={{
              disableDefaultUI: true,
              styles: JSON.parse(GOOGLE_MAPS_STYLES)
            }}
            center={{
              lat: latitude,
              lng: longitude
            }}
          >
            
            {markerIcon && <Marker
              position={{
                lat: latitude,
                lng: longitude
              }}
              icon={markerIcon}
              zIndex={999}
            />}
          </GMap>
        </LoadScript>
      </div>
    </div>
  )
}

export default GoogleMap
