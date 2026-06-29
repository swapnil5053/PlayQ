import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Gamepad2 } from 'lucide-react';
import { MOCK_ZONES, getGameById } from '../../data/mockGames';
import { useAppStore } from '../../store/useAppStore';
import WaitBadge from '../../components/ui/WaitBadge/WaitBadge.jsx';
import BottomSheet from '../../components/ui/BottomSheet/BottomSheet.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import ScreenHeader from '../../components/ui/ScreenHeader/ScreenHeader.jsx';
import styles from './MapScreen.module.css';
import 'leaflet/dist/leaflet.css';

const CENTER = [12.9716, 77.5946];

const CROWD_COLOR = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };
const CROWD_LABEL = { low: 'Low crowd', medium: 'Medium crowd', high: 'High crowd' };

function machineIcon(crowd) {
  const innerClass = crowd === 'high' ? `${styles.markerInner} ${styles.markerHigh}` : styles.markerInner;
  return L.divIcon({
    className: styles.markerIcon,
    html: `<div class="${innerClass}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="10" r="1"/><circle cx="18" cy="13" r="1"/></svg></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

export default function MapScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('standard');
  const [activeZone, setActiveZone] = useState(null);
  const pushToast = useAppStore((s) => s.pushToast);
  const icons = useMemo(
    () => ({
      low: machineIcon('low'),
      medium: machineIcon('medium'),
      high: machineIcon('high'),
    }),
    []
  );

  return (
    <div className={styles.screen}>
      <ScreenHeader
        title="Arcade Map"
        showBack
        right={
          <button className={styles.toggle} onClick={() => setMode(mode === 'standard' ? 'heat' : 'standard')}>
            <Layers size={16} />
            {mode === 'standard' ? 'Heat Map' : 'Standard View'}
          </button>
        }
      />

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: CROWD_COLOR.low }} />
          Low
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: CROWD_COLOR.medium }} />
          Medium
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: CROWD_COLOR.high }} />
          High
        </span>
      </div>

      <div className={styles.mapWrap}>
        <MapContainer
          center={CENTER}
          zoom={17}
          minZoom={16}
          maxZoom={19}
          className={styles.map}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={20}
          />

          {mode === 'heat' &&
            MOCK_ZONES.map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={70}
                pathOptions={{ color: CROWD_COLOR[zone.crowd], fillColor: CROWD_COLOR[zone.crowd], fillOpacity: 0.35, weight: 1 }}
              />
            ))}

          {MOCK_ZONES.map((zone) => (
            <Marker
              key={zone.id}
              position={[zone.lat, zone.lng]}
              icon={icons[zone.crowd] || icons.low}
              eventHandlers={{ click: () => setActiveZone(zone) }}
            />
          ))}
        </MapContainer>
      </div>

      <BottomSheet isOpen={Boolean(activeZone)} onClose={() => setActiveZone(null)} title={activeZone?.name}>
        {activeZone && (
          <div className={styles.zoneCrowdRow}>
            <span className={styles.legendDot} style={{ background: CROWD_COLOR[activeZone.crowd] }} />
            <span className={styles.zoneCrowdLabel}>{CROWD_LABEL[activeZone.crowd] || 'Crowd level unknown'}</span>
          </div>
        )}
        {activeZone?.gameIds.map((gid) => {
          const game = getGameById(gid);
          if (!game) return null;
          return (
            <div
              key={gid}
              className={styles.zoneGame}
              onClick={() => {
                setActiveZone(null);
                navigate(`/game/${gid}`);
              }}
            >
              <div className={styles.zoneGameInfo}>
                <Gamepad2 size={16} />
                <span>{game.name}</span>
              </div>
              <WaitBadge minutes={game.waitTime} compact />
            </div>
          );
        })}
        <Button
          fullWidth
          onClick={() => {
            pushToast('Navigation mode coming soon.', 'info');
            setActiveZone(null);
          }}
        >
          Navigate Here
        </Button>
      </BottomSheet>
    </div>
  );
}
