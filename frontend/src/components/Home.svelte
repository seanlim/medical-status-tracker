<script>
  import { Link, navigate } from 'svelte-routing';
  import { token } from '../stores';

  import fetch from '../fetch';
  import { onMount } from 'svelte';

  const onLogoutClicked = (e) => {
    e.preventDefault();
    fetch('logout', {
      method: 'POST',
    })
      .then((res) => navigate('/login', { replace: true }))
      .catch(console.error);
  };

  onMount(() => {
    if ($token === null || $token === '') {
      navigate('/login', { replace: true });
    }
  });
</script>

<div>
  <Link to="/medical-status">Medical Statuses</Link>
  <button on:click={onLogoutClicked}>logout</button>
</div>
