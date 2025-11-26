export const formatCurrency = (amount) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

export const formatRut = (rut) => {
    if (!rut) return '';
    // Limpiar: dejar solo números y k
    const clean = rut.replace(/[^0-9kK]/g, '');
    if (clean.length < 2) return clean;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toUpperCase();

    // Formatear cuerpo con puntos
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${formattedBody}-${dv}`;
};
