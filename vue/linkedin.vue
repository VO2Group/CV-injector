<template>
  <div v-if=!linkedin>
    <h2>LinkedIn</h2>
    <button v-on:click="onLinkedin">Connexion</button>
  </div>
</template>
<script>
  module.exports = {
    vuex: {
      getters: {
        linkedin: function (state) {
          return state.linkedin
        }
      },
      actions: {
        onLinkedin: function (store) {
          store.dispatch('onLinkedin', true)
        }
      }
    }
  }
</script>
