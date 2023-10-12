<script>   
    import { user } from '../../stores/user.js';

    let currentUser = { name: null, email: null, userId: null };

    // subscribe to the user store
    user.subscribe(value => {
        currentUser = value;
    });

</script>

<slot />

{#if currentUser.name && currentUser.email && currentUser.userId}
    <div class="flex flex-col m-6 space-y-6 md:space-y-0 md:space-x-6 md:flex-row">
        // TODO: get all submissions that are by user.userId.
        // show points etc for each.
        // show total points for user
    </div>
{:else}
    <div class="flex justify-center items-center m-20 min-h-4xl">
        <div class="p-4 text-white bg-gray-400 rounded-md">
            <p class="text-center">You are not logged in.</p>
            <a href="/auth" class="block mt-2 text-center underline">Click here to register or login.</a>
        </div>
    </div>
{/if}