
export interface ProductoDto {
  id: number; // Identificador único del producto / Unique product ID
  nombre: string; // Nombre del producto / Product name
  descripcion: string; // Descripción del producto / Product description
  areaOcupada: number; // Área ocupada en metros cuadrados / Area occupied in square meters
  altura: number; // Altura del producto en metros / Product height in meters
  tipoProducto: string; // Tipo de producto (enum como string) / Product type (enum as string)
  estadoProducto: string; // Estado del producto (enum como string) / Product status (enum as string)
}
