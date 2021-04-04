<script>
    import Home from './Home.svelte';
    import Login from './Login.svelte';
    import Statuses from './Statuses.svelte';
    import { Router, Route } from 'svelte-routing';
</script>

<div>
    <Router url={window.location.pathname}>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/medical-status" component={Statuses} />
    </Router>
</div>
