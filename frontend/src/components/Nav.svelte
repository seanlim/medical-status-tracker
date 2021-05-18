<script>
  import { navigate } from 'svelte-routing';
  import { token } from '../stores';

  import fetch from '../fetch';

  export let title;

  const onTitleClicked = () => navigate('/', { replace: true });

  const onLogoutClicked = (e) => {
    e.preventDefault();
    fetch('logout', {
      method: 'POST',
    })
      .then((res) => {
        token.unset();
        navigate('/login', { replace: true });
      })
      .catch(console.error);
  };
</script>

<div class="navigation">
  <h3 on:click={onTitleClicked} class="header">{title}</h3>
  <button class="logout-button" on:click={onLogoutClicked}>logout</button>
</div>

<style>
  .navigation {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    border-bottom: solid #f5f5f5 1px;
    background: white;
    margin-bottom: 5px;
    position: sticky;
    top: 0;
  }
  h3 {
    flex: 1;
  }
  .navigation button {
    height: 40px;
  }
</style>
