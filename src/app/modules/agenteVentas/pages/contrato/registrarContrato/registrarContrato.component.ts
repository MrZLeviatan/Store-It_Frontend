import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgenteVentasContratoService } from '../../../../../core/service/api/agenteVentas/contrato/agente-ventas-contrato.service';
import { BodegaDto } from '../../../../../core/models/common/bodega.dto';
import { EspacioDto } from '../../../../../core/models/common/espacio.dto';
import { ActivatedRoute } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import { NgForOf, NgIf } from '@angular/common';
import { TokenService } from '../../../../../core/service/token.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-contrato',
  templateUrl: './registrarContrato.components.html',
  styleUrls: ['./registrarContrato.components.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ]
})
export class CrearContratoComponent implements OnInit {
  contratoForm!: FormGroup;

  bodegas: BodegaDto[] = [];
  espacios: EspacioDto[] = [];

  bodegaSeleccionada: BodegaDto | null = null;
  espacioSeleccionado: EspacioDto | null = null;

  constructor(
    private fb: FormBuilder,
    private contratoService: AgenteVentasContratoService,
    private route: ActivatedRoute,
    private authToken: TokenService,
    private toastr: ToastrService // ✅ Inyectar ToastrService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.inicializarMapa();
  }

  inicializarFormulario(): void {
    this.contratoForm = this.fb.group({
      emailCliente: ['', [Validators.required, Validators.email]],
      fechaFin: ['', Validators.required],
      valor: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      idEspacio: [null, Validators.required],
    });
  }

  inicializarMapa(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoibmljb2xhczI4MTAwMiIsImEiOiJjbWFhaWRtam0xdjBrMnJvb2Zzd2w2eXQ3In0.EiKmTflHx-cs0GcxmrTN-w';

    const map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [-75.690601, 4.81333],
      zoom: 2,
    });

    map.addControl(new mapboxgl.NavigationControl());

    this.contratoService.obtenerBodegas().subscribe({
      next: (bodegas) => {
        this.bodegas = bodegas;

        bodegas.forEach((bodega) => {
          const marker = new mapboxgl.Marker()
            .setLngLat([bodega.ubicacion.longitud, bodega.ubicacion.latitud])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div id="popup-${bodega.id}" style="background-color: #ffffff; color: #222222; padding: 10px; border-radius: 8px; width: 150px; box-shadow: 0 2px 10px rgba(0,0,0,0.15);">
                <img id="imagen-${bodega.id}" src="${bodega.fotos[0]}"
                     alt="Imagen de la bodega"
                     style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 8px;" />
                <strong>Dirección:</strong> ${bodega.direccion}<br/>
                <strong>Ciudad:</strong> ${bodega.ubicacion.ciudad}<br/>
                <strong>Pais:</strong> ${bodega.ubicacion.pais}<br/>
              </div>
            `))
            .addTo(map);

          let imagenIndex = 0;
          setInterval(() => {
            const imagenElement = document.getElementById(`imagen-${bodega.id}`) as HTMLImageElement;
            if (imagenElement && bodega.fotos.length > 0) {
              imagenIndex = (imagenIndex + 1) % bodega.fotos.length;
              imagenElement.src = bodega.fotos[imagenIndex];
            }
          }, 20000);

          marker.getElement().addEventListener('click', () => {
            this.seleccionarBodega(bodega);
          });
        });
      },
      error: (err) => {
        this.toastr.error('Error al cargar las bodegas en el mapa.', 'Error');
      }
    });
  }

  seleccionarBodega(bodega: BodegaDto): void {
    this.bodegaSeleccionada = bodega;
    this.espacios = [];
    this.espacioSeleccionado = null;

    this.contratoService.obtenerEspaciosPorBodega(bodega.id).subscribe({
      next: (data) => {
        this.espacios = data || []; // Si 'data' es nulo o indefinido, asigna un arreglo vacío.
      },
      error: (err) => {
        this.toastr.error( 'No se pudieron cargar los espacios', 'Error');
        console.error(err);
      },
    });
  }

  seleccionarEspacio(espacio: EspacioDto): void {
    this.espacioSeleccionado = espacio;
    this.contratoForm.patchValue({ idEspacio: espacio.id });
  }

  crearContrato(): void {
    if (this.contratoForm.invalid) {
      this.toastr.warning('Por favor, completa todos los campos obligatorios.', 'Formulario Incompleto');
      return;
    }

    const formData = new FormData();
    formData.append('emailCliente', this.contratoForm.value.emailCliente);
    formData.append('fechaFin', this.contratoForm.value.fechaFin);
    formData.append('valor', this.contratoForm.value.valor);
    formData.append('descripcion', this.contratoForm.value.descripcion);
    formData.append('idEspacio', this.contratoForm.value.idEspacio);

    const idAgente = this.authToken.getUserIdFromToken();
    if (!idAgente) {
      this.toastr.error('No se encontró el ID del agente de ventas.', 'Error de sesión');
      return;
    }

    formData.append('idAgenteVentas', idAgente.toString());

    this.contratoService.crearContrato(formData).subscribe({
      next: () => {
        this.toastr.success('Contrato creado exitosamente.', 'Éxito');
        this.contratoForm.reset();
        this.espacios = [];
        this.bodegaSeleccionada = null;
        this.espacioSeleccionado = null;
      },
      error: () => {
        this.toastr.error('Error al crear el contrato.', 'Error');
      },
    });
  }
}

