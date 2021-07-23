<template>
  <header>
    <router-link to="/" class="header-title">
      <img alt="Logo" height="50" :src="require('@/assets/logo.svg')" />
    </router-link>
    <div class="header-delimiter"></div>
    <router-link to="/user" class="header-icon">
      <i class="fa fa-bars fa-2x"></i>
    </router-link>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss">
header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  color: $light-brand-color;
  background: $primary-color;
  box-shadow: 0 2px 6px 0 rgba(#000, 0.2);
}

.header-title {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 2rem;
  font-size: 2rem;
  color: inherit;
  text-align: left;
  text-decoration: none;
}

.header-icon {
  margin: 0 1.5rem;
  color: inherit;
}

.header-delimiter {
  margin: auto;
}
</style>
