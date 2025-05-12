import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NgForOf, NgIf } from '@angular/common';
import { ReportesService } from '../../../../core/service/api/recursosHumanos/reportes/reportes.service'; // Asegúrate de tener este servicio
import { SedeDto } from '../../../../core/models/common/sede.dto';
import { AgenteVentasDto } from '../../../../core/models/agenteVentas/profile/agenteVentas.dto';
import { ContratoDto } from '../../../../core/models/common/contrato.dto';

@Component({
  selector: 'app-graficos-reportes',
  templateUrl: './generarReporte.component.html',
  styleUrls: ['./generarReporte.component.css'],
  standalone: true,
  imports: [BaseChartDirective, NgIf, NgForOf],
})
export class GraficosReportesComponent implements OnInit {

  // Lista de sedes disponibles / List of available branches
  sedes: SedeDto[] = [];
  agentesVentas: AgenteVentasDto[] = [];

  // Sede seleccionada / Selected branch
  sedeSeleccionadaId: number | null = null;

  // Lista de agentes y cantidad de contratos / Agents and contract counts
  agentes: { nombre: string; correo: string; cantidadContratos: number }[] = [];

  // Opciones del gráfico / Chart options
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Tipo de gráfico / Chart type
  barChartType: 'bar' = 'bar';

  // Datos del gráfico / Chart data
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    // Cargar sedes al iniciar / Load branches on init
    this.reportesService.obtenerSedes().subscribe(sedes => {
      this.sedes = sedes;
    });
  }

  // Al seleccionar una sede / On branch selection
  onSedeSeleccionada(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    this.sedeSeleccionadaId = id;

    // 🇪🇸 Obtener los agentes de ventas de la sede seleccionada
    // 🇺🇸 Get sales agents of the selected branch
    this.reportesService.obtenerAgentesPorSede(id).subscribe(agentes => {
      this.agentesVentas = agentes;
      this.agentes = []; // Limpiar datos anteriores

      const conteo: { [id: number]: number } = {}; // Conteo por id

      // 🇪🇸 Procesar cada agente por separado
      // 🇺🇸 Process each agent individually
      agentes.forEach(agente => {
        this.reportesService.obtenerContratosPorAgentes(agente).subscribe(contratos => {
          const totalContratos = contratos ? contratos.length : 0; // Evitar error si contratos es null
          conteo[agente.id] = totalContratos; // Usamos id para el conteo
          console.log(`Agente ${agente.nombre} tiene ${totalContratos} contratos`);
          if (Object.keys(conteo).length === agentes.length) {
            // Construir la lista de agentes con nombre, correo y cantidad de contratos
            this.agentes = Object.entries(conteo).map(([id, cantidadContratos]) => {
              const agente = agentes.find(a => a.id === +id);
              return {
                nombre: agente ? agente.nombre : 'Nombre no disponible',  // Asegurarse de que no sea undefined
                correo: agente ? agente.user.email : 'Correo no disponible',  // Asegurarse de que no sea undefined
                cantidadContratos
              };
            });
            // 🇪🇸 Actualizar el gráfico
            // 🇺🇸 Update the chart
            this.actualizarGrafico();
          }
        });
      });
    });
  }

  // Actualiza el gráfico / Update chart
  actualizarGrafico(): void {
    this.barChartData = {
      labels: this.agentes.map(a => a.nombre + ' (' + a.correo + ')'), // Etiquetas con los nombres de los agentes
      datasets: [{
        data: this.agentes.map(a => a.cantidadContratos), // Cantidad de contratos
        label: 'Contratos por Agente',
        backgroundColor: '#d36600'
      }]
    };

    // Actualizar las opciones del gráfico
    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'Arial, sans-serif', // Tipografía personalizada para la leyenda
              size: 14, // Tamaño de la fuente
              weight: 'bold' // Peso de la fuente
            },
            color: '#FFFFFF' // Color de texto de la leyenda (blanco)
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              family: 'Verdana, Geneva, sans-serif', // Tipografía personalizada para el eje X
              size: 12, // Tamaño de la fuente
              weight: 'bold' // Peso de la fuente
            },
            color: '#FFFFFF' // Color de texto de las etiquetas del eje X (blanco)
          }
        },
        y: {
          ticks: {
            font: {
              family: 'Verdana, Geneva, sans-serif', // Tipografía personalizada para el eje Y
              size: 12, // Tamaño de la fuente
              weight: 'bold' // Peso de la fuente
            },
            color: '#FFFFFF' // Color de texto de las etiquetas del eje Y (blanco)
          }
        }
      }
    };
  }

}


