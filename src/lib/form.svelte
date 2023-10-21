<script>
    export let problemNumber;
    export let file;
    export let handleSubmit;
    export let width;
</script>

<div class="flex flex-col p-6 space-y-4 bg-white rounded-lg border {width} items-left border-slate-300">
    <h2 class="m-1 text-xl font-bold text-slate-700">submit a new attempt</h2>
    <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
        <input type="number" bind:value={problemNumber} placeholder="problem number" class="p-3 w-full rounded-md border" required min="0"/>
        <input type="file" bind:files={file} accept=".py,.c,.cpp,.java,.js" placeholder="Upload solution file (.py, .c, .cpp, .java, .js)" class="p-4 w-full rounded-md border" required/>
        <button type="submit" class="px-4 py-3 font-bold text-white bg-orange-400 rounded-md hover:bg-orange-500 hover:text-orange-100" required>
            submit solution
        </button>
    </form>
</div>