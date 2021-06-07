<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  import { token, user } from '~/stores';

  const onMedicalStatusClicked = (e) => {
    e.preventDefault();
    navigate('/medical-status');
  };

  const onAddUserClicked = (e) => {
    e.preventDefault();
    navigate('/create-user');
  };

  const onManageUsersClicked = (e) => {
    e.preventDefault();
    navigate('/manage-users');
  };

  onMount(() => {
    if ($token === null || $token === '') {
      navigate('/login', { replace: true });
    }
  });
</script>

<div class="menu">
  {#if $user !== null}
    <h4>Welcome, {$user.name}</h4>
    <button on:click={onMedicalStatusClicked}> Medical Statuses </button>
    {#if $user.role === 'ADMIN'}
      <button on:click={onAddUserClicked}> Add User </button>
      <button on:click={onManageUsersClicked}> Manage Users </button>
    {/if}
  {/if}
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
    margin-bottom: 15px;
  }
</style>
