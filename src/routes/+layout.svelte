<script>
    import "../app.css";
    import { page } from '$app/stores';
    import { user } from '../stores/user.js';

    let currentUser = { name: null, email: null, userId: null};

    // subscribe to the user store
    user.subscribe(value => {
        currentUser = value;
    });

    let path;
    $: path = $page.url.pathname;

    let activeClass = "text-orange-600 rounded hover:bg-gray-100";
    let inactiveClass = "text-slate-500 rounded hover:bg-gray-100";

    let userName = ""
    let userEmail = ""
</script>

<nav class="top-0 left-0 z-20 w-full bg-white border-b border-slate-20">
    <div class="flex justify-between items-center p-4 mx-auto space-x-5">

        <a href="/">
            <img src="/logo.png" class="h-14" alt="nistTech Logo">
        </a>

        <div class="flex items-center w-auto" id="navbar-sticky">
            <ul class="flex flex-row p-4 space-x-4 font-medium bg-gray-50 rounded-lg border border-gray-100">
                <li>
                <a href="/" class={path === '/' ? activeClass : inactiveClass}>Submit</a>
                </li>
                <li>
                    <a href="/leaderboard" class={path === '/leaderboard' ? activeClass : inactiveClass}>Leaderboard</a>
                </li>
                <li>
                    <a href="/my" class={path === '/my' ? activeClass : inactiveClass}>My Submissions</a>
                </li>
            </ul>
        </div>

        <div class="flex flex-col p-4">
            {#if currentUser.name && currentUser.email && currentUser.userId}
                <p>Logged in as <strong>{currentUser.name}</strong></p>
            {:else}
                <p>Not logged in.</p>
            {/if}
            <ul class="flex flex-col items-end">
                <li>
                    <a href="/auth" class={`${path === '/auth' ? activeClass : inactiveClass}`}>Manage Account</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<slot />