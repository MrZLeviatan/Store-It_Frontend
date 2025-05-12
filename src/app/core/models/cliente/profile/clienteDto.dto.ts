import {UserDto} from '../../shared/user.dto';

export interface ClienteDto {
  id: number;
  nombre: string;
  telefono: string;
  telefonoSecundario: string;
  imagenPerfil: string;
  user: UserDto;
  tipoCliente: string;
}
