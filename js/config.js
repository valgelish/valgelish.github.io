/* ============================================================
   CONFIGURACIÓN DE LA WEB — Val Gelish
   Aquí se cambia lo que más se edita. No hace falta tocar nada más.
   ============================================================ */
window.VG_CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+" ni espacios.
  // México: 52 + 10 dígitos.
  whatsapp: "525579212439",

  instagram: "https://www.instagram.com/valgelish/",

  // Hoja de Google donde se agregan / quitan esmaltes.
  // Columnas: nombre | color (#hex) | familia | disponible (SI/NO) | foto (URL opcional)
  // La hoja debe estar compartida como "Cualquier persona con el enlace: Lector".
  // Si se deja vacío, se usa la lista de respaldo de js/esmaltes.js
  sheetId: "1iXwa-V-DW86jDEiyimf9gweb4UrLxUfBEjz4R9sV0ls",
  sheetName: "Esmaltes",

  // Máximo de colores que una clienta puede elegir
  maxColores: 3,

  servicios: [
    { id: "gelish",   nombre: "Gelish liso",           precio: 150, tipo: "base",  desc: "Color sólido de larga duración, brillo espejo hasta por 3 semanas." },
    { id: "ojogato",  nombre: "Ojo de gato",           precio: 150, tipo: "base",  desc: "Efecto magnético con reflejo de luz que se mueve contigo." },
    { id: "frances",  nombre: "Francés",               precio: 170, tipo: "base",  desc: "El clásico que nunca falla: base nude y punta perfecta." },
    { id: "rubber",   nombre: "Base Rubber",           precio: 70,  tipo: "extra", desc: "Nivelación y refuerzo para uña natural más fuerte." },
    { id: "glaseado", nombre: "Polvo efecto glaseado", precio: 50,  tipo: "extra", desc: "Acabado perlado tipo glazed donut." },
    { id: "retiro",   nombre: "Retiro de gelish",      precio: 50,  tipo: "extra", desc: "Retiro cuidadoso sin dañar tu uña natural." }
  ]
};
