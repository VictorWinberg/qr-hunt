<template>
  <router-link to="/" class="not-found__wrapper">
    <span class="not-found__code">404</span>
    <h1 class="not-found__status">Page Not Found</h1>
    <p>
      We're sorry, the page you requested could not be found. <br />
      Click anywhere to go back to the homepage.
    </p>
  </router-link>
</template>

<script>
export default {};
</script>

<style lang="scss">
.not-found__wrapper {
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.not-found__code {
  font-size: 10rem;
}

.not-found__status {
  margin-bottom: 1rem;
}
</style>
