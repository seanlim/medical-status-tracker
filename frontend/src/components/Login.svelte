<script>
  import fetch from '../fetch';
  import { navigate } from 'svelte-routing';

  import { token } from '../stores';

  let username = '',
    password = '';

  let error = '';

  const onSubmit = async (e) => {
    e.preventDefault();
    fetch('login', {
      method: 'POST',
      body: {
        username,
        password,
      },
    })
      .then((res) => {
        token.set(res.data.token);
        navigate('/', { replace: true });
      })
      .catch((e) => (error = e));
  };
</script>

<div class="container">
  <form>
    <h3>M39S</h3>
    <input
      type="username"
      placeholder="Enter username..."
      bind:value={username}
    />
    <input
      type="password"
      placeholder="Enter password..."
      bind:value={password}
    />
    <input type="submit" on:click={onSubmit} value="Login" />
    <span class="error">{error}</span>
  </form>
</div>

<style>
  .container {
    background: #f5f5f5;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  form {
    background: white;
    border: #f5f5f5 solid 1px;
    padding: 15px 20px;
    border-radius: 5px;
    max-width: 300px;
  }

  form > * {
    margin-bottom: 15px;
    width: 100%;
  }

  .error {
    color: red;
  }
</style>
