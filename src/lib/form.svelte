<script>
    export let problemNumber;
    export let file;
    export let handleSubmit;
    export let width;
</script>

<div class="flex flex-col space-y-4 rounded-lg {width} items-left">
    <div class="p-4 text-lg font-bold bg-gradient-to-r rounded-md shadow-sm from-slate-100 to-slate-200 text-slate-900">
        <p>→ submit a new attempt</p>
    </div>

    <div class="flex flex-col p-6 space-y-4 rounded-md border shadow-sm md-4">
        <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
            <input type="number" bind:value={problemNumber} placeholder="problem number" class="p-4 w-full rounded-md border" required min="0"/>
            <input type="file" bind:files={file} accept=".py,.c,.cpp,.java,.js" placeholder="Upload solution file (.py, .c, .cpp, .java, .js)" class="p-4 w-full bg-white rounded-md border" required/>
            <button type="submit" class="px-4 py-3 font-bold text-white bg-orange-400 rounded-md hover:bg-orange-500 hover:text-orange-100" required>
                submit solution
            </button>
        </form>
    </div>
</div>