import {UbicacionDto} from '../shared/ubicacion.dto';

export interface BodegaDto {
  id: number;
  direccion: string;
  ubicacion: UbicacionDto;
  telefono: string;
  fotos: string[];
  areaTotal: number;
  altura: number;
  // Agrega los demás campos si los necesitas
}
