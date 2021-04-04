<script>
    import fetch from '../fetch';
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
            .then((res) => {})
            .catch((e) => (error = e));
    };
</script>

<form>
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
    <input type="submit" on:click={onSubmit} />
    {error}
</form>
