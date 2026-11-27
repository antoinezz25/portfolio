// Veille : les sites que je suis, regroupés par usage.
// Pour en ajouter un : { name, url, note } dans le bon groupe.

export const veille = [
  {
    title: 'Actualité tech',
    sources: [
      { name: 'ZDNet', url: 'https://www.zdnet.fr/', note: 'IA, cloud et cybersécurité, en français.' },
      { name: 'Le Monde Informatique', url: 'https://www.lemondeinformatique.fr/', note: 'Les nouvelles des entreprises et des DSI.' },
      { name: 'The Batch', url: 'https://www.deeplearning.ai/the-batch/', note: 'La lettre hebdomadaire de DeepLearning.AI sur l’IA.' },
    ],
  },
  {
    title: 'IA et data en pratique',
    sources: [
      { name: 'Blog Hugging Face', url: 'https://huggingface.co/blog', note: 'Nouveaux modèles et tutoriels pour s’en servir.' },
      { name: 'Hugging Face Papers', url: 'https://huggingface.co/papers', note: 'Les articles de recherche du jour, expliqués en quelques lignes.' },
      { name: 'Towards Data Science', url: 'https://towardsdatascience.com/', note: 'Retours d’expérience en data science et en BI.' },
    ],
  },
  {
    title: 'Communautés',
    sources: [
      { name: 'GitHub Trending', url: 'https://github.com/trending/python?since=weekly', note: 'Les projets Python qui montent cette semaine.' },
      { name: 'r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/', note: 'Discussions sur la recherche en apprentissage automatique.' },
      { name: 'r/dataengineering', url: 'https://www.reddit.com/r/dataengineering/', note: 'Flux ETL, outils et métiers de la donnée.' },
    ],
  },
]
