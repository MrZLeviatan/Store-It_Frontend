import {CrearUserDto} from '../../shared/crearUser.dto';
import {DatosLaboralesDto} from '../../shared/datosLaborales.dto';

export interface CrearAgenteVentasDto{
    nombre: string;
    telefono: string;
    codigoTelefono: string;
    telefonoSecundario: string;
    codigoTelefonoSecundario: string;
    imagenPerfil: File;
    user: CrearUserDto;
    datosLaborales: DatosLaboralesDto;
    idSede: any;

}
