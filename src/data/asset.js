// Adresse d'un fichier de public/ : en ligne, le site est dans le sous-dossier /portfolio/ (voir vite.config.js)
export const asset = (path) => import.meta.env.BASE_URL + path
