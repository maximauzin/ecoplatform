import { useEffect, useRef, useState } from 'react';
import client from '../../api/client';
import geoPng from '../../assets/geo.png';

const EKATERINBURG = [56.8389, 60.6057];

function loadYmaps(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.ymaps3) {
            resolve(window.ymaps3);
            return;
        }
        const existing = document.getElementById('ymaps3-script');
        if (existing) {
            existing.addEventListener('load', () => resolve(window.ymaps3));
            existing.addEventListener('error', reject);
            return;
        }
        const script = document.createElement('script');
        script.id = 'ymaps3-script';
        const url = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
        console.log('Loading Yandex Maps script from:', url);
        script.src = url;
        script.async = true;
        script.onload = () => resolve(window.ymaps3);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export default function YandexMap({ points = [], width = '864px', height = '303px', center, zoom }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        client.get('/accounts/config/')
            .then(({ data }) => {
                console.log('Fetched config:', data);
                if (data.yandex_maps_key) {
                    setApiKey(data.yandex_maps_key);
                } else {
                    setError('Ключ API Яндекс Карт не найден в конфигурации');
                }
            })
            .catch((err) => {
                console.error('Failed to fetch config:', err);
                setError('Не удалось загрузить конфигурацию бэкенда');
            });
    }, []);

    useEffect(() => {
        if (!apiKey || !containerRef.current) return;

        let destroyed = false;

        loadYmaps(apiKey).then(async (ymaps3) => {
            if (destroyed || !containerRef.current) return;
            console.log('Ymaps JS loaded');

            await ymaps3.ready;
            if (destroyed) return;

            const {
                YMap,
                YMapDefaultSchemeLayer,
                YMapDefaultFeaturesLayer,
                YMapMarker,
                YMapControls,
                YMapZoomControl,
                YMapGeolocationControl,
            } = ymaps3;

            setTimeout(() => {
                if (destroyed || !containerRef.current) return;
                
                try {
                    let mapCenter = [EKATERINBURG[1], EKATERINBURG[0]];
                    let mapZoom = zoom || 12;

                    if (center) {
                        mapCenter = [center[1], center[0]];
                    } else if (points.length === 1) {
                        const p = points[0];
                        const lat = parseFloat(p.latitude || p.lat);
                        const lng = parseFloat(p.longitude || p.lng);
                        if (lat && lng) {
                            mapCenter = [lng, lat];
                            mapZoom = zoom || 15;
                        }
                    }

                    const map = new YMap(containerRef.current, {
                        location: {
                            center: mapCenter,
                            zoom: mapZoom,
                        },
                    });

                    map.addChild(new YMapDefaultSchemeLayer({}));
                    map.addChild(new YMapDefaultFeaturesLayer({}));

                    if (YMapControls && YMapZoomControl) {
                        const controls = new YMapControls({ position: 'right' });
                        controls.addChild(new YMapZoomControl({}));
                        map.addChild(controls);
                    }

                    if (YMapControls && YMapGeolocationControl) {
                        const geoControls = new YMapControls({ position: 'right bottom' });
                        geoControls.addChild(new YMapGeolocationControl({}));
                        map.addChild(geoControls);
                    }

                    points.forEach(point => {
                        const lat = parseFloat(point.latitude || point.lat);
                        const lng = parseFloat(point.longitude || point.lng);
                        if (!lat || !lng) return;

                        const el = document.createElement('div');
                        el.className = 'map-marker';
                        el.style.cssText = `
                            width: 32px; 
                            height: 32px; 
                            background-image: url(${geoPng}); 
                            background-size: contain; 
                            background-repeat: no-repeat; 
                            background-position: center;
                            cursor: pointer;
                        `;
                        el.addEventListener('click', () => {
                            if (point.id) window.location.href = `/card/${point.id}`;
                        });

                        map.addChild(new YMapMarker({ coordinates: [lng, lat] }, el));
                    });

                    mapRef.current = map;
                } catch (e) {
                    console.error('Map init error:', e);
                    setError('Ошибка инициализации карты');
                }
            }, 100);
        }).catch((err) => {
            console.error('Error loading Ymaps script:', err);
            setError('Ошибка загрузки скрипта Яндекс Карт. Проверьте ключ API или блокировщик рекламы.');
        });

        return () => {
            destroyed = true;
            if (mapRef.current) {
                try { mapRef.current.destroy?.(); } catch { /* ignore */ }
                mapRef.current = null;
            }
        };
    }, [apiKey, points]);

    if (error) {
        return (
            <div style={{ width, height, background: '#f8d7da', color: '#721c24', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '32px', padding: '20px', textAlign: 'center' }}>
                <span>{error}</span>
            </div>
        );
    }

    if (!apiKey) {
        return (
            <div style={{ width, height, background: '#e8f0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '32px' }}>
                <span style={{ color: '#777', fontSize: '14px' }}>Карта загружается...</span>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{ width, height, borderRadius: '8px', overflow: 'hidden', marginBottom: '32px', position: 'relative', background: '#eee' }}
        />
    );
}
