// whatsappUtils.js
export const enviarWhatsApp = (numero, mensaje) => {
  const numeroLimpio = numero.replace(/\D/g, '');
  const numeroConCodigo = numeroLimpio.startsWith('549') ? numeroLimpio : `549${numeroLimpio}`;
  window.open(`https://wa.me/${numeroConCodigo}?text=${encodeURIComponent(mensaje)}`, '_blank');
};