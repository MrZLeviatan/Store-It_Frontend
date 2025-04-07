// src/app/cliente-perfil/cliente-perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../service/cliente.service';  // Servicio para obtener información del cliente
import { ActivatedRoute } from '@angular/router';
import {NgIf} from '@angular/common';  // Para obtener el ID del cliente desde la URL

@Component({
  selector: 'app-cliente-perfil',
  templateUrl: './cliente-perfil.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent implements OnInit {

  cliente: any = {};  // Variable para almacenar la información del cliente
  cargando: boolean = true;  // Indicador de carga

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute  // Para acceder al parámetro ID de la URL
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
}
