<script>   
    import { user } from '../stores/user.js';
    import Form from '../lib/form.svelte';
    import Results from '../lib/results.svelte';

    let problemNumber;
    let submittedProblemNumber;
    let file;
    let results = null;
    let isLoading = false;
    let isError = false;
    let hasSubmitted = false;
    let points = 0;
    let maxPoints = 0;
    $: width = hasSubmitted ? "md:w-1/2" : "mx-auto max-w-md";

    let currentUser = { name: null, email: null, userId: null };

    // Subscribe to the user store
    user.subscribe(value => {
        currentUser = value;
    });

    const handleSubmit = async () => {  
        submittedProblemNumber = problemNumber;
        isLoading = true;
        hasSubmitted = true;

        const code = await readFile(file[0]);
        const ext = file[0].name.split('.').pop();

        let languages = {
            "py": "python",
            "c": "c",
            "cpp": "cpp",
            "java": "java",
            "js": "js"
        };

        const selectedLanguage = languages[ext];

        const response = await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: currentUser.userId,
                code: code,
                language: selectedLanguage,
                problemNumber: problemNumber
            })
        });
        if (response.ok) {
            let data = await response.json();
            results = data.results;
            points = data.points;
            maxPoints = data.maxPoints;

            // console.log(data);
        } else {
            // Handle HTTP error responses here
            const { error } = await response.json();
            console.error(error);
            isError = true;
        }

        isLoading = false;
    };

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            reader.readAsText(file);
        });
    }

</script>

<slot />

{#if currentUser.name && currentUser.email && currentUser.userId}
    <div class="flex flex-col m-6 space-y-6 md:space-y-0 md:space-x-6 md:flex-row">
        <Form bind:problemNumber bind:file {handleSubmit} {width}/>
        <Results {results} {isLoading} {hasSubmitted} {submittedProblemNumber} {points} {maxPoints} />
    </div>
{:else}
    <div class="flex justify-center items-center m-20 min-h-4xl">
        <div class="p-4 text-white bg-gray-400 rounded-md">
            <p class="text-center">You are not logged in.</p>
            <a href="/auth" class="block mt-2 text-center underline">Click here to register or login.</a>
        </div>
    </div>
{/if}
