import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarruselService {
  private servicios = [
    {
      titulo: 'Almacenamiento',
      imagen: 'https://res.cloudinary.com/dehltwwbu/image/upload/v1746159239/8b5cef8d872cf43b837d44acd0ce4b91_nkckds.jpg',
      descripcion: 'Descubre una nueva forma de almacenar: segura, ordenada y 100% controlada. Visualiza en tiempo real cómo se ' +
        'utiliza cada espacio y toma decisiones rápidas para optimizar tu operación. Almacenar nunca fue tan fácil, inteligente y ' +
        'confiable.'
    },
    {
      titulo: 'Facturación Automatizada',
      imagen: 'https://res.cloudinary.com/dehltwwbu/image/upload/v1746159913/8a433d78a0fdac70193c2d55f15ff6e9_l44rck.jpg',
      descripcion: 'Haz que cada metro cuadrado trabaje para ti. Con nuestra solución avanzada, no solo almacenas productos de forma ' +
        'segura, sino que también generas facturas automáticas según el uso real de tus espacios. Sin más cálculos manuales ni sorpresas, ' +
        'todo se gestiona de manera eficiente, precisa y transparente para que tu negocio siga creciendo sin complicaciones.'
    },
    {
      titulo: 'Seguimiento en tiempo real',
      imagen: 'https://res.cloudinary.com/dehltwwbu/image/upload/v1746159242/285c0f5494901b6ea2738469e400ff35_u79do4.jpg',
      descripcion: '"La gestión eficiente comienza con el control en tiempo real. Monitorea los movimientos de productos y la ' +
        'disponibilidad de tus espacios al instante, sin complicaciones. Con nuestra plataforma, tienes acceso inmediato a toda la ' +
        'información que necesitas para mejorar la logística, reducir tiempos de espera y mantener tu inventario siempre a la vanguardia.'
    },
    {
      titulo: 'Aquí, la carne es ley. Y nosotros… somos su eco.',
      imagen: 'https://res.cloudinary.com/dehltwwbu/image/upload/v1746212945/bd740b24ab33065212a8b4ceaafbb521_amf2cn.jpg',
      descripcion: 'Las criaturas que nos rodean—mutaciones de hueso, músculo y órganos—no son errores, son hijos sagrados de la' +
        ' Carne Divina. Algunos de nosotros la adoramos, otros simplemente tratamos de sobrevivir entre sus caprichos. Todo lo que ' +
        'antes conocías —la lógica, la ciencia, la humanidad— ha sido absorbido, digerido y regurgitado en una nueva forma de existencia.'
    }
  ];


  // Devuelve todos los servicios
  getServicios() {
    return this.servicios;
  }
}
