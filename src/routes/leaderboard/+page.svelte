<script>
    export let data;
    export let data_length = Object.keys(data.submissions).length;

    function getRowColor(index) {
        if(index === 0) return 'bg-orange-100';
        if(index === 1) return 'bg-slate-100';
        if(index === 2) return 'bg-purple-100';
        return 'text-slate-800';
    }
</script>

<h3 style="text-align: center;" class="px-6 py-3 text-m font-medium text-left uppercase text-slate-500">Top 20 Competitors</h3>
<div class="flex flex-col m-6">
    <div class="overflow-hidden rounded-md border">
        <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-xs font-medium text-left uppercase text-slate-500">Place</th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium text-left uppercase text-slate-500">Name</th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium text-left uppercase text-slate-500">School</th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium text-right uppercase text-slate-500">Score</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
                {#each {length: data_length} as _, i}
                    <tr class="{getRowColor(i)}">
                        <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">{i + 1}</td>
                        <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">{data.submissions[i].user_name}</td>
                        <td class="px-6 py-4 text-sm whitespace-nowrap">{data.submissions[i].school}</td>
                        <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">{data.submissions[i].total_points} points</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<!-- TODO: Can also add a section for the problem breakdown. like for each problem, how many people solved it, how many people attempted it, etc. -->