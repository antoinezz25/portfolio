// Articles du journal de veille, centrés sur l'IA.
// ⚠️ Brouillons à reformuler avec tes propres mots avant la mise en ligne (consigne du sujet).
// Le texte de chaque article est en HTML simple : <p>, <h3>, <ul>, <strong>, <a>.

export const posts = [
  {
    slug: 'assistants-de-code-ia',
    date: '2026-11-12',
    title: 'Coder avec une IA : ce que j’en fais, et ce que je ne lui confie pas',
    tags: ['IA', 'Outils'],
    summary:
      'Les assistants de code font maintenant partie de mon quotidien d’étudiant. Voici comment je les utilise sans perdre la main sur mon propre code.',
    body: `
<p><strong>Les assistants de code par IA sont devenus un outil comme un autre</strong>, au même titre que l’IDE ou Git. Je les utilise en SAÉ comme pour mes projets personnels.</p>
<h3>Là où ils m’aident vraiment</h3>
<ul>
  <li>Comprendre rapidement un code que je n’ai pas écrit (le prototype repris en SAÉ, par exemple).</li>
  <li>Écrire le code répétitif : tests, configuration Docker, scripts de conversion.</li>
  <li>Expliquer un message d’erreur obscur et proposer des pistes.</li>
</ul>
<h3>Ce que je garde pour moi</h3>
<ul>
  <li><strong>Les choix d’architecture</strong> : l’IA propose, mais c’est à moi de comprendre et de décider.</li>
  <li><strong>La relecture</strong> : je ne valide jamais un code que je ne saurais pas expliquer.</li>
  <li><strong>Les données sensibles</strong> : pas de mots de passe ni de données personnelles dans une requête.</li>
</ul>
<p>Mon constat : l’IA fait gagner du temps sur l’exécution, mais elle rend encore plus importante la capacité à lire, tester et comprendre du code.</p>
`,
  },
  {
    slug: 'rag-ia-et-donnees',
    date: '2026-11-02',
    title: 'RAG : faire répondre une IA avec ses propres données',
    tags: ['IA', 'Data'],
    summary:
      'Un modèle de langage ne connaît pas les données d’une entreprise. Le RAG lui donne les bons documents au bon moment, et c’est surtout un travail de données.',
    body: `
<p><strong>Un grand modèle de langage (LLM) ne connaît que ce qu’il a vu pendant son entraînement.</strong> Il ignore les documents internes d’une entreprise et peut inventer une réponse plausible quand il ne sait pas.</p>
<p>Le <strong>RAG</strong> (<em>Retrieval-Augmented Generation</em>) répond à ce problème en deux temps :</p>
<ul>
  <li><strong>Rechercher</strong> : on découpe les documents en morceaux, on les transforme en vecteurs (embeddings) et on retrouve les passages les plus proches de la question.</li>
  <li><strong>Générer</strong> : on donne ces passages au modèle avec la question, et il répond en s’appuyant dessus.</li>
</ul>
<h3>Pourquoi ça me parle</h3>
<p>La qualité d’un RAG dépend surtout de la qualité des données en entrée : documents à jour, bien découpés, sans doublons. C’est exactement le travail de préparation que j’ai fait en stage sur les flux de données, appliqué à l’IA.</p>
<p>Avantage : pas besoin de réentraîner le modèle quand les documents changent, il suffit de mettre à jour la base de recherche.</p>
`,
  },
  {
    slug: 'mobilenetv2-images',
    date: '2026-10-26',
    title: 'Classer des photos sans gros serveur : pourquoi MobileNetV2',
    tags: ['IA', 'Vision'],
    summary:
      'Dans notre SAÉ, les usagers d’un centre aquatique envoient des photos de problèmes. Il fallait un modèle de vision léger : MobileNetV2 répond à ce besoin.',
    body: `
<p><strong>Notre projet de centre aquatique doit vérifier qu’une photo envoyée par un usager correspond bien au problème signalé</strong> (déchet, sol glissant…). Le serveur d’analyse tourne sur un simple processeur, sans carte graphique.</p>
<p><strong>MobileNetV2</strong> est un réseau de neurones conçu pour les téléphones et les petites machines. Il utilise des convolutions « séparables en profondeur », qui demandent beaucoup moins de calculs qu’un réseau classique.</p>
<h3>L’apprentissage par transfert</h3>
<ul>
  <li>On part d’un modèle déjà entraîné sur des millions d’images (ImageNet).</li>
  <li>On ne réentraîne que les dernières couches avec nos propres photos.</li>
  <li>Résultat : un modèle utile avec quelques centaines d’images au lieu de millions.</li>
</ul>
<p>La limite : il faut des photos représentatives (lumière de la piscine, reflets…), sinon le modèle se trompe sur des cas réels.</p>
`,
  },
  {
    slug: 'isolation-forest',
    date: '2026-10-12',
    title: 'Détecter une anomalie sans savoir à quoi elle ressemble',
    tags: ['IA', 'IoT'],
    summary:
      'Pour le centre aquatique, on veut repérer des mesures anormales sans avoir d’exemples de pannes. L’Isolation Forest répond à ce cas.',
    body: `
<p><strong>La plupart des modèles d’IA apprennent à partir d’exemples étiquetés.</strong> Mais dans un bassin, les vraies pannes sont rares : on n’a presque pas d’exemples de « mauvaise » mesure.</p>
<p>L’<strong>Isolation Forest</strong> prend le problème à l’envers : au lieu d’apprendre ce qu’est une anomalie, il mesure à quel point un point est <em>facile à isoler</em> des autres. Une mesure normale ressemble à beaucoup d’autres ; une mesure anormale se retrouve seule très vite.</p>
<h3>Pourquoi c’est adapté à notre projet</h3>
<ul>
  <li>Pas besoin d’exemples de pannes pour l’entraîner.</li>
  <li>Il est rapide, même sur des millions de relevés.</li>
  <li>Il est disponible directement dans scikit-learn.</li>
</ul>
<p>Sa limite : il faut choisir la proportion d’anomalies attendue, et ce réglage se fait avec le client, pas au hasard.</p>
`,
  },
]

export const sources = ['ZDNet', 'GitHub (tendances IA)', 'Reddit (r/MachineLearning, r/LocalLLaMA)']

export const findPost = (slug) => posts.find((p) => p.slug === slug)
