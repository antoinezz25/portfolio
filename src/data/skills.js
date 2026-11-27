// Compétences présentées comme les tables d'un schéma de base de données :
// chaque ligne indique où la compétence a été utilisée (preuve), plutôt qu'un pourcentage.

export const skillTables = [
  {
    name: 'data_bi',
    title: 'Données & Business Intelligence',
    rows: [
      { skill: 'SQL (PostgreSQL, MySQL)', proof: 'Stage DSIN, GP Explorer, boutique', slug: 'stage-dsin' },
      { skill: 'Flux ETL (Talend / Talaxie)', proof: 'Flux Calcium au stage', slug: 'stage-dsin' },
      { skill: 'Business Objects, QlikSense', proof: 'Requêtes et tableaux de bord au stage', slug: 'stage-dsin' },
      { skill: 'MongoDB', proof: 'Centre aquatique, démo OAuth', slug: 'centre-aquatique' },
      { skill: 'Modélisation Merise (MCD / MLD)', proof: 'SAÉ de BUT 1 et 2' },
    ],
  },
  {
    name: 'dev',
    title: 'Développement',
    rows: [
      { skill: 'Java', proof: 'Serveur TCP du centre aquatique, filtres Talend', slug: 'centre-aquatique' },
      { skill: 'Python (Flask, scikit-learn)', proof: 'Boutique, IA du centre aquatique', slug: 'centre-aquatique' },
      { skill: 'JavaScript, Node.js, Express', proof: 'API du GP Explorer et du centre aquatique', slug: 'gp-explorer' },
      { skill: 'Vue.js 3, HTML / CSS', proof: 'GP Explorer, ce portfolio', slug: 'gp-explorer' },
      { skill: 'C', proof: 'Cours d’algorithmique et de systèmes' },
      { skill: 'C# (Unity)', proof: 'FPS Zombie', slug: 'fps-zombie' },
    ],
  },
  {
    name: 'outils',
    title: 'Outils & méthodes',
    rows: [
      { skill: 'Git, GitHub', proof: 'Tous les projets d’équipe' },
      { skill: 'Docker, Docker Compose', proof: 'DREmgr au stage, centre aquatique', slug: 'centre-aquatique' },
      { skill: 'Tests (Cucumber, Selenium, Jenkins)', proof: 'Centre aquatique', slug: 'centre-aquatique' },
      { skill: 'API REST, Swagger', proof: 'API Pégase, GP Explorer', slug: 'stage-dsin' },
      { skill: 'Méthodes agiles, cahier des charges, Gantt', proof: 'SAÉ et stage' },
    ],
  },
]

export const softSkills = [
  { name: 'Rigueur', proof: 'Documentation technique en LaTeX pour que mon travail puisse être repris.' },
  { name: 'Autonomie', proof: 'Montée en compétence seul sur Pégase, un domaine que je ne connaissais pas.' },
  { name: 'Travail en équipe', proof: 'Quatre projets à 2, 4 ou 5 personnes, avec Git et des revues régulières.' },
  { name: 'Communication', proof: 'Présentation de mon flux devant l’équipe et partage de solutions par écrit.' },
  { name: 'Calme', proof: 'Face à une API qui refuse les connexions : on analyse, on ne panique pas.' },
]

export const languages = [
  { name: 'Anglais', level: 'B2' },
  { name: 'Espagnol', level: 'B1' },
  { name: 'Portugais', level: 'Notions' },
]
