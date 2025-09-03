import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WazzupEvent } from '@/types';

type Props = {
  events: WazzupEvent[];
  onMarkerPress?: (id: string)=> void;
};

const HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'>
  <link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css' />
  <link rel='stylesheet' href='https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css' />
  <link rel='stylesheet' href='https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css' />
  <style>
    html, body, #map { position:absolute; top:0; left:0; right:0; bottom:0; margin:0; padding:0; }
    * { box-sizing: border-box; }
    :root{
      --wz-yellow: #FFD300;
      --wz-black: #000000;
      --wz-white: #FFFFFF;
      --wz-red: #FF3B30;
    }
    /* --- Base pin --- */
    .pin {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      font-weight: 900;
      color: var(--wz-black);
      background: var(--wz-yellow);
      border: 2px solid var(--wz-black);
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transform: translate(-50%, -100%);
      user-select: none;
      will-change: transform;
    }
    .pin .em { font-size: 18px; line-height: 1; }
    .pin .lab { display: none; } /* Hide text labels */
    
    /* Remove event type specific colors - using uniform yellow circles */
    .pin.shape-hex { border-radius: 50%; }
    .pin .badge {
      position: absolute; top: -6px; right: -6px;
      background: var(--wz-white); border: 2px solid var(--wz-black);
      border-radius: 999px; padding: 3px 7px; font-size: 9px; font-weight: 900;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      color: var(--wz-black);
    }
    .pin.live .badge { 
      background: var(--wz-red); 
      color: var(--wz-white); 
      border-color: var(--wz-black); 
      animation: pulse 2s infinite;
    }
    .pin.trending .badge { 
      background: var(--wz-yellow);
      color: var(--wz-black);
      border-color: var(--wz-black);
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    /* --- Pulse animation (live/trending) --- */
    @keyframes wz-pulse {
      0%   { transform: translate(-50%, -50%) scale(0.6); opacity: .7; }
      60%  { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
    }
    .pin::before{
      content:'';
      position:absolute; left:50%; top:50%;
      width: 14px; height:14px; border-radius: 999px;
      pointer-events:none;
      opacity: 0; /* off by default */
      will-change: transform, opacity;
    }
    .pin.live::before{
      background: rgba(255,59,48,0.25);
      box-shadow: 0 0 0 2px rgba(255,59,48,0.85);
      animation: wz-pulse 1.6s ease-out infinite;
      opacity: 1;
    }
    .pin.trending::before{
      background: rgba(255,211,0,0.25);
      box-shadow: 0 0 0 2px rgba(255,211,0,0.9);
      animation: wz-pulse 2s ease-out infinite;
      opacity: 1;
    }
    /* Pause pulses when fortement dézoomé pour préserver perf */
    .lowzoom .pin.live::before,
    .lowzoom .pin.trending::before{
      animation-play-state: paused;
      opacity: 0;
    }

    /* --- Cluster --- */
    .wz-cluster {
      width: 40px; height: 40px; border-radius: 14px;
      background: var(--wz-yellow); border: 2px solid var(--wz-black);
      display:flex; align-items:center; justify-content:center;
      font-weight: 900; color: var(--wz-black);
      box-shadow: 0 1px 0 var(--wz-black);
      transform: translate(-50%, -50%);
      will-change: transform;
    }
  </style>
</head>
<body>
  <div id='map'></div>
  <script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script>
  <script src='https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'></script>
  <script>
    const RN = window.ReactNativeWebView;
    const initCenter = { lat: 20, lng: 0, zoom: 2 };
    let map = L.map('map', {
      center: [initCenter.lat, initCenter.lng],
      zoom: initCenter.zoom,
      minZoom: 0,
      maxZoom: 19,
      worldCopyJump: true,
      zoomControl: false
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
      minZoom: 0,
      noWrap: false
    }).addTo(map);

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 60,
      iconCreateFunction: function (c) {
        const count = c.getChildCount();
        return L.divIcon({ html: '<div class="wz-cluster">'+count+'</div>', className: '', iconSize: [40, 40], iconAnchor:[20,20] });
      }
    });
    map.addLayer(cluster);

    const TYPE_META = {
      'dj_set':      { label:'DJ',     emoji:'🎧' },
      'concert':     { label:'Concert', emoji:'🎤' },
      'party':       { label:'Soirée', emoji:'🎉' },
      'after':       { label:'After',  emoji:'🌙' },
      'food_market': { label:'Food',   emoji:'🍔' },
      'expo_art':    { label:'Expo',   emoji:'🎨' }
    };

    function buildPinHtml(ev){
      const meta = TYPE_META[ev.type] || { label: 'Event', emoji:'📍' };
      const states = (ev.states || []).join(' ');
      let badge = '';
      if (states.includes('live')) badge = '<span class="badge">LIVE</span>';
      else if (states.includes('trending')) badge = '<span class="badge">🔥</span>';
      else if (states.includes('verified')) badge = '<span class="badge">✔️</span>';
      return '<div class="pin '+states+'" data-type="'+ev.type+'"><span class="em">'+meta.emoji+'</span><span class="lab">'+meta.label+'</span>'+badge+'</div>';
    }

    function asDivIcon(ev){
      return L.divIcon({ className: '', html: buildPinHtml(ev), iconSize: [1,1], iconAnchor: [20,28] });
    }

    function post(msg){ try { RN.postMessage(JSON.stringify(msg)); } catch(e){} }

    function renderMarkers(events){
      cluster.clearLayers();
      (window.__EVS__ = events || []).forEach(ev => {
        const m = L.marker([ev.lat, ev.lng], { icon: asDivIcon(ev) });
        m.on('click', () => post({ type:'press', id: ev.id }));
        cluster.addLayer(m);
      });
    }

    function fitAll(){
      const evs = window.__EVS__ || [];
      if (!evs.length) return;
      const b = L.latLngBounds(evs.map(e => [e.lat, e.lng]));
      map.fitBounds(b.pad(0.25), { animate: true });
    }

    // Perf: couper les pulses quand on est très dézommé
    function updatePulseState(){
      const low = map.getZoom() <= 4;
      document.body.classList.toggle('lowzoom', low);
    }
    map.on('zoomend', updatePulseState);
    updatePulseState();

    window.__WZP__ = { renderMarkers, fitAll };
    post({ type:'ready' });
  </script>
</body>
</html>
`;

function WorldMapWeb({ events, onMarkerPress }: Props){
  const ref = useRef<WebView>(null);

  const handleMessage = useCallback((e: any) => {
    try{
      const data = JSON.parse(e?.nativeEvent?.data ?? '{}');
      if (data?.type === 'press' && data.id) onMarkerPress?.(data.id);
    }catch{}
  }, [onMarkerPress]);

  const sync = useCallback(() => {
    if (!ref.current) return;
    const payload = JSON.stringify(events);
    const js = `window.__WZP__ && (window.__WZP__.renderMarkers(${payload}), window.__WZP__.fitAll()); true;`;
    ref.current.injectJavaScript(js);
  }, [events]);

  const webViewStyle = useMemo(() => ({ flex: 1 }), []);

  useEffect(() => { 
    sync(); 
  }, [sync]);

  return (
    <WebView
      ref={ref}
      originWhitelist={['*']}
      source={{ html: HTML }}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      style={webViewStyle}
      onLoadEnd={sync}
      setSupportMultipleWindows={false}
      automaticallyAdjustContentInsets={false}
      allowsInlineMediaPlayback
      androidLayerType={Platform.OS === 'android' ? 'hardware' : 'none'}
    />
  );
}

export default React.memo(WorldMapWeb);
