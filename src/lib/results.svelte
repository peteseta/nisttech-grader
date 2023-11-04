<script>
    export let results;
    export let isLoading;
    export let hasSubmitted;
    export let submittedProblemNumber;
    export let points;
    export let maxPoints;
</script>

{#if hasSubmitted}
    <div class="flex flex-col px-4 space-y-4 rounded-lg md:w-1/2 items-left">
        {#if isLoading}
            <h2 class="m-1 text-xl font-bold text-slate-700">→ grading your work for problem {submittedProblemNumber}</h2>
            <div class="p-1">
                <p class="h-6 w-6 animate-spin rounded-full border-4 border-slate-700 border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status" />
            </div>
        {:else if results}
            <div class="flex flex-row p-4 text-lg font-bold bg-gradient-to-r from-pink-100 to-pink-200 rounded-md shadow-sm text-slate-900">
                <p class="w-2/3">→ your score for problem {submittedProblemNumber}</p>
                <p class="w-1/3 text-xl text-right">{points}/{maxPoints}</p>
            </div>
            {#each results as result}

                <div class="flex flex-col p-4 space-y-4 rounded-md border shadow-sm md-4 bg-slate-100">
                    
                    <!-- result/test case id heading -->
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-white rounded-md border items-horizon border-slate-300 via-white {result.status === 'Passed' ? 'to-green-100' : 'to-red-100'}">
                        <p class="font-mono text-sm">test_case_id: {result.testCaseId}</p>
                        <p class="{result.status === 'Passed' ? 'font-mono font-bold text-lg text-green-600' : 'font-mono font-bold text-lg text-red-600'}">{result.status}</p>
                    </div>

                    <!-- runtime information -->
                    <div class="flex justify-between p-4 font-mono text-blue-700 bg-blue-100 rounded-md border border-blue-300">
                        <div class="w-1/2">
                            <p class="font-sans font-thin">MEMORY USAGE</p>
                            {Math.round((result.memory / 1024) * 10) / 10} MB
                        </div>
                        <div class="w-1/2 text-right">
                            <p class="font-sans font-thin">TIME TAKEN</p>
                            {result.time}s
                        </div>
                    </div>

                    <!-- display info for failed test case -->
                    {#if result.status === 'Failed'}
                        <div class="flex flex-col p-4 space-y-4 rounded-md bg-slate-900 text-slate-100">
                            <code>
                                {#each result.input.split('\n') as line}
                                    > {line}<br>
                                {/each}
                                
                            </code>

                            <div class="p-4 text-red-300 rounded-md border border-slate-700 bg-slate-800"> 
                                recieved output:  
                                <strong>{result.received}</strong>
                            </div>

                            <div class="p-4 text-green-300 rounded-md border border-slate-700 bg-slate-800">   
                                expected output:
                                <strong>{result.expected}</strong><br>
                            </div>
                        </div>
                    {/if}

                    <!-- display compile/runtime error -->
                    {#if result.status === 'Compilation error' || result.status === 'Runtime error'}
                        <div class="flex flex-col p-4 space-y-4 rounded-md bg-slate-900 text-slate-100">
                            <code>
                                {#each result.input.split('\n') as line}
                                    > {line}<br>
                                {/each}
                                
                            </code>
                            <div class="p-4 text-red-200 rounded-md border border-slate-700 bg-slate-800"> 
                                <code class="text-10">
                                    {result.error}
                                </code>
                            </div>
                        </div>
                    {/if}                    
                </div>
            {/each}
        {/if}
    </div>
{/if}