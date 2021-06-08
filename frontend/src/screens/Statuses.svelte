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

  const handleUpdateStatus = async (id, e) => {
    console.log(e.target.value);
    await fetch('update-status', {
      method: 'PUT',
      body: {
        id,
        status: e.target.value,
      },
    });
  };
</script>

<div class="container">
  {#await data}
    loading...
  {:then rows}
    <input
      class="name-search"
      type="text"
      placeholder="Search name..."
      bind:value={nameFilter}
    />
    <p>
      <input type="checkbox" bind:checked={showAll} /> Show All
    </p>
    <p class:hidden={coys.length < 2}>
      Company: <select bind:value={coyFilter}>
        <option value="all">all</option>
        {#each coys as coy}
          <option value={coy}>{coy}</option>
        {/each}
      </select>
    </p>
    <p class:hidden={plts.length < 2}>
      Platoon:
      <select bind:value={pltFilter}>
        <option value="all">all</option>
        {#each plts as plt}
          <option value={plt}>{plt}</option>
        {/each}
      </select>
    </p>
    <table>
      <thead>
        <th>Name</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Start</th>
        <th>End</th>
        <th>Approved</th>
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
          <td
            ><select
              value={row.approved}
              on:blur={(e) => handleUpdateStatus(row.id, e)}
            >
              <option value="0">Pending</option>
              <option value="1">Approved</option>
              <option value="2">Rejected</option>
            </select></td
          >
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

  .name-search {
    width: 100%;
  }
</style>
