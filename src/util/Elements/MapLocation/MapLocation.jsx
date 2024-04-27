import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import styles from "./MapLocation.module.css";
import 'leaflet/dist/leaflet.css';

import Modal from "../../UI/Modal/Modal";
import Button from '../../UI/Button/Button';

const MapLocation = (props) => {
  
  const { center, zoom } = props;

  return (
    <Modal className={styles["map-modal"]} closeModal={props.onClose}>
      <div className={styles['map-header']} >
        <h4>{props.address}</h4>
      </div>
      <div className={styles['map-container']} >
        <MapContainer 
          center={[center.lat, center.lng]} 
          style={{width:"100%", height:"100%"}} 
          zoom={zoom} 
          scrollWheelZoom={false} 
        >
          <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          />
          <Marker position={[center.lat, center.lng]}>
            <Popup className={styles['pop-up']} >
              {props.title}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className={styles['map-footer']}>
        <Button 
          type="button" 
          onClick={props.onClose} 
          className={styles['close-btn']} 
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default MapLocation;
