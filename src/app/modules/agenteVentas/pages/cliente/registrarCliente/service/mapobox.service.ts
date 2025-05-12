import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs'; // Importa HttpClient

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  private accessToken: string = 'pk.eyJ1Ijoibmljb2xhczI4MTAwMiIsImEiOiJjbWFhaWRtam0xdjBrMnJvb2Zzd2w2eXQ3In0.EiKmTflHx-cs0GcxmrTN-w';
  // BehaviorSubject para emitir los valores de ciudad y país
  private ciudadPaisSubject = new BehaviorSubject<{ ciudad: string, pais: string }>({ ciudad: '', pais: '' });

  ciudadPais$ = this.ciudadPaisSubject.asObservable(); // Observable que el componente puede suscribirse


  constructor(private http: HttpClient) {
    mapboxgl['accessToken'] = this.accessToken;
  }

  initializeMap(containerId: string, lat: number, lng: number, onClick: (lngLat: mapboxgl.LngLat) => void): void {
    this.map = new mapboxgl.Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [lng, lat],
      zoom: 10,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('click', (event) => {
      const coords = event.lngLat;
      this.setMarker(coords);
      onClick(coords);
    });
  }

  setMarker(lngLat: mapboxgl.LngLat): void {
    if (this.marker) {
      this.marker.setLngLat(lngLat);
    } else {
      this.marker = new mapboxgl.Marker({ color: '#d36600' })
        .setLngLat(lngLat)
        .addTo(this.map);
    }
  }

  obtenerCiudadPais(lat: number, lng: number): void {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${this.accessToken}`;

    this.http.get(url).subscribe((response: any) => {
      const features = response.features;
      if (features && features.length > 0) {
        const city = features.find((f: any) => f.place_type.includes('place'))?.text || 'Ciudad desconocida';
        const country = features.find((f: any) => f.place_type.includes('country'))?.text || 'País desconocido';

        // Emitir los valores a través del Subject
        this.ciudadPaisSubject.next({ ciudad: city, pais: country });
      }
    });
  }
}

