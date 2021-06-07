<script>
  import { Router, Route } from 'svelte-routing';

  import { token } from '~/stores';

  import NavBar from '~/components/Nav.svelte';
  import Home from '~/screens/Home.svelte';
  import Login from '~/screens/Login.svelte';
  import Statuses from '~/screens/Statuses.svelte';
  import CreateUser from '~/screens/CreateUser.svelte';
  import ManageUser from './screens/ManageUsers.svelte';
</script>

<Router url={window.location.pathname}>
  {#if $token !== null && $token !== ''}
    <NavBar title="M39 System" />
  {/if}
  <Route path="/" component={Home} />
  <Route path="/login" component={Login} />
  <Route path="/medical-status" component={Statuses} />
  <Route path="/create-user" component={CreateUser} />
  <Route path="/manage-users" component={ManageUser} />
</Router>
