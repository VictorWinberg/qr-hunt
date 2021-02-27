<template>
  <header>
    <router-link to="/" class="header-title">
      QR-Hunt
      <i class="fas fa-crosshairs"></i>
      <i class="fas fa-hat-cowboy"></i>
      <i class="fas fa-map-marked-alt"></i>
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
  background: linear-gradient(#eee, $white);
  box-shadow: 0 2px 6px 0 rgba(#000, 0.2);
}

.header-title {
  position: relative;
  font-size: 2rem;
  color: inherit;
  text-align: left;
  text-decoration: none;

  &:hover {
    color: $primary;
  }

  .fas {
    position: absolute;
  }

  .fa-crosshairs {
    top: 4px;
    left: -2px;
  }

  .fa-hat-cowboy {
    top: -8px;
    right: 45px;
    transform: scale(0.75) rotate(-30deg);
  }

  .fa-map-marked-alt {
    top: -5px;
    right: -20px;
    transform: scale(0.8) rotate(30deg);
  }
}

.header-icon {
  margin: 0 1.5rem;
  color: inherit;

  &:hover {
    color: $primary;
  }
}

.header-delimiter {
  margin: auto;
}
</style>
