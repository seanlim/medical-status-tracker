<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  import fetch from '~/fetch';
  import { user } from '~/stores';

  let name, username, password, confirmPassword, role;

  onMount(() => {
    if ($user.role !== 'ADMIN') {
      navigate('/');
    }

    fetch('roles').then(console.info);
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };
</script>

<div class="container">
  <form on:submit={handleFormSubmit}>
    <p>Name</p>
    <input type="text" placeholder="Name" bind:value={name} />
    <p>Username</p>
    <input type="text" placeholder="Username" bind:value={username} />
    <p>Password</p>
    <input type="password" placeholder="Password" bind:value={password} />
    <p>Confirm Password</p>
    <input
      type="password"
      placeholder="Confirm Password"
      bind:value={confirmPassword}
    />
    <p>User Role</p>
    <select bind:value={role}>
      <option>jsd</option>
    </select>
  </form>
</div>

<style>
  .container {
    padding: 0 10px;
  }
</style>
