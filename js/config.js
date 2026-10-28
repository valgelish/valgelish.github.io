/* ============================================================
   CONFIGURACIÓN DE LA WEB — Val Gelish
   Aquí se cambia lo que más se edita. No hace falta tocar nada más.
   ============================================================ */
window.VG_CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+" ni espacios.
  // México: 52 + 10 dígitos.
  whatsapp: "525579212439",

  instagram: "https://www.instagram.com/valgelish/",

  // Hoja de Google desde donde la web lee servicios, precios y esmaltes.
  // Pestaña "Servicios": servicio | precio | tipo (Servicio/Extra) | descripcion | activo (SI/NO)
  // Pestaña "Esmaltes": codigo | marca | nombre | color (#hex) | familia | disponible (SI/NO) | foto (URL opcional)
  // La hoja debe estar compartida como "Cualquier persona con el enlace: Lector".
  // Si la hoja no carga, se usan los respaldos de abajo y de js/esmaltes.js
  sheetId: "1iXwa-V-DW86jDEiyimf9gweb4UrLxUfBEjz4R9sV0ls",
  sheetName: "Esmaltes",
  sheetServicios: "Servicios",

  // Máximo de colores que una clienta puede elegir
  maxColores: 3,

  // Respaldo de servicios (solo si la hoja no carga)
  servicios: [
    { id: "gelish",   nombre: "Gelish liso",           precio: 150, tipo: "base",  desc: "Color a tu elección con un acabado brillante y duradero." },
    { id: "ojogato",  nombre: "Ojo de gato",           precio: 150, tipo: "base",  desc: "Un efecto brillante con reflejos que cambian según cómo les dé la luz." },
    { id: "frances",  nombre: "Francés",               precio: 170, tipo: "base",  desc: "Uñas con base natural y puntas perfectas del color de tu preferencia, limpio y elegante." },
    { id: "rubber",   nombre: "Base Rubber",           precio: 70,  tipo: "extra", desc: "Una base especial que ayuda a reforzar y dar mayor firmeza a tus uñas naturales." },
    { id: "glaseado", nombre: "Polvo efecto glaseado", precio: 50,  tipo: "extra", desc: "Acabado efecto aperlado que hace que tus uñas luzcan como glaseadas." },
    { id: "retiro",   nombre: "Retiro de gelish",      precio: 50,  tipo: "extra", desc: "Retiro cuidadoso sin dañar tu uña natural." }
  ]
};
