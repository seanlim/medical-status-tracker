<script>
  import fetch from '~/fetch';

  let error = '';
  const users = fetch('users').then(({ data }) => data);

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch('delete-user', {
        method: 'DELETE',
        body: {
          id,
        },
      });
    } catch (err) {
      console.error(err);
      error = err;
    }
  };
</script>

<div class="container">
  {#await users}
    loading...
  {:then fetchedUsers}
    <p class="error">{error}</p>
    <table>
      <thead>
        <th>Name</th>
        <th>Role </th>
        <th />
      </thead>
      {#each fetchedUsers as user}
        <tr>
          <td>{user.name}</td>
          <td>{user.role}</td>
          <td class="action"
            ><button on:click={() => handleDeleteUser(user.id)} class="delete"
              >Delete</button
            ></td
          >
        </tr>
      {/each}

      {#if fetchedUsers.length === 0}
        <p class="empty">No users</p>
      {/if}
    </table>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>

<style>
  .container {
    padding: 0 10px;
  }

  table {
    width: 100%;
  }

  th {
    text-align: left;
  }

  td {
    border-bottom: solid 1px #f5f5f5;
    padding: 10px 0;
  }

  td.action {
    text-align: right;
  }

  .empty {
    color: gray;
  }
</style>
