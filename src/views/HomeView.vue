<script setup>
import { onMounted } from 'vue'
import StoryScroll from '../components/story/StoryScroll.vue'
import ContactForm from '../components/ContactForm.vue'
import { profile } from '../data/profile'
import { skillTables, softSkills, languages } from '../data/skills'
import { veille } from '../data/veille'

onMounted(() => (document.title = 'Antoine Duarte — Développeur data, BI et IA | Portfolio'))

</script>

<template>
  <!-- Accueil + les 4 projets principaux, racontés au défilement -->
  <StoryScroll />

  <!-- ========== À propos ========== -->
  <section id="a-propos" class="section container" aria-labelledby="t-apropos">
    <header class="sec-head">
      <p class="kicker">À propos</p>
      <h2 id="t-apropos" class="sec-title">Qui je suis</h2>
      <p class="sec-lead">Étudiant en 3<sup>e</sup> année de BUT Informatique, passionné par la donnée et l’IA.</p>
    </header>

    <div class="about">
      <div class="card about__text rise">
        <p>
          Ce qui me plaît, c’est de <strong>partir de données brutes et d’en faire quelque chose d’utile</strong> :
          une alerte, un tableau de bord, une prévision.
        </p>
        <p>
          J’ai découvert ce métier pendant mon <strong>stage à la DSI de l’Université Marie et Louis Pasteur</strong>,
          où j’ai construit un flux de données utilisé chaque jour par une application de santé étudiante.
        </p>
        <p>
          Je suis <strong>rigoureux et autonome</strong>, mais j’aime travailler en équipe et partager une solution dès
          que je la trouve. Face à un bug tenace, je garde mon calme et je cherche méthodiquement.
        </p>
      </div>

      <div class="about__side">
        <div class="card rise">
          <h3 class="card__title">Formation</h3>
          <p><strong>BUT Informatique</strong></p>
          <p class="muted small">IUT Nord Franche-Comté, Belfort · 2024 à 2027</p>
          <p class="fact-gap"><strong>Bac général, mention bien</strong></p>
          <p class="muted small">Maths et NSI · 2024</p>
        </div>
        <div class="card rise">
          <h3 class="card__title">Langues</h3>
          <p class="chips">
            <span v-for="l in languages" :key="l.name" class="chip">{{ l.name }} · {{ l.level }}</span>
          </p>
        </div>
        <div class="card rise">
          <h3 class="card__title">Hors du clavier</h3>
          <p class="small">8 ans de football en club, jeux vidéo d’aventure, de rôle et de gestion.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== Compétences ========== -->
  <section id="competences" class="section container" aria-labelledby="t-comp">
    <header class="sec-head">
      <p class="kicker">Compétences</p>
      <h2 id="t-comp" class="sec-title">Ce que je sais faire</h2>
      <p class="sec-lead">Chaque compétence est reliée au projet où je l’ai utilisée.</p>
    </header>

    <div class="skills">
      <div v-for="t in skillTables" :key="t.name" class="card rise">
        <h3 class="card__title">{{ t.title }}</h3>
        <ul class="skills__list">
          <li v-for="r in t.rows" :key="r.skill">
            <p class="skills__name">{{ r.skill }}</p>
            <p class="small">
              <RouterLink v-if="r.slug" :to="`/projets/${r.slug}`">{{ r.proof }}</RouterLink>
              <span v-else class="muted">{{ r.proof }}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>

    <h3 class="sub">Savoir-être</h3>
    <ul class="soft-skills">
      <li v-for="s in softSkills" :key="s.name" class="card rise">
        <p class="soft-skills__name">{{ s.name }}</p>
        <p class="muted small">{{ s.proof }}</p>
      </li>
    </ul>
  </section>

  <!-- ========== Veille ========== -->
  <section id="veille" class="section container" aria-labelledby="t-veille">
    <header class="sec-head">
      <p class="kicker">Veille</p>
      <h2 id="t-veille" class="sec-title">Ce que j’apprends</h2>
      <p class="sec-lead">Les sites où je suis l’actualité de l’IA et de la data, chaque semaine.</p>
    </header>
    <div class="veille">
      <div v-for="g in veille" :key="g.title" class="card rise">
        <h3 class="card__title">{{ g.title }}</h3>
        <ul class="veille__list">
          <li v-for="src in g.sources" :key="src.url">
            <a :href="src.url" target="_blank" rel="noopener">{{ src.name }}<span class="sr-only"> (nouvel onglet)</span></a>
            <p class="muted small">{{ src.note }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ========== Contact ========== -->
  <section id="contact" class="section container" aria-labelledby="t-contact">
    <header class="sec-head">
      <p class="kicker">Contact</p>
      <h2 id="t-contact" class="sec-title">Me contacter</h2>
      <p class="sec-lead">Une offre de stage, une question sur un projet ? Je vous réponds rapidement.</p>
    </header>

    <div class="contact">
      <dl class="card contact__list rise">
        <div><dt class="muted small">E-mail</dt><dd><a :href="`mailto:${profile.email}`">{{ profile.email }}</a></dd></div>
        <div><dt class="muted small">GitHub</dt><dd><a :href="profile.github" target="_blank" rel="noopener">github.com/{{ profile.githubUser }}</a></dd></div>
        <div><dt class="muted small">CV</dt><dd><a :href="profile.cv" download>Télécharger mon CV (PDF)</a></dd></div>
        <div><dt class="muted small">Lieu</dt><dd>{{ profile.location }} · permis B</dd></div>
      </dl>
      <div class="card rise"><ContactForm /></div>
    </div>
  </section>
</template>

<style scoped>
/* À propos */
.about { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 20px; align-items: start; }
.about__text { font-size: 18px; padding: 32px; }
.about__text p + p { margin-top: 1em; }
.about__side { display: grid; gap: 16px; }
.fact-gap { margin-top: 12px; }
@media (max-width: 900px) {
  .about { grid-template-columns: 1fr; }
}
@media (max-width: 520px) {
}

/* Compétences */
.skills { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: start; }
@media (max-width: 960px) { .skills { grid-template-columns: 1fr; } }
.skills__list li { padding: 10px 0; border-top: 1px solid var(--line); }
.skills__list li:first-child { border-top: 0; padding-top: 0; }
.skills__name { font-weight: 600; }
.sub { font-size: 22px; margin: 48px 0 16px; }
.soft-skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; }
.soft-skills .card { padding: 18px; }
@media (max-width: 520px) {
  .soft-skills { grid-template-columns: 1fr 1fr; gap: 10px; }
  .soft-skills .card { padding: 14px; }
  .about__text { padding: 22px 18px; font-size: 16px; }
}
.soft-skills__name { font-family: var(--font-display); color: var(--accent); margin-bottom: 4px; }

/* Veille */
.veille { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: start; }
@media (max-width: 900px) { .veille { grid-template-columns: 1fr; } }
.veille__list li { padding: 10px 0; border-top: 1px solid var(--line); }
.veille__list li:first-child { border-top: 0; padding-top: 0; }
.veille__list a { font-weight: 600; }

/* Contact */
.contact { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); gap: 16px; align-items: start; }
@media (max-width: 860px) { .contact { grid-template-columns: 1fr; } }
.contact__list { margin: 0; display: grid; gap: 18px; }
.contact__list dd { margin: 2px 0 0; word-break: break-word; }
</style>
