<script>    
    import Form from '../lib/form.svelte';
    import Results from '../lib/results.svelte';

    let name = "";
    let email = "";
    let problemNumber;
    let file;
    let results = null;
    let isLoading = false;
    let hasSubmitted = false;
    $: passedTests = results?.results.filter(result => result.status === "PASSED").length || 0;

    const handleSubmit = async () => {  
        console.log("handleSubmit function entered.");
        console.log("Files:", file);

        if (!file || file.length === 0) {
            alert('Please select a solution file to submit.');
            return;
        }

        isLoading = true;
        hasSubmitted = true;

        const actualFile = file[0];
        console.log("Actual File:", actualFile);

        if (!actualFile || !actualFile.name) {
            console.error("File or file name is undefined.");
            return;
        }

        const code = await readFile(actualFile);
        
        console.log("File Name:", actualFile.name);
        const fileNameParts = actualFile.name.split('.');
        console.log("File Name Parts:", fileNameParts);
        const ext = fileNameParts.pop();
        console.log("Extracted Extension:", ext);

        let languages = {
            "py": "python",
            "c": "c",
            "cpp": "cpp",
            "java": "java",
            "js": "js"
        };

        const selectedLanguage = languages[ext];

        console.log({
            code: code,
            language: selectedLanguage,
            problemNumber: problemNumber
        });  // Log the data being sent to the server


        const response = await fetch("/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code,
                language: selectedLanguage,
                problemNumber: problemNumber
            })
        });

        results = await response.json();
        console.log(results)
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

<div class="flex flex-col m-6 space-y-6 md:space-y-0 max-w-screen md:max-w-6xl md:space-x-6 md:flex-row">
    <Form bind:name bind:email bind:problemNumber bind:file {handleSubmit} />
    <Results {results} {isLoading} {hasSubmitted} {problemNumber} {passedTests} />
</div>