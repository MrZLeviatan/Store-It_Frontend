export interface CrearProductoDto {
  nombre: string;                 // Nombre del producto / Product name
  descripcion: string;           // Descripción del producto / Product description
  areaOcupada: number;           // Área ocupada en m² / Occupied area in m²
  altura: number;                // Altura del producto / Product height
  tipoProducto: string   // Tipo de producto / Product type
  idEspacio: number;            // ID del espacio asignado / Assigned space ID
  emailCliente: string;         // Email del cliente / Client email
  idPersonalBodega: number;     // ID del personal responsable / Responsible staff ID
}
