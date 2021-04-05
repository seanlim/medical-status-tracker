<script>
    import { Link, navigate } from 'svelte-routing';

    import fetch from '../fetch';

    const onLogoutClicked = (e) => {
        e.preventDefault();
        fetch('logout', {
            method: 'POST',
        })
            .then((res) => navigate('/login', { replace: true }))
            .catch(console.error);
    };
</script>

<div>
    <Link to="/medical-status">Medical Statuses</Link>
    <button on:click={onLogoutClicked}>logout</button>
</div>
