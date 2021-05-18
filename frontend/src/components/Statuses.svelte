<script>
  import { onMount } from 'svelte';

  import fetch from '../fetch';
  import Nav from './Nav.svelte';

  let data = null,
    error = null,
    selectedCoy = null,
    selectedPlt = 'all',
    initialsQuery = '',
    showAll = false;

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
  <Nav title="Medical Statuses" />
  {#if data === null}
    {#if error !== null}
      {error}
    {:else}
      <p>loading...</p>
    {/if}
  {:else}
    <div class="filters">
      Coy: <select bind:value={selectedCoy}>
        {#each Object.keys(data) as coy}
          <option value={coy}>{coy}</option>
        {/each}
      </select>
      <input
        bind:value={initialsQuery}
        type="text"
        placeholder="Search initials..."
      />
      Platoon:
      <select bind:value={selectedPlt}>
        {#each ['all', '1', '2', '3', '4', '5', '6', 'HQ'] as plt}
          <option value={plt}>{plt}</option>
        {/each}
      </select>
      <input type="checkbox" bind:checked={showAll} /> Show all records
    </div>
    {#each data[selectedCoy] as record}
      <div
        class:hidden={(initialsQuery !== '' &&
          !record.initials.includes(initialsQuery.toUpperCase())) ||
          (!showAll && !record.statusActive) ||
          (selectedPlt !== 'all' && record.platoon !== selectedPlt)}
        class:active={record.statusActive}
        class="record"
      >
        <h3>{`${record.initials}, ${record.platoon}`}</h3>
        <div class="record-content">
          <p class="record-description">
            {`${record.status} ${
              record.reasoning !== '' ? `(${record.reasoning})` : ''
            }`}
          </p>
          <p class="record-date">
            {`${record.start} - ${record.end}`}
          </p>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .container {
    width: 100vw;
  }

  .active {
    background: rgba(255, 190, 106, 0.473);
  }

  .record {
    border-bottom: #f5f5f5 solid 1px;
    padding: 5px;
  }

  .record-description {
    margin: 5px 0;
  }

  .record-date {
    color: #555555;
    font-weight: 600;
  }

  .filters {
    padding: 10px 5px;
  }

  h3,
  p {
    margin: 0;
  }

  .hidden {
    display: none;
  }
</style>
