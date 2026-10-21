export const clients = new Set();
export const broadcast = d => clients.forEach(c => c.write(`data: ${JSON.stringify(d)}\n\n`));
