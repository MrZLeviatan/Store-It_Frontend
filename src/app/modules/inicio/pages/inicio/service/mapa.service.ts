import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { BodegaDto } from '../../../../../core/models/common/bodega.dto';
import { SedeDto } from '../../../../../core/models/common/sede.dto';

@Injectable({
  providedIn: 'root',
})
export class MapaService {
  mapa!: mapboxgl.Map;
  initMap(bodegas: BodegaDto[], sedes: SedeDto[]) {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoibmljb2xhczI4MTAwMiIsImEiOiJjbWFhaWRtam0xdjBrMnJvb2Zzd2w2eXQ3In0.EiKmTflHx-cs0GcxmrTN-w';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [-74.2973, 4.5709],
      zoom: 2,
    });


    this.mapa = map;
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {

      // 🏢 Marcadores de bodegas
      bodegas.forEach((bodega ,index) => {
        this.agregarMarker(map, bodega.ubicacion.latitud, bodega.ubicacion.longitud, bodega.fotos, `
          <strong>${bodega.ubicacion.ciudad}, ${bodega.ubicacion.pais}</strong><br/>
          Dirección: ${bodega.direccion}<br/>
          Área: ${bodega.areaTotal} m²<br/>
          Teléfono: ${bodega.telefono}<br/>
        `, 'https://res.cloudinary.com/dehltwwbu/image/upload/v1746301359/image_bmftrj.png', `bodega-${index}`);
      });

      // 🏬 Marcadores de sedes
      sedes.forEach((sede, index) => {
        this.agregarMarker(map, sede.ubicacion.latitud, sede.ubicacion.longitud, sede.fotos, `
          <strong>${sede.nombre} </strong><br/>
          Ubicación: ${sede.ubicacion.ciudad}, ${sede.ubicacion.pais}<br/>
          Dirección: ${sede.direccion}<br/>
          Teléfono: ${sede.telefono}<br/>
        `, 'https://res.cloudinary.com/dehltwwbu/image/upload/v1746139476/20250501_1743_Icono_de_Ubicaci%C3%B3n_remix_01jt707xtzegt9gmxmncak9t5x_plyuia.png', `sede-${index}`);
      });


      // 🧾 Leyenda
      const legend = document.createElement('div');
      legend.innerHTML = `
        <div style="background: black; color: white; padding: 10px; border-radius: 8px; font-size: 14px; box-shadow: 0 0 6px rgba(0,0,0,0.3);">
          <strong>Leyenda</strong><br>
          <img src="https://res.cloudinary.com/dehltwwbu/image/upload/v1746139476/20250501_1743_Icono_de_Ubicaci%C3%B3n_remix_01jt707xtzegt9gmxmncak9t5x_plyuia.png" width="24" /> <span style="padding-left: 15px;">Sede</span><br>
          <img src="https://res.cloudinary.com/dehltwwbu/image/upload/v1746301359/image_bmftrj.png" width="24" /> <span style="padding-left: 15px;">Bodega</span>
        </div>
      `;
      Object.assign(legend.style, {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        zIndex: '1',
      });
      document.getElementById('map')?.appendChild(legend);

      // 🏙️ Capa 3D
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.addLayer(
        {
          id: 'buildings-3d',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );
    });


  }

  // 📍 Agrega un marcador personalizado al mapa con carrusel de imágenes
  private agregarMarker(
    map: mapboxgl.Map,
    lat: number,
    lng: number,
    fotos: string[],
    htmlContent: string,
    iconUrl: string,
    uniqueId: string
  ): void {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '40px';
    el.style.height = '40px';
   el.style.backgroundImage = `url('${iconUrl}')`;
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';

    const imgId = `imagen-${uniqueId}`;

    const popup = new mapboxgl.Popup().setHTML(`
      <div style="background-color: white; color: black; padding: 10px; border-radius: 20px; max-width: 250px;">
        ${htmlContent}
        <img id="${imgId}" src="${fotos[0]}" alt="Imagen" style="width: 100%; margin-top: 8px; border-radius: 5px;" />
      </div>
    `);

    new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    el.addEventListener('click', () => {

      // 📸 Carrusel de imágenes
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % fotos.length;
        const imgElement = document.getElementById(imgId) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = fotos[currentIndex];
        } else {
          clearInterval(intervalId);
        }
      }, 5000);
    });
  }
}


