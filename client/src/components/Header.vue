<template>
  <header>
    <router-link to="/" class="header-title">
      <img alt="Logo" height="50" :src="require('@/assets/logo.svg')" />
      <span class="logo-title">QR-Hunt</span>
    </router-link>
    <div class="header-delimiter"></div>
    <router-link to="/user" class="header-icon">
      <i class="fas fa-user-secret fa-2x"></i>
    </router-link>
    <a href="/auth/logout" class="header-icon">
      <i class="far fa-hand-point-right fa-2x"></i>
    </a>
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

.logo-title {
  position: absolute;
  right: -5rem;
  left: -3.5rem;
  text-align: center;
}

.header-icon {
  margin: 0 1.5rem;
  color: inherit;
}

.header-delimiter {
  margin: auto;
}
</style>
