# Portfolio — Antoine Duarte

Portfolio de BUT3 Informatique (data, BI, IA), en ligne sur https://antoinezz25.github.io/portfolio/

L'accueil raconte mes projets au défilement : chaque projet est représenté par un objet 3D fait de particules.

## Lancer le site en local

```bash
cd site
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173.

## Modifier le contenu

Tout le texte est dans `src/data/`, sans avoir à toucher aux composants :

| Fichier | Contenu |
|---|---|
| `profile.js` | Nom, e-mail, GitHub, lien du CV, photo |
| `projects.js` | Les 4 projets principaux et les « autres projets » |
| `skills.js` | Compétences techniques, savoir-être, langues |
| `posts.js` | Articles du journal de veille |

Pour ajouter des captures : les déposer dans `raw-images/<dossier>/`, lancer `npm run images` (conversion en WebP dans `public/img/`), puis les référencer dans `projects.js`.

## Formulaire de contact

Sans configuration, le formulaire ouvre la messagerie du visiteur avec le message prérempli.
Pour recevoir les messages directement :

1. Créer un formulaire gratuit sur https://formspree.io.
2. Copier `.env.example` en `.env` et y mettre l'identifiant : `VITE_FORMSPREE_ID=xxxxxxx`.
3. Reconstruire le site (`npm run build`).

## Mettre en ligne

Chaque `git push` sur `main` reconstruit le site et le publie sur GitHub Pages (`.github/workflows/deploy.yml`).

En ligne, le site est dans le sous-dossier `/portfolio/` (réglé dans `vite.config.js`) : les images de `public/` s'appellent donc avec `asset('img/…')`.

## Technologies

Vue.js 3, Vue Router, Vite, Three.js (chargé seulement sur l'accueil, après le texte). Police Sligoil d'Ariel Martín Pérez (Velvetyne, licence OFL), auto-hébergée. Images en WebP chargées seulement quand elles deviennent visibles. Navigation au clavier ; sans WebGL ou avec « réduire les animations », la 3D est désactivée et la page reste complète.
