import {UbicacionDto} from '../shared/ubicacion.dto';

export interface EspacioDto {
  id: number;
  areaTotal: number;
  areaDisponible: number;
  altura: number;
  estadoEspacio: string;

}
