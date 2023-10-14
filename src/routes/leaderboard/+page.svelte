<slot />

<div class="flex flex-col m-6 space-y-6 md:space-y-0 md:space-x-6 md:flex-row justify-center">
  <ul role="list" class="divide-y divide-gray-100">
    {#each {length: data_length} as _, i}
        <li class="flex justify-between gap-x-6 py-5">
            <div class="flex min-w-0 gap-x-4">
                {#if i == 0}
                    <p class="text-sm font-semibold leading-6 text-orange-300 mr-5">{data.submissions[i].user_name}</p>
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold leading-6 text-orange-300 mr-5">{data.submissions[i].total_points}</p>
                    </div>
                    <div class="min-w-0 flex-aut">
                        <p class="text-sm font-semibold leading-6 text-orange-300">{data.submissions[i].school}</p>
                    </div>
                {:else if i == 1}
                    <p class="text-sm font-semibold leading-6 text-slate-500 mr-5">{data.submissions[i].user_name}</p>
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold leading-6 text-slate-500 mr-5">{data.submissions[i].total_points}</p>
                    </div>
                    <div class="min-w-0 flex-aut">
                        <p class="text-sm font-semibold leading-6 text-slate-500">{data.submissions[i].school}</p>
                    </div>
                {:else if i == 2}
                    <p class="text-sm font-semibold leading-6 text-orange-700 mr-5">{data.submissions[i].user_name}</p>
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold leading-6 text-orange-700 mr-5">{data.submissions[i].total_points}</p>
                    </div>
                    <div class="min-w-0 flex-aut">
                        <p class="text-sm font-semibold leading-6 text-orange-700">{data.submissions[i].school}</p>
                    </div>
                {:else}
                    {data.submissions.user_name}
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold leading-6 text-gray-900 mr-5">{data.submissions[i].total_points}</p>
                    </div>
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold leading-6 text-gray-900 mr-5">{data.submissions[i].school}</p>
                    </div>
                {/if}
            </div>
        </li>
    {/each}
  </ul>
</div>

// TODO: Can also add a section for the problem breakdown. like for each problem, how many people solved it, how many people attempted it, etc.

<script>
    export let data;
    export let data_length = Object.keys(data.submissions).length;
</script>