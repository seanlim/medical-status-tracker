<script>
    import { onMount } from 'svelte';

    import fetch from '../fetch';

    let data = null,
        selectedCoy = null;

    onMount(() =>
        fetch('medical-statuses').then((res) => {
            data = res.data;
            selectedCoy = Object.keys(data)[0];
        })
    );
</script>

<div class="container">
    {#if data === null}
        <p>loading...</p>
    {:else}
        <select bind:value={selectedCoy}>
            {#each Object.keys(data) as coy}
                <option value={coy}>{coy}</option>
            {/each}
        </select>
        <table>
            <tr>
                <th>initials</th>
                <th>platoon</th>
                <th>status</th>
                <th>reasoning</th>
                <th>start</th>
                <th>end</th>
                <th>duration</th>
                <th />
            </tr>
            {#each data[selectedCoy] as record}
                <tr>
                    <td>{record.initials}</td>
                    <td>{record.platoon}</td>
                    <td>{record.status}</td>
                    <td>{record.reasoning}</td>
                    <td>{record.start}</td>
                    <td>{record.end}</td>
                    <td>{record.duration}</td>
                </tr>
            {/each}
        </table>
    {/if}
</div>

<style>
    .container {
    }
</style>
