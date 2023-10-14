<script>
    export let data;
    export let data_length = Object.keys(data.submissions).length;
</script>

<div class="flex justify-center m-6 md:space-y-0 md:space-x-6 md:flex-row">
    <table class="w-screen table-auto md:max-w-3xl">
        <thead>
            <tr class="text-center">
                <th class="px-4 py-2 font-bold">Place</th>
                <th class="px-4 py-2 font-bold">Name</th>
                <th class="px-4 py-2">School</th>
                <th class="px-4 py-2">Score</th>
            </tr>
        </thead>
        <tbody>
            {#each {length: data_length} as _, i}
                <tr class="{i == 0 ? 'text-orange-300' : i == 1 ? 'text-slate-500' : i == 2 ? 'text-orange-700' : 'text-gray-900'} text-center">
                    <td class="px-4 py-2 font-semibold border">{i + 1}</td>
                    <td class="px-4 py-2 font-semibold border">{data.submissions[i].user_name}</td>
                    <td class="px-4 py-2 text-sm font-semibold border">{data.submissions[i].school}</td>
                    <td class="px-4 py-2 text-sm font-semibold border">{data.submissions[i].total_points} points</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- TODO: Can also add a section for the problem breakdown. like for each problem, how many people solved it, how many people attempted it, etc. -->