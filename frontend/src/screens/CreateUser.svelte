<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  import fetch from '~/fetch';
  import { user } from '~/stores';

  let name,
    username,
    password,
    confirmPassword,
    role,
    error = '';

  let availableRoles = fetch('roles').then(({ data: roles }) => roles);

  onMount(() => {
    if ($user.role !== 'ADMIN') {
      navigate('/');
    }
  });

  async function createNewUser(params) {
    return fetch('create-user', {
      method: 'POST',
      body: { ...params },
    });
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createNewUser({
        username,
        password,
        confirmPassword,
        name,
        role,
      });
    } catch (err) {
      console.error(err);
      error = err;
    }
  };
</script>

<div class="container">
  {#await availableRoles}
    loading...
  {:then serverRoles}
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
      <p>User Access</p>
      <select bind:value={role}>
        {#each serverRoles as r}
          <option value={r}>{r}</option>
        {/each}
      </select><br />
      {error}
      <input type="submit" />
    </form>
  {:catch err}
    {err}
  {/await}
</div>

<style>
  .container {
    padding: 0 10px;
  }
</style>
