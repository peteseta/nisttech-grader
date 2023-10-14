<script>   
    import { user } from '../../stores/user.js';

    let currentUser = { name: null, email: null, userId: null };

    // subscribe to the user store
    user.subscribe(value => {
        currentUser = value;
    });

    export let data;
    let problems = data.problems;
    let submissions = data.submissions;

    let problemsWithUserSubmissions = problems.map(problem => {
    const userSubmissions = submissions.filter(sub => 
        sub.problem_no === problem.problem_no && sub.user_id === currentUser.userId
    );

    // console.log("userSubmissions", userSubmissions);

    let highestScoringSubmission;
    if (userSubmissions.length > 0) {
        highestScoringSubmission = userSubmissions.reduce((prev, current) => {
            if (current.points > prev.points) {
                return current;
            }
            // if the points are the same, return the most recent submission
            if (current.points === prev.points && new Date(current.submitted_at) > new Date(prev.submitted_at)) {
                return current;
            }
            return prev;
        });
    } else {
        highestScoringSubmission = null;
    }

    // console.log("highestScoringSubmission", highestScoringSubmission);

    let otherSubmissions;
    if (userSubmissions.length > 1) {
        otherSubmissions = userSubmissions.filter(submission => submission !== highestScoringSubmission);
    } else {
        otherSubmissions = null;
    }

    // console.log("otherSubmissions", otherSubmissions);
    
    return { ...problem, highestScoringSubmission, otherSubmissions };  
    });

    // console.log("user's name", currentUser.name);
    // console.log("problemswus", problemsWithUserSubmissions);

    const formatDate = function(timestamp) {
    // Initialize the Date object
    const date = new Date(timestamp);

    // Extract details
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed in JS
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Format and return
    return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
}
</script>

{#if currentUser.name && currentUser.email && currentUser.userId}
    <div class="container flex flex-col items-center mx-auto my-6">
    {#each problemsWithUserSubmissions as problem}
        <div class="p-4 mb-6 w-full max-w-lg rounded-lg border-2 border-slate-300">
            <h2 class="mb-4 text-xl font-bold">Problem {problem.problem_no}</h2>
            {#if problem.highestScoringSubmission}
            <h3 class="mb-2 text-lg font-medium text-slate-500">HIGHEST SCORING</h3>
            <div class="p-4 mb-4 rounded bg-slate-200">
                <div class="p-4 rounded border-2 border-slate-600">
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <div class="text-sm font-medium text-gray-600">Points</div>
                            <div class="text-lg">{problem.highestScoringSubmission.points}/10</div>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-600">Memory</div>
                            <div class="text-lg">{(problem.highestScoringSubmission.memory/1000).toFixed(1)} MB</div>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-600">Runtime</div>
                            <div class="text-lg">{problem.highestScoringSubmission.runtime}s</div>
                        </div>
                    </div>
                </div>
                <p class="mt-2 text-gray-600">Submitted at {formatDate(problem.highestScoringSubmission.submitted_at)}</p>
            </div>

            <div class="mb-4">
                <h3 class="mb-2 text-lg font-medium">OTHER SUBMISSIONS</h3>
                {#each problem.otherSubmissions as submission}
                    <div class="p-4 mb-2 rounded border-2 border-gray-300">
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <div class="text-sm font-medium text-gray-600">Points</div>
                                <div class="text-lg">{submission.points}/10</div>
                            </div>
                            <div>
                                <div class="text-sm font-medium text-gray-600">Memory</div>
                                <div class="text-lg">{(problem.highestScoringSubmission.memory/1000).toFixed(1)} MB</div>
                            </div>
                            <div>
                                <div class="text-sm font-medium text-gray-600">Runtime</div>
                                <div class="text-lg">{submission.runtime}s</div>
                            </div>
                        </div>
                        <p class="mt-2 text-gray-600">Submitted at {formatDate(submission.submitted_at)}</p>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-lg">No submissions yet.</div>
        {/if}
        </div>
    {/each}
    </div>
{:else}
    <div class="flex justify-center items-center m-20 min-h-4xl">
        <div class="p-4 text-white bg-gray-400 rounded-md">
            <p class="text-center">You are not logged in.</p>
            <a href="/auth" class="block mt-2 text-center underline">Click here to register or login.</a>
        </div>
    </div>
{/if}