export interface EvidenceMetadata {
  title: string;
  category: string;
  description: string;
  alt: string;
  width?: number;
  height?: number;
}

// Las claves coinciden con los nombres en public/images/evidencias.
// Las fotografías sin ficha también aparecen, con un título neutro.
// Añadir aquí el tratamiento, materiales y fechas solo cuando Karen los confirme.
export const evidenceMetadata: Record<string, EvidenceMetadata> = {
  '1.jpg': { title: 'Detalle del sector anterior', category: 'Sector anterior', description: 'Dos vistas del sector anterior, conservadas en su composición original.', alt: 'Composición de dos fotografías intraorales del sector anterior' },
  '2.jpg': { title: 'Un proceso, distintas perspectivas', category: 'Sector anterior', description: 'Registro de cuatro vistas para observar el proceso desde diferentes perspectivas.', alt: 'Cuatro fotografías de dientes anteriores desde distintas vistas' },
  '3.jpg': { title: 'El detalle, paso a paso', category: 'Sector anterior', description: 'Secuencia fotográfica del sector anterior presentada en tres paneles.', alt: 'Secuencia de tres fotografías del sector anterior' },
  '4.jpg': { title: 'Una mirada al sector posterior', category: 'Sector posterior', description: 'Dos fotografías del sector posterior. Se mantienen los ángulos, colores y detalles del registro original.', alt: 'Dos vistas intraorales de un molar' },
  '5.jpg': { title: 'La superficie, de cerca', category: 'Sector posterior', description: 'Composición original con dos vistas de la superficie de un diente posterior.', alt: 'Registro de dos vistas de un diente posterior, con el marco original' },
  '6.jpg': { title: 'Perspectivas en el espejo', category: 'Sector posterior', description: 'Dos vistas del sector posterior mediante fotografía intraoral.', alt: 'Dos fotografías de un diente posterior con espejo dental' },
  '7.jpg': { title: 'Documentar cada detalle', category: 'Sector posterior', description: 'Registro del sector posterior en una composición horizontal de dos fotografías.', alt: 'Composición horizontal de dos vistas del sector posterior', width: 1280, height: 750 },
  '8.jpg': { title: 'El cuidado bajo otra mirada', category: 'Sector posterior', description: 'Registro fotográfico del sector posterior con ayuda de espejo dental.', alt: 'Dos vistas de dientes posteriores reflejados en un espejo dental' },
};

// Ventanas de visualización sobre los JPG originales: x, y, ancho, alto.
// Solo recortan la presentación en el navegador; no generan ni retocan píxeles.
export const comparisonViews = [
  { file: '4.jpg', title: 'Registro 04', left: '0 250 640 800', right: '640 250 640 800' },
  { file: '6.jpg', title: 'Registro 06', left: '0 260 640 800', right: '640 260 640 800' },
  { file: '8.jpg', title: 'Registro 08', left: '0 300 640 800', right: '640 300 640 800' },
];
