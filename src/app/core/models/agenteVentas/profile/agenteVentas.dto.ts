import {UserDto} from '../../shared/user.dto';
import {DatosLaboralesDto} from '../../shared/datosLaborales.dto';

export interface AgenteVentasDto {
  id: number;
  nombre: string;
  telefono: string;
  telefonoSecundario: string;
  imagenPerfil: string;
  user: UserDto;
  datosLaborales: DatosLaboralesDto;
}
