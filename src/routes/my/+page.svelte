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

        let otherSubmissions;
        if (userSubmissions.length > 1) {
            otherSubmissions = userSubmissions.filter(submission => submission !== highestScoringSubmission);
            // reverse the order of otherSubmissions to get the newest first
            otherSubmissions = otherSubmissions.reverse();
        } else {
            otherSubmissions = null;
        }
        
        return { ...problems, highestScoringSubmission, otherSubmissions };  
    });

    const formatDate = function(timestamp) {
        // Initialize the Date object
        const date = new Date(timestamp);

        // Extract details
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are 0-indexed in JS
        const day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        // Pad 0 to minutes or hours if it is a single digit
        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        // Format and return
        return `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
}
</script>

{#if currentUser.name && currentUser.email && currentUser.userId}
    <div class="container flex flex-col items-center mx-auto my-6 space-y-4">
        {#each problemsWithUserSubmissions as problem}
            <div class="flex flex-col w-full max-w-lg rounded-lg">
                {#if problem.highestScoringSubmission}
                    <!-- highest scoring submission -->
                    <div class="flex flex-col p-4 my-4 space-y-4 bg-gradient-to-r from-pink-100 to-pink-200 rounded-md shadow-sm text-slate-900">
                        
                        <!-- problem no and points earned -->
                        <div class="flex flex-row text-lg font-bold">
                            <p class="w-2/3">→ Problem {problem.highestScoringSubmission.problem_no}</p>
                            <p class="w-1/3 text-xl text-right">{problem.highestScoringSubmission.points}/{problems[problem.highestScoringSubmission.problem_no].points} pts</p>
                        </div>

                        <!-- submission details -->
                        <div class="flex flex-col p-4 space-y-4 bg-white rounded">
                            <div class="grid grid-cols-2">
                                <div>
                                    <div class="font-thin">MEMORY</div>
                                    <div class="font-mono">{(problem.highestScoringSubmission.memory/1000).toFixed(1)} MB</div>
                                </div>
                                <div>
                                    <div class="font-thin">RUNTIME</div>
                                    <div class="font-mono">{problem.highestScoringSubmission.runtime}s</div>
                                </div>
                            </div>
                            <div>
                                <div class="font-thin">SUBMITTED AT</div>
                                <div class="font-mono">{formatDate(problem.highestScoringSubmission.submitted_at)}</div>
                            </div>
                        </div>
                    </div>

                    <!-- other submissions for the same problem -->
                    {#if problem.otherSubmissions}
                        <div class="flex flex-col p-4 mb-4 space-y-4 bg-gradient-to-r rounded-md shadow-sm from-slate-100 to-slate-200 text-slate-900">
                            <p class="text-lg font-medium">Other submissions (newest first): </p>
                        
                            {#each problem.otherSubmissions as otherSubmissions}
                                <div class="flex flex-col p-4 space-y-4 bg-white rounded-md border border-slate-300 text-slate-900">
                                    <div class="flex flex-row font-bold">
                                        <p class="w-2/3">Submitted at: {formatDate(otherSubmissions.submitted_at)}</p>
                                        <p class="w-1/3 text-right">{otherSubmissions.points}/{problems[otherSubmissions.problem_no].points} pts</p>
                                    </div>
                                    
                                    <!-- submission details -->
                                    <div class="flex flex-col space-y-4 bg-white rounded">
                                            <div>
                                                <div class="font-thin">MEMORY</div>
                                                <div class="font-mono">{(otherSubmissions.memory/1000).toFixed(1)} MB</div>
                                            </div>
                                            <div>
                                                <div class="font-thin">RUNTIME</div>
                                                <div class="font-mono">{otherSubmissions.runtime}s</div>
                                            </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
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
