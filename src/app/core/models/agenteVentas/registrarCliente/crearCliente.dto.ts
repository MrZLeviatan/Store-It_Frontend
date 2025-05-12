import {CrearUserDto} from '../../shared/crearUser.dto';
import {UbicacionDto} from '../../shared/ubicacion.dto';

export interface CrearClienteDto{
  nombre: string;
  telefono: string;
  codigoPais: string;
  telefonoSecundario: string;
  codigoPaisSecundario: string;
  imagenPerfil: File;
  user: CrearUserDto;
  ubicacion: UbicacionDto;
  tipoCliente: string;
}
