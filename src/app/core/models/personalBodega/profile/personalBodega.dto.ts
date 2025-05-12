import {UserDto} from '../../shared/user.dto';
import {DatosLaboralesDto} from '../../shared/datosLaborales.dto';

export interface PersonalBodegaDto {
  id: number;
  nombre: string;
  telefono: string;
  telefonoSecundario: string;
  imagenPerfil: string;
  tipoCargo: string;
  user: UserDto;
  datosLaborales: DatosLaboralesDto;
}
