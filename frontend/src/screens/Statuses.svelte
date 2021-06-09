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
    <div class="legend">
      <div class="square light-duty" />
      : Light Duty
      <div class="square active" />
      : On Status
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <th>Name</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Start</th>
          <th>End</th>
          <th>MC ID</th>
          <th>Location</th>
          <th>Date Submit</th>
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
            <td>{row.recordID}</td>
            <td>{row.recordLocation}</td>
            <td>{row.dateSubmit}</td>
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
    </div>
  {:catch error}
    <p class="error">{error}</p>
  {/await}
</div>

<style>
  .container {
    width: 100vw;
    padding: 0 10px;
  }

  .legend {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  .legend > * {
    margin: 5px;
  }

  .light-duty {
    background: rgba(233, 255, 106, 0.473);
  }
  .active {
    background: rgba(255, 106, 106, 0.473);
  }
  .square {
    height: 15px;
    width: 15px;
  }

  .table-wrapper {
    overflow-x: auto;
    width: 100%;
    height: 400px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    height: 100%;
  }

  td,
  th {
    border-bottom: 1px solid gray;
    padding: 10px 5px;
    font-size: 16px;
  }

  th {
    position: sticky;
    background: #f5f5f5;
    top: 0 px;
    text-align: left;
    font-size: 16px;
  }
  .hidden {
    display: none;
  }

  .name-search {
    width: 100%;
  }
</style>
