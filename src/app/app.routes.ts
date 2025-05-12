import { Routes } from '@angular/router';
import {ContactoComponent} from './modules/inicio/pages/contacto/contacto.component';
import {InicioComponent} from './modules/inicio/pages/inicio/inicio.component';
import {LayoutPublicoComponent} from './layout/layout-publico/layout-publico.component';
import { AboutComponent} from './modules/inicio/pages/about/about.component';
import {LoginComponent} from './modules/inicio/pages/login/login.component';
import { RecursosHumanosHomeComponent } from './modules/recursosHumanos/pages/home/recursos-humanos-home.component';
import { AgenteVentasHomeComponent} from './modules/agenteVentas/pages/home/agente-ventas-home.component';
import { PersonalBodegaHomeComponent } from './modules/personalBodega/pages/home/personal-bodega-home.component';
import { ClienteHomeComponent } from './modules/cliente/pages/home/cliente-home.component';
import {AuthGuard} from './core/interceptors/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPublicoComponent,
    children: [
      { path: '', component: InicioComponent },
      {path: 'contacto', component: ContactoComponent},
      {path: 'about', component: AboutComponent}
    ]
},
  { path: 'login', component: LoginComponent },

  { path: 'recursos-humanos',
    canActivate: [AuthGuard],
    component: RecursosHumanosHomeComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./modules/recursosHumanos/pages/inicio/inicio-rrhh.component').then(m => m.InicioRrhhComponent)},
      { path: 'perfil', loadComponent: () => import('./modules/recursosHumanos/pages/profile/perfil-rrhh.component').then(m => m.PerfilRrhhComponent)},
      { path: 'registroAgente', loadComponent: () => import('./modules/recursosHumanos/pages/agenteVentas/registroAgenteVentas/registroAgenteVentas.component').then(m => m.RegistroAgenteVentasComponent)},
      { path: 'ver-agentes', loadComponent: () => import('./modules/recursosHumanos/pages/agenteVentas/listarAgenteVentas/listarAgenteVentas.component').then(m => m.ListarAgentesVentasComponent)},
      { path: 'registrarPersonal', loadComponent: () => import('./modules/recursosHumanos/pages/personalBodega/registrarPersonalBodega/registroPersonalBodega.component').then(m => m.RegistrarPersonalComponent)},
      { path: 'ver-personal', loadComponent: () => import('./modules/recursosHumanos/pages/personalBodega/listarPersonalBodegas/listarPersonalBodega.component').then(m => m.ListarPersonalBodegaComponent)},
      { path: 'reportes', loadComponent: () => import('./modules/recursosHumanos/pages/generarReporte/generarReporte.component').then(m => m.GraficosReportesComponent)}
    ]
  },

  { path: 'agente-ventas',
    canActivate: [AuthGuard],
    component: AgenteVentasHomeComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./modules/agenteVentas/pages/inicio/inicio-agenteVentas.component').then(m => m.InicioAgenteVentasComponent)},
      {path:  'perfil', loadComponent: () => import('./modules/agenteVentas/pages/profile/perfil-agenteVentas.component').then(m => m.PerfilAgenteVentasComponent)},
      {path: 'registrarCliente', loadComponent: () => import('./modules/agenteVentas/pages/cliente/registrarCliente/registrarCliente.component').then(m => m.RegistrarClienteComponent)},
      {path: 'registrarContrato', loadComponent: () => import('./modules/agenteVentas/pages/contrato/registrarContrato/registrarContrato.component').then(m => m.CrearContratoComponent)},
      {path: 'ver-contratos-agente', loadComponent: () => import('./modules/agenteVentas/pages/contrato/listarContratos/listarContrato.component').then(m => m.ListarContratoComponent)}
    ]
  },
  {
    path: 'personal-bodega',
    canActivate: [AuthGuard],
    component: PersonalBodegaHomeComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./modules/personalBodega/pages/inicio/inicio-personalBodega.component').then(m => m.InicioPersonalBodegaComponent)},
      {path:  'perfil', loadComponent: () => import('./modules/personalBodega/pages/profile/perfil-personalBodega.component').then(m => m.PerfilPersonalBodegaComponent)},
      { path: 'registrarProducto', loadComponent: () => import('./modules/personalBodega/pages/productos/registrarProducto/registrarProducto.component').then(m => m.RegistrarProductoComponent)},
      { path: 'retirarProducto', loadComponent: () => import('./modules/personalBodega/pages/productos/retirarProducto/retirar-producto.component').then(m => m.RetirarProductoComponent)}
    ]
  },

  {
    path: 'cliente',
    canActivate: [AuthGuard],
    component: ClienteHomeComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./modules/cliente/pages/inicio/inicio-cliente.component').then(m => m.InicioClienteComponent)},
      { path: 'perfil', loadComponent: () => import('./modules/cliente/pages/profile/perfilCliente.component').then(m => m.PerfilRrhhComponent)},
      { path: 'ver-productos', loadComponent: () => import('./modules/cliente/pages/productos/gestionProductos.component').then(m => m.ClienteProductoComponent)}
    ]
  }
];
