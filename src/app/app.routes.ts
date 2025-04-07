import {Routes} from '@angular/router';
import { RegistrarClienteComponent } from './cliente/registro-cliente/form/registroCliente-form.component';
import {ClientePerfilComponent} from './cliente/informacion-cliente/form/cliente-perfil.components';

export const routes: Routes = [
  { path: '', component: RegistrarClienteComponent }, // ✅ Página principal
  { path: 'cliente/perfil/:id', component: ClientePerfilComponent}, // Ruta con el parámetro ID
];

