import {UbicacionDto} from '../shared/ubicacion.dto';

export interface SedeDto {

  id: number;
  nombre: string;
  fotos: string[];
  ubicacion: UbicacionDto;
  direccion: string;
  telefono: string;
}
