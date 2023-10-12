<script>
    import "../app.css";
    import { page } from '$app/stores';

    let path;
    $: path = $page.url.pathname;

    let activeClass = "text-orange-600 rounded hover:bg-gray-100";
    let inactiveClass = "text-gray-900 rounded hover:bg-gray-100";
</script>

<nav class="top-0 left-0 z-20 w-full bg-white border-b border-slate-20">
    <div class="flex justify-between items-center p-4 mx-auto space-x-5">

        <a href="/">
            <img src="/logo.png" class="h-12" alt="nistTech Logo">
        </a>

        <div class="flex items-center w-auto" id="navbar-sticky">
            <ul class="flex flex-row p-4 space-x-4 font-medium bg-gray-50 rounded-lg border border-gray-100">
                <li>
                <a href="/" class={path === '/' ? activeClass : inactiveClass}>Submit</a>
                </li>
                <li>
                <a href="/leaderboard" class={path === '/leaderboard' ? activeClass : inactiveClass}>Leaderboard</a>
                </li>
            </ul>
        </div>

        <div class="flex p-4">
            <ul class="flex">
                <li>
                    <a href="/auth" class={path === '/auth' ? activeClass : inactiveClass}>Register/Login</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<slot />