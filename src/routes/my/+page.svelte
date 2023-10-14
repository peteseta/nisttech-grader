<script>   
    import { user } from '../../stores/user.js';

    let currentUser = { name: null, email: null, userId: null };

    // subscribe to the user store
    user.subscribe(value => {
        currentUser = value;
    });

    export let data
    console.log(data)
</script>

<slot />

{#if currentUser.name && currentUser.email && currentUser.userId}
    <div class="flex flex-col m-6 space-y-6 md:space-y-0 md:space-x-6 md:flex-row">
        <table class="table-fixed">
            <thead>
              <tr>
                <th>Username</th>
                <th>Time Submitted</th>
                <th>Memory Usage (MiB)</th>
                <th>Runtime (s)</th>
                <th>Problem Number</th>
                <th>Points Recieved</th>
              </tr>
            </thead>
            <tbody>
            {#each data.submissions as submission}
                {#if submission.user_name == currentUser.name}
                    <tr>
                        <td>{submission.user_name}</td>
                        <td>{submission.submitted_at}</td>
                        <td>{submission.memory}</td>
                        <td>{submission.runtime}</td>
                        <td>{submission.problem_no}</td>
                        <td>{submission.points}</td>
                    </tr>
                {/if}
            {/each}

            </tbody>
          </table>
    </div>
{:else}
    <div class="flex justify-center items-center m-20 min-h-4xl">
        <div class="p-4 text-white bg-gray-400 rounded-md">
            <p class="text-center">You are not logged in.</p>
            <a href="/auth" class="block mt-2 text-center underline">Click here to register or login.</a>
        </div>
    </div>
{/if}