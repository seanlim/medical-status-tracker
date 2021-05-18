<script>
  import { navigate } from 'svelte-routing';
  import { token } from '../stores';

  import { onMount } from 'svelte';
  import Nav from './Nav.svelte';

  const onMedicalStatusClicked = (e) => {
    e.preventDefault();
    navigate('/medical-status');
  };

  onMount(() => {
    if ($token === null || $token === '') {
      navigate('/login', { replace: true });
    }
  });
</script>

<Nav title="M39 System" />
<div class="menu">
  <h4>Apps</h4>
  <button on:click={onMedicalStatusClicked}> Medical Statuses </button>
</div>

<style>
  .menu {
    padding: 0 10px;
  }

  .menu button {
    width: 100%;
    color: rgb(22, 142, 255);
    background: white;
    border: solid 2px rgb(22, 142, 255);
  }
</style>
