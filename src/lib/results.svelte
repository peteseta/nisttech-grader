<script>
    export let results;
    export let isLoading;
    export let hasSubmitted;
    export let problemNumber;
    export let passedTests;

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
    <div class="flex flex-col p-6 space-y-4 w-1/2 rounded-lg border bg-slate-100 border-slate-300 items-left">
        <h2 class="m-1 text-xl font-bold text-slate-700">your results for problem {problemNumber}</h2>

        {#if isLoading}
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
        {:else if results}
            {#each results.results as result}
                <div class="flex flex-col p-4 rounded-md border border-slate-300 text-slate-700">
                    <div class={result.status === 'PASSED' ? 'font-bold text-green-600' : 'font-bold text-red-600'}>
                        test case id {result.testCaseId}: {result.status.charAt(0).toUpperCase() + result.status.slice(1).toLowerCase()}
                    </div >
                    received output: {result.received}<br>
                    expected output: {result.expected}<br>
                    memory usage: {result.memory}<br>
                    time taken: {result.time}s<br>
                </div>
            {/each}

            <h3 class="mt-2 font-semibold text-slate-700">total score for problem {problemNumber}: {passedTests}/{results.results.length}</h3>
        {/if}
    </div>
{/if}