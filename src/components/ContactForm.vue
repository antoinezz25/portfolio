<script setup>
// Formulaire de contact.
// Avec VITE_FORMSPREE_ID (fichier .env), le message est envoyé par Formspree.
// Sans cette variable, le formulaire ouvre la messagerie du visiteur avec le message prérempli.
import { ref, reactive } from 'vue'
import { profile } from '../data/profile'

const formId = import.meta.env.VITE_FORMSPREE_ID
const form = reactive({ name: '', email: '', message: '', website: '' })
const status = ref('idle') // idle | sending | sent | error
const errors = reactive({})

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.name.trim()) errors.name = 'Indiquez votre nom.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Indiquez une adresse e-mail valide, par exemple nom@entreprise.fr.'
  if (form.message.trim().length < 10) errors.message = 'Écrivez au moins 10 caractères.'
  return Object.keys(errors).length === 0
}

async function submit() {
  if (form.website) return // champ piège anti-robots
  if (!validate()) {
    document.getElementById(`f-${Object.keys(errors)[0]}`)?.focus()
    return
  }

  if (!formId) {
    const subject = encodeURIComponent(`Contact depuis le portfolio — ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n${form.name} — ${form.email}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    status.value = 'sent'
    return
  }

  status.value = 'sending'
  try {
    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
    })
    if (!res.ok) throw new Error(res.status)
    status.value = 'sent'
    form.name = form.email = form.message = ''
  } catch {
    status.value = 'error' // le texte saisi est conservé
  }
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="submit">
    <div class="field">
      <label for="f-name">Nom</label>
      <input id="f-name" v-model="form.name" type="text" autocomplete="name" :aria-invalid="!!errors.name" aria-describedby="e-name" />
      <p id="e-name" class="field__error">{{ errors.name }}</p>
    </div>
    <div class="field">
      <label for="f-email">E-mail</label>
      <input id="f-email" v-model="form.email" type="email" autocomplete="email" :aria-invalid="!!errors.email" aria-describedby="e-email" />
      <p id="e-email" class="field__error">{{ errors.email }}</p>
    </div>
    <div class="field">
      <label for="f-message">Message</label>
      <textarea id="f-message" v-model="form.message" rows="6" :aria-invalid="!!errors.message" aria-describedby="e-message"></textarea>
      <p id="e-message" class="field__error">{{ errors.message }}</p>
    </div>
    <div class="trap" aria-hidden="true">
      <label for="f-website">Site web</label>
      <input id="f-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
    </div>

    <p class="privacy">Vos données servent uniquement à vous répondre. Elles ne sont ni stockées sur ce site ni transmises à des tiers.</p>

    <button class="btn" type="submit" :disabled="status === 'sending'">
      {{ status === 'sending' ? 'Envoi du message…' : 'Envoyer le message' }}
    </button>

    <p class="status" role="status">
      <template v-if="status === 'sent'">
        {{ formId ? 'Message envoyé. Je vous réponds rapidement.' : 'Votre messagerie s’est ouverte avec le message prérempli.' }}
      </template>
      <template v-else-if="status === 'error'">
        Le message n’est pas parti. Votre texte est conservé : réessayez, ou écrivez directement à
        <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>.
      </template>
    </p>
  </form>
</template>

<style scoped>
.form { display: flex; flex-direction: column; gap: 18px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 15px; font-weight: 600; }
input,
textarea {
  font: inherit;
  font-size: 16px;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 0;
  padding: 12px 14px;
  min-height: 48px;
  resize: vertical;
}
input:focus-visible,
textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 0; border-color: transparent; }
[aria-invalid='true'] { border-color: #ff8a73; }
.field__error { font-size: 14px; color: #ff9d8a; }
.field__error:empty { display: none; }
.trap { position: absolute; left: -9999px; }
.privacy { font-size: 14px; color: var(--muted); }
.btn { align-self: flex-start; }
.btn:disabled { opacity: 0.6; cursor: wait; }
.status { min-height: 1.5em; font-size: 15px; }
</style>
