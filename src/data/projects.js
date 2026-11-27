import { asset } from './asset'

// Contenu des projets. Chaque projet suit la structure demandée par le sujet :
// contexte, objectif, technologies, rôle, défis, captures et liens.

export const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'data', label: 'Data & BI' },
  { id: 'ia', label: 'IA' },
  { id: 'web', label: 'Web' },
  { id: 'java', label: 'Java' },
  { id: 'jeu', label: 'Jeu vidéo' },
]

export const projects = [
  {
    slug: 'stage-dsin',
    start: '2026-04',
    end: '2026-07',
    featured: true,
    badge: 'Stage',
    title: 'Flux de données pour la migration d’Apogée vers Pégase',
    label: 'Flux Calcium',
    context: 'Stage à la DSIN, 2026',
    metric: '300+ pages d’API lues chaque jour',
    highlights: [
      'Flux ETL quotidien sur Talend / Talaxie',
      'Base locale DRE et requêtes Business Objects',
      'Script de chargement QlikSense',
    ],
    short:
      "Stage à la DSIN de l’université : créer les flux qui alimentent les applications pendant le changement de logiciel de scolarité.",
    period: 'Avril à juin 2026',
    frame: 'Stage de 2e année',
    org: 'DSIN — Université Marie et Louis Pasteur',
    team: 'Intégré au Pôle Métier',
    categories: ['data', 'java'],
    stack: ['Talend / Talaxie', 'Java', 'API REST', 'Swagger', 'PostgreSQL', 'SQL', 'Docker', 'SAP Business Objects', 'QlikSense', 'LaTeX'],
    cover: asset('img/projets/stage-dsin/1.webp'),
    coverAlt: 'Job Talend : appel de l’API Pégase, filtre puis rapprochement avec le LDAP',
    intro:
      "L’université remplace son ancien logiciel de scolarité (Apogée) par le nouveau système national Pégase. Pendant la transition, les deux cohabitent : les applications qui lisaient les données d’Apogée doivent continuer à fonctionner. Ma mission : reconstruire certains de ces flux de données et rendre les données de Pégase exploitables pour les tableaux de bord.",
    features: [
      "<strong>Flux « Calcium »</strong> : un job ETL qui récupère chaque jour les parcours de milliers d’étudiants depuis l’API Pégase et produit le fichier d’import de l’application de rendez-vous médicaux.",
      "<strong>Base locale DRE</strong> : paramétrage de DREmgr (déployé avec Docker) pour rapatrier les données de Pégase, qui est hébergé à l’extérieur (SaaS).",
      "<strong>Business Intelligence</strong> : connexion de Business Objects à la base DRE, requêtes d’extraction pour les services administratifs et script de chargement QlikSense.",
      "<strong>Reprise de données</strong> : requêtes SQL pour aider l’équipe à fiabiliser les données migrées.",
    ],
    role:
      "J’étais seul sur le flux Calcium, de l’étude de l’API jusqu’à la documentation, que j’ai présentée à l’équipe.",
    challenges: [
      {
        problem: "L’API Pégase renvoie plus de 300 pages de résultats et refusait les connexions quand Talend l’appelait trop vite.",
        solution: "Pagination maîtrisée, référentiels chargés une seule fois en mémoire pour éviter des milliers d’appels, et filtres Java qui interceptent les timeouts et les données manquantes au lieu de faire planter le job.",
      },
      {
        problem: "Un domaine métier totalement nouveau (la scolarité universitaire) et une documentation Pégase de plusieurs centaines de pages.",
        solution: "Lecture ciblée du sommaire, tests des routes dans Swagger pour vérifier que chaque donnée existait bien, puis cartographie des flux avant de coder.",
      },
      {
        problem: 'Les données brutes en JSON contenaient des crochets et des guillemets parasites.',
        solution: 'Nettoyage avec des fonctions Java directement dans les composants de mapping, pour livrer un CSV propre.',
      },
    ],
    shots: [
      { src: asset('img/projets/stage-dsin/1.webp'), w: 1600, alt: 'Job Talend : appel de l’API Pégase, filtre puis rapprochement avec le LDAP', caption: 'Un job du projet Calcium dans Talend : il lit les inscriptions sur l’API Pégase, les filtre, ajoute le login LDAP et la nationalité, puis écrit le fichier d’import.' },
      { src: asset('img/projets/stage-dsin/2.webp'), w: 1600, alt: 'Composant tMap de Talend reliant les colonnes d’entrée aux colonnes de sortie', caption: 'Le tMap : chaque colonne de l’API est reliée au fichier de sortie, avec deux recherches (nationalité et login LDAP).' },
      { src: asset('img/projets/stage-dsin/3.webp'), w: 1600, alt: 'Job exporté et lancé depuis un terminal PowerShell', caption: 'Le job exporté en programme autonome, lancé en ligne de commande pour tourner chaque jour sans Talend.' },
    ],
    links: [
      { label: 'Rapport de stage détaillé (14 traces)', url: 'https://github.com/antoinezz25/portfolio_but2' },
    ],
    next: "Le passage en production partielle de Pégase est prévu à la rentrée 2026 : le flux Calcium et sa documentation ont été transmis à l’équipe pour la suite.",
  },
  {
    slug: 'centre-aquatique',
    start: '2026-09',
    end: '2027-02',
    featured: true,
    badge: 'En cours',
    title: "Supervision connectée d’un centre aquatique",
    label: 'Supervision d’un centre aquatique',
    context: 'SAÉ, 2026–2027',
    highlights: [
      'Capteurs ESP32 : pH, température, turbidité',
      'IA de vérification des photos (MobileNetV2)',
      'Tableau de bord temps réel et alertes',
    ],
    short:
      "Des capteurs mesurent la qualité de l’eau des bassins, une IA analyse les photos envoyées par les usagers et un tableau de bord alerte le personnel.",
    period: 'Sept. 2026 à janv. 2027',
    frame: 'SAÉ S5-S6, BUT 3',
    org: 'IUT Nord Franche-Comté',
    team: '5 personnes',
    categories: ['ia', 'data', 'java', 'web'],
    stack: ['Java (sockets TCP)', 'Node.js / Express', 'MongoDB', 'Vue.js 3', 'Python', 'scikit-learn', 'OpenCV', 'ESP32', 'Docker', 'Jenkins', 'Cucumber', 'Selenium'],
    cover: null,
    diagram: 'iot',
    intro:
      "Aujourd’hui, le centre aquatique relève la qualité de l’eau à la main, sur papier. Notre système la mesure en continu, garde l’historique sur plusieurs saisons et alerte le personnel dès qu’une valeur sort des limites. Les usagers peuvent aussi signaler un problème (déchet, sol glissant…) en prenant une photo.",
    features: [
      "<strong>Mesure en continu</strong> : des boîtiers ESP32 relèvent la température, le pH, la turbidité et les sels dissous de chaque bassin.",
      "<strong>Alertes par gravité</strong> quand une mesure sort des seuils du bassin.",
      "<strong>Signalement par photo</strong> : l’IA (MobileNetV2) vérifie que la photo correspond au problème choisi et estime sa criticité.",
      "<strong>Anticipation</strong> : prévision des séries temporelles et détection d’anomalies (Isolation Forest) pour planifier l’entretien.",
      "<strong>Tableau de bord web</strong> : état en temps réel, courbes, comparaisons et bilan hebdomadaire du directeur.",
    ],
    role:
      "Je m’occupe des tests (scénarios Cucumber, tests Selenium, plan de performance sur Jenkins) et de l’intégration entre l’API, le serveur Java, MongoDB et Docker.",
    challenges: [
      {
        problem: "Comment prouver que le système tient la charge alors que tous les boîtiers peuvent se reconnecter à la même seconde après une coupure Wi-Fi ?",
        solution: "Un plan de tests de performance avec des objectifs chiffrés (ex. 200 boîtiers simulés servis en moins de 30 s, 95 % des requêtes en moins de 200 ms) à valider avec le client avant de lancer les mesures.",
      },
      {
        problem: "Le Jenkins de l’IUT n’accepte que d’anciennes versions de Java.",
        solution: "Adaptation des projets de tests (Java 11, puis Java 8 pour les tests d’acceptation) pour que l’intégration continue passe.",
      },
    ],
    shots: [
      { src: asset('img/projets/centre-aquatique/1.webp'), w: 1600, alt: 'Tableau de bord de supervision des bassins', caption: 'Le tableau de bord du personnel : dernières mesures de chaque bassin et alertes en cours.' },
      { src: asset('img/projets/centre-aquatique/2.webp'), w: 1600, alt: 'Courbe du pH du bassin ludique sur une semaine', caption: 'L’évolution d’une grandeur : ici le pH du bassin ludique sur une semaine, avec un pic anormal.' },
      { src: asset('img/projets/centre-aquatique/3.webp'), w: 1600, alt: 'Liste des boîtiers de mesure', caption: 'L’administration des boîtiers de mesure : emplacement et fréquence des relevés.' },
    ],
    links: [],
    privateRepo: true,
    next: "Prochaines étapes : brancher les vrais boîtiers, entraîner les modèles de prévision sur les relevés réels et lancer les tests de charge.",
  },
  {
    slug: 'gp-explorer',
    start: '2025-09',
    end: '2026-05',
    featured: true,
    badge: 'SAÉ',
    title: 'GP Explorer : plateforme de gestion d’un Grand Prix',
    label: 'GP Explorer',
    context: 'SAÉ, 2025–2026',
    highlights: [
      'Billetterie avec QR code et mode cadeau',
      'Trois profils : administrateur, prestataire, visiteur',
      'Statistiques pour les organisateurs',
    ],
    short:
      "Le site d’un événement de course automobile (F4) : billetterie, carte du circuit, espace prestataires, boutique et statistiques.",
    period: 'Sept. 2025 à avr. 2026',
    frame: 'SAÉ S3-S4, BUT 2',
    org: 'IUT Nord Franche-Comté',
    team: '5 personnes',
    categories: ['web', 'data'],
    stack: ['Vue.js 3', 'Pinia', 'Vue Router', 'Node.js', 'Express', 'Sequelize', 'PostgreSQL / SQLite', 'Swagger', 'i18n (FR/EN/ES)'],
    cover: asset('img/gp/dashboard_global.webp'),
    coverAlt: 'Tableau de bord de performance globale du GP Explorer',
    intro:
      "Le GP Explorer rassemble des dizaines de milliers de spectateurs pendant un week-end. Notre plateforme gère tout l’événement : vente des billets, carte interactive du circuit, espace pour les prestataires (restauration, boutiques, activités) et statistiques pour les organisateurs. Elle a trois profils : administrateur, prestataire et visiteur.",
    features: [
      '<strong>Billetterie</strong> avec réservation, QR code et mode cadeau.',
      '<strong>Carte interactive du circuit</strong> avec les emplacements des prestataires.',
      '<strong>Espace prestataire</strong> : produits, messages, livre d’or.',
      '<strong>Statistiques</strong> pour les organisateurs (affluence, ventes, satisfaction).',
      '<strong>Site traduit</strong> en français, anglais et espagnol, avec un mode sombre.',
    ],
    role:
      "J’ai développé les comptes et les rôles, la réservation de billets, les statistiques, la boutique et le mode sombre.",
    challenges: [
      {
        problem: 'Le premier système de réservation était trop complexe et générait des bugs.',
        solution: 'Je l’ai simplifié et j’ai centralisé la gestion des erreurs dans un middleware Express pour renvoyer des messages clairs au front.',
      },
      {
        problem: 'Trois profils d’utilisateurs n’ont pas accès aux mêmes pages ni aux mêmes données.',
        solution: 'Middlewares de rôle et de propriété côté API, et routes protégées côté Vue.',
      },
    ],
    shots: [
      { src: asset('img/projets/gp-explorer/1.webp'), w: 1600, alt: 'Page d’accueil du site GP Explorer', caption: 'La page d’accueil, avec le compte à rebours avant la course.' },
      { src: asset('img/projets/gp-explorer/2.webp'), w: 1600, alt: 'Billetterie du GP Explorer', caption: 'La billetterie : pass festival, activités et prestataires.' },
      { src: asset('img/projets/gp-explorer/3.webp'), w: 1600, alt: 'Boutique du GP Explorer', caption: 'La boutique, avec ses filtres par écurie et par prestataire.' },
      { src: asset('img/projets/gp-explorer/4.webp'), w: 1600, alt: 'Statistiques de l’espace organisateur', caption: 'L’espace organisateur : statistiques de visites et de ventes.' },
      { src: asset('img/projets/gp-explorer/5.webp'), w: 1600, alt: 'Page des écuries et pilotes', caption: 'Les écuries et leurs pilotes.' },
    ],
    links: [],
    privateRepo: true,
    next: 'Évolutions possibles : paiement en ligne réel et notifications en direct pendant la course.',
  },
  {
    slug: 'fps-zombie',
    start: '2025-11',
    end: '2026-01',
    featured: true,
    badge: 'Jeu',
    title: 'Survie face aux zombies : un FPS sous Unity',
    label: 'Survie zombie',
    context: 'Unity, 2025',
    highlights: [
      'Jusqu’à 20 manches et 50 zombies',
      'Zombies qui contournent les obstacles (NavMesh)',
      'Boss, mini-carte et menus complets',
    ],
    short:
      'Un jeu de tir à la première personne où il faut survivre à des vagues de zombies de plus en plus nombreuses, jusqu’au boss.',
    period: 'Nov. à déc. 2025',
    frame: 'Module de développement de jeu, BUT 2',
    org: 'IUT Nord Franche-Comté',
    team: 'Binôme',
    categories: ['jeu'],
    stack: ['Unity 6', 'C#', 'NavMesh', 'Input System', 'TextMesh Pro'],
    cover: null,
    diagram: 'fps',
    intro:
      "Le joueur doit tenir le plus de manches possible face à des zombies qui le traquent sur la carte. Chaque manche en fait apparaître davantage, jusqu’à l’arrivée d’un boss. La partie se configure (nombre de manches et de zombies) et les touches sont personnalisables.",
    features: [
      '<strong>Système de manches</strong> : jusqu’à 20 manches et 50 zombies.',
      '<strong>Zombies qui poursuivent le joueur</strong> en contournant les obstacles.',
      '<strong>Boss</strong> avec sa propre barre de vie.',
      '<strong>Interface</strong> : mini-carte, compteur de victimes, menus pause, réglages et fin de partie.',
    ],
    role:
      "Je me suis occupé des ennemis et du déroulement de la partie : déplacement des zombies, manches, boss et bruitages.",
    challenges: [
      {
        problem: 'Les zombies fonçaient en ligne droite et restaient bloqués contre les murs.',
        solution: 'Utilisation du NavMesh de Unity : la carte est « cuite » en zones praticables et chaque zombie calcule son chemin vers le joueur.',
      },
      {
        problem: 'Tous les zombies apparaissaient au même endroit, ce qui rendait le jeu trop facile.',
        solution: 'Plusieurs points d’apparition répartis sur la carte et un nombre de zombies qui augmente à chaque manche.',
      },
    ],
    shots: [
      { src: asset('img/projets/fps-zombie/1.webp'), w: 1600, alt: 'Vue à la première personne : des zombies arrivent dans la rue', caption: 'En pleine manche : les zombies arrivent par la rue, avec la mini-carte et le compteur de manches.' },
      { src: asset('img/projets/fps-zombie/2.webp'), w: 1600, alt: 'Écran de configuration : nombre de manches et de zombies', caption: 'Avant de jouer, on choisit le nombre de manches et de zombies par manche.' },
      { src: asset('img/projets/fps-zombie/3.webp'), w: 1600, alt: 'Des zombies au contact du joueur, avec leur barre de vie', caption: 'Les zombies contournent les obstacles et viennent au contact : chacun a sa barre de vie.' },
    ],
    links: [],
    privateRepo: true,
    next: 'Évolutions possibles : plusieurs armes à débloquer et un classement des meilleurs scores.',
  },
  {
    slug: 'oauth',
    featured: false,
    title: 'Connexion multi-fournisseurs (OAuth 2.0 + JWT)',
    short: 'Une démo de connexion par e-mail ou via Google, GitHub et Discord, sécurisée par jetons JWT.',
    period: 'Févr. 2026',
    frame: 'Projet personnel',
    team: 'Seul',
    categories: ['web'],
    stack: ['Node.js', 'Express', 'Passport.js', 'JWT', 'MongoDB', 'Vue.js 3'],
    links: [{ label: 'Code sur GitHub', url: 'https://github.com/antoinezz25/oauth_project' }],
    thumb: { src: asset('img/projets/oauth/1.webp'), w: 1600, alt: 'Page de connexion avec Google, GitHub et Discord' },
  },
  {
    slug: 'rsa',
    featured: false,
    title: 'Chiffrement RSA',
    short: 'Implémentation de l’algorithme RSA en Python pour chiffrer des messages et une image.',
    period: 'Nov. 2025',
    frame: 'Cours de cryptographie, BUT 2',
    team: 'Seul',
    categories: [],
    stack: ['Python'],
    links: [{ label: 'Code sur GitHub', url: 'https://github.com/antoinezz25/Projet_Crypto' }],
  },
  {
    slug: 'e-commerce',
    featured: false,
    title: 'Boutique en ligne de câbles',
    short: 'Site e-commerce avec panier, commandes, liste d’envies et espace d’administration.',
    period: 'Mars à mai 2025',
    frame: 'SAÉ, BUT 1',
    team: '4 personnes',
    categories: ['web', 'data'],
    stack: ['Python', 'Flask', 'MySQL'],
    links: [],
    thumb: { src: asset('img/projets/e-commerce/1.webp'), w: 1600, alt: 'Catalogue de câbles avec filtres par type et par prix' },
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const otherProjects = projects.filter((p) => !p.featured)
export const findProject = (slug) => projects.find((p) => p.slug === slug && p.featured)
