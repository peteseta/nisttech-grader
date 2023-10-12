<script>
    export let results;
    export let isLoading;
    export let hasSubmitted;
    export let problemNumber;
    export let points;
    export let maxPoints;

    // isLoading = true;
    // hasSubmitted = true;
    // results = {
    //     "results": [{
    //         "testCaseId": 1,
    //         "status": "FAILED",
    //         "received": "8",
    //         "expected": "7",
    //         "memory": 13892,
    //         "time": "0.195",
    //         "error": null
    //     }, {
    //         "testCaseId": 2,
    //         "status": "FAILED",
    //         "received": "16",
    //         "expected": "15",
    //         "memory": 13668,
    //         "time": "0.185",
    //         "error": null
    //     }, {
    //         "testCaseId": 3,
    //         "status": "FAILED",
    //         "received": "38",
    //         "expected": "37",
    //         "memory": 13660,
    //         "time": "0.195",
    //         "error": null
    //     }]
    // }
</script>

{#if hasSubmitted}
    <div class="flex flex-col p-6 space-y-4 rounded-lg border md:w-1/2 bg-slate-100 border-slate-300 items-left">
        <h2 class="m-1 text-xl font-bold text-slate-700">your results for problem {problemNumber}</h2>

        {#if isLoading}
            <div class="p-1">
                <p class="h-6 w-6 animate-spin rounded-full border-4 border-slate-700 border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status" />
            </div>
        {:else if results}
            {#each results as result}
                <div class="flex flex-col p-4 rounded-md border border-slate-300 text-slate-700">
                    <div class={result.status === 'PASSED' ? 'font-bold text-green-600' : 'font-bold text-red-600'}>
                        test case id {result.testCaseId}: {result.status.charAt(0).toUpperCase() + result.status.slice(1).toLowerCase()}
                    </div >
                    {#if result.testCaseID === 'PASSED'}
                        received output: {result.received}<br>
                        expected output: {result.expected}<br>
                    {/if}
                    memory usage: {result.memory}<br>
                    time taken: {result.time}s<br>
                </div>
            {/each}

            <h3 class="p-1 mt-2 font-semibold text-slate-700">total score: {points}/{maxPoints}</h3>
        {/if}
    </div>
{/if}