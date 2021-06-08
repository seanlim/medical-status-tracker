<script>
  import fetch from '~/fetch';
  import uniq from 'lodash/uniq';

  let showAll = false,
    nameFilter = '',
    coyFilter = 'all',
    pltFilter = 'all',
    coys = [],
    plts = [];

  const data = fetch('medical-statuses').then(({ data }) => {
    coys = uniq(data.map((r) => r.coy));
    plts = uniq(data.map((r) => r.platoon));
    return data;
  });
</script>

<div class="container">
  {#await data}
    loading...
  {:then rows}
    <input type="text" bind:value={nameFilter} />
    <input type="checkbox" bind:checked={showAll} />
    <select bind:value={coyFilter}>
      <option value="all">all</option>
      {#each coys as coy}
        <option value={coy}>{coy}</option>
      {/each}
    </select>
    <select bind:value={pltFilter}>
      <option value="all">all</option>
      {#each plts as plt}
        <option value={plt}>{plt}</option>
      {/each}
    </select>
    <table>
      <thead>
        <th>Name</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Start</th>
        <th>End</th>
      </thead>
      {#each rows as row}
        <tr
          class:hidden={(!showAll && !row._statusActive && !row._lightDuty) ||
            (coyFilter !== 'all' && row.coy !== coyFilter) ||
            (pltFilter !== 'all' && row.platoon !== pltFilter) ||
            (nameFilter !== '' &&
              !row.name.toLowerCase().includes(nameFilter.toLowerCase()))}
          class:light-duty={row._lightDuty}
          class:active={row._statusActive}
        >
          <td>{row.name}</td>
          <td>{row.reason}</td>
          <td>{row.status}</td>
          <td>{row.start}</td>
          <td>{row.end}</td>
        </tr>
      {/each}
    </table>
  {:catch error}
    <p class="error">{error}</p>
  {/await}
</div>

<style>
  .container {
    width: 100vw;
    padding: 0 10px;
  }

  .light-duty {
    background: rgba(233, 255, 106, 0.473);
  }
  .active {
    background: rgba(255, 106, 106, 0.473);
  }

  table {
    border-collapse: collapse;
  }

  table,
  tr {
    width: 100%;
  }

  td {
    border-bottom: 1px solid gray;
    padding: 10px 5px;
  }

  th {
    text-align: left;
  }
  .hidden {
    display: none;
  }
</style>
