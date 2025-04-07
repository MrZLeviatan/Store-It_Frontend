// src/app/cliente-perfil/cliente-perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../service/cliente.service';  // Servicio para obtener información del cliente
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';  // Para obtener el ID del cliente desde la URL

@Component({
  selector: 'app-cliente-perfil',
  templateUrl: './cliente-perfil.component.html',
  imports: [NgIf, FormsModule],
  styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent implements OnInit {

  cliente: any = {};  // Variable para almacenar la información del cliente
  cargando: boolean = true;  // Indicador de carga
  editando: boolean = false;  // Estado para editar

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,  // Para acceder al parámetro ID de la URL
    private router: Router

) {}

  ngOnInit(): void {
    // Obtener el ID del cliente desde la URL
    const idCliente = this.route.snapshot.paramMap.get('id') as string;
    this.obtenerCliente(idCliente);  // Llamar al método para obtener la información del cliente
  }

  obtenerCliente(id: string): void {
    this.clienteService.obtenerCliente(id).subscribe({
      next: (data) => {
        this.cliente = data.mensaje;  // Asignamos los datos del cliente a la variable cliente
        this.cargando = false;  // Cambiamos el estado de carga
      },
      error: (error) => {
        console.error('Error al obtener la información del cliente', error);
        this.cargando = false;  // Terminamos el estado de carga
      }
    });
  }
  toggleEdit(): void {
    this.editando = !this.editando;
  }

  confirmarCambios(): void {
    const confirmar = window.confirm('¿Está seguro de los cambios?');
    if (confirmar) {
      this.editando = false; // Desactivar la edición
      this.enviarCambios(); // Enviar la petición al backend
    }
  }

  enviarCambios(): void {
    const clienteActualizado = {
      cedula: this.cliente.cedula,
      nombre: this.cliente.nombre,
    };

    this.clienteService.editarCliente(clienteActualizado).subscribe({
      next: (data) => {
        alert(data.mensaje); // Mensaje de éxito
        this.router.navigate([`/cliente/perfil/${this.cliente.cedula}`]); // Redirige al perfil actualizado
      },
      error: (error) => {
        console.error('Error al actualizar la información del cliente', error);
        alert('Hubo un error al actualizar la información.');
      }
    });
  }
}
