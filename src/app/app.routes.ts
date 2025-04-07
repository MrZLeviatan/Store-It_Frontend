import {Routes} from '@angular/router';
import { RegistrarClienteComponent } from './cliente/registro-cliente/form/registroCliente-form.component';
import {ClientePerfilComponent} from './cliente/informacion-cliente/form/cliente-perfil.components';
import {AuthContainerComponent} from './components/auth-container/auth-container.component';
import {
  RegistroPersonalBodegaComponent
} from './personalBodega/registro-personalBodega/form/registro-personal-bodega.component';

export const routes: Routes = [
  { path: '', component: RegistroPersonalBodegaComponent},
  { path: '', component: AuthContainerComponent },
  { path: '', component: RegistrarClienteComponent }, // ✅ Página principal
  { path: 'cliente/perfil/:id', component: ClientePerfilComponent}, // Ruta con el parámetro ID
];

