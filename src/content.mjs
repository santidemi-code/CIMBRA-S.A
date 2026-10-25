export const company={name:'Cimbra Constructora S.A.',phone:'+5493434598817',displayPhone:'343 4598817',whatsapp:'5493434598817',address:'Ruta 12 km 10,5',locality:'Colonia Avellaneda, Entre Ríos',hours:'Lunes a viernes, de 8 a 17 h',since:'2010',officialSite:'https://www.cimbraconstructora.com.ar/'};
export const navigation=[{id:'inicio',label:'Inicio'},{id:'quienes-somos',label:'Quiénes somos'},{id:'obras-servicios',label:'Obras y servicios'},{id:'contacto',label:'Contacto'}];
// Enlaces proporcionados por el usuario. La web sólo los abre tras un clic explícito.
export const socialProfiles=[
 {id:'instagram',label:'Instagram',url:'https://www.instagram.com/cimbraconstructora/'},
 {id:'facebook',label:'Facebook',url:'https://www.facebook.com/cimbraconstructora/?ref=1'}
];
// Orden de imágenes confirmado por el usuario. Referencias ilustrativas de servicios.
export const serviceImages={
 'movimiento-de-suelos':{file:'movimiento-de-suelos',width:1200,height:896,alt:'Excavadora y minicargadora realizando movimientos de suelo.'},
 'construccion-e-infraestructura':{file:'construccion-e-infraestructura',width:1200,height:670,alt:'Construcción de un edificio con estructura de hormigón y cerramientos de ladrillo.'},
 'redes-agua-cloacas':{file:'redes-agua-cloacas',width:1200,height:670,alt:'Colocación de tuberías en una zanja con apoyo de una excavadora.'},
 'equipos-y-logistica':{file:'equipos-y-logistica',width:1200,height:670,alt:'Retroexcavadora, minicargadora y camión en un patio de materiales.'},
 'demoliciones':{file:'demoliciones',width:1200,height:670,alt:'Excavadora con martillo hidráulico durante una demolición.'}
};
export const services=[
{id:'movimiento-de-suelos',n:'01',title:'Movimiento de suelos',short:'El comienzo de una buena obra.',text:'Movimientos de suelo, compactaciones y rellenos para preparar el terreno de acuerdo con las necesidades del proyecto.',items:['Movimiento de suelos','Compactación y rellenos','Preparación del terreno'],media:'servicio-suelos',kind:'SUELOS'},
{id:'construccion-e-infraestructura',n:'02',title:'Construcción e infraestructura',short:'De la ingeniería a la ejecución.',text:'Construcciones generales y trabajos de hormigón. Ingeniería y construcción para obras públicas y privadas.',items:['Construcciones generales','Trabajos de hormigón','Obras de ingeniería y construcción'],media:'servicio-construccion',kind:'CONSTRUCCIÓN'},
{id:'redes-agua-cloacas',n:'03',title:'Redes de agua y cloacas',short:'Infraestructura que conecta.',text:'Redes de agua y cloacas, tuneleo y cruces de calles, rutas y vías. Consultá los trabajos y el alcance para tu obra.',items:['Redes de agua y cloacas','Tuneleo','Cruces de calles, rutas y vías'],media:'servicio-redes',kind:'INFRAESTRUCTURA'},
{id:'equipos-y-logistica',n:'04',title:'Equipos y logística',short:'Recursos para acompañar el trabajo.',text:'Servicios de retroexcavadora, minicargadora con accesorios y transporte de materiales. Consultá disponibilidad para tu obra.',items:['Retroexcavadora y minicargadora','Accesorios para distintos trabajos','Logística y transporte de materiales'],media:'servicio-equipos',kind:'EQUIPOS'},
{id:'demoliciones',n:'05',title:'Demoliciones',short:'Preparar el lugar para lo que sigue.',text:'Trabajos de demolición dentro de la oferta de construcción de Cimbra. Conversá con el equipo sobre las características y condiciones del trabajo.',items:['Evaluación de la necesidad','Definición de los trabajos previstos','Coordinación con la obra'],media:'servicio-demoliciones',kind:'OBRAS CIVILES'}
];
export const projects=[
{id:'red-colectora',title:'Red colectora · Obra civil',category:'Infraestructura',location:'Ubicación no publicada',media:'obra-red-colectora',sourceTitle:'Obra - Red Colectora - Obra Civil',description:'Trabajo publicado por Cimbra dentro de su cartera de obras. La información disponible no especifica ubicación, fecha ni alcance contractual.'},
{id:'centro-salud',title:'Centro de Salud Sauce Montrull',category:'Edificio de salud',location:'Sauce Montrull',media:'obra-centro-salud',sourceTitle:'Edificio de Reemplazo Centro de Salud Sauce Montrull',description:'Edificio de reemplazo del Centro de Salud Sauce Montrull, incluido en la cartera institucional de Cimbra. El material público no detalla fecha, superficies ni alcance del contrato.'},
{id:'viviendas',title:'10 viviendas · Aldea Santa María',category:'Viviendas',location:'Aldea Santa María',media:'obra-viviendas',sourceTitle:'Aldea Santa María 10 Viviendas',description:'Conjunto de diez viviendas identificado en la cartera institucional como «Aldea Santa María 10 Viviendas». La fuente no informa fechas ni superficies.'}
];
export function whatsapp(){return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hola, Cimbra. Quisiera consultar por mi proyecto')}`;}
