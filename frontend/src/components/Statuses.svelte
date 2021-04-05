<script>
    import { onMount } from 'svelte';

    import fetch from '../fetch';

    let data = null,
        error = null,
        selectedCoy = null;

    onMount(() =>
        fetch('medical-statuses')
            .then((res) => {
                data = res.data;
                selectedCoy = Object.keys(data)[0];
            })
            .catch((err) => {
                error = err;
            })
    );
</script>

<div class="container">
    {#if data === null}
        {#if error !== null}
            {error}
        {:else}
            <p>loading...</p>
        {/if}
    {:else}
        <select bind:value={selectedCoy}>
            {#each Object.keys(data) as coy}
                <option value={coy}>{coy}</option>
            {/each}
        </select>
        <table>
            <tr>
                <th>Initials</th>
                <th>Platoon</th>
                <th>Status</th>
                <th>Start - End</th>
                <th />
            </tr>
            {#each data[selectedCoy] as record}
                <tr class:active={record.statusActive}>
                    <td>{record.initials}</td>
                    <td>{record.platoon}</td>
                    <td
                        >{record.status}
                        {record.reasoning !== ''
                            ? `(${record.reasoning})`
                            : ''}</td
                    >
                    <td>{record.start} - {record.end}</td>
                </tr>
            {/each}
        </table>
    {/if}
</div>

<style>
    .container {
        width: 100vw;
    }

    th {
        position: sticky;
        top: 0;
        background: white;
    }
    th,
    td {
        text-align: left;
        max-width: 25vw;
        padding: 10px;
    }

    tr {
        content-visibility: auto;
    }

    .active {
        background: green;
    }
</style>
