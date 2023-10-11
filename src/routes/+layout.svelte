<script>
    import "../app.css";
    import { page } from '$app/stores';

    let path;
    $: path = $page.url.pathname;

    let activeClass = "block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500";
    let inactiveClass = "block py-2 pr-4 pl-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";
</script>

<nav class="top-0 left-0 z-20 w-full bg-white border-b border-slate-200 dark:bg-gray-900 dark:border-gray-600">
    <div class="flex items-center p-4 mx-auto space-x-5">

        <a href="/">
            <img src="/logo.png" class="h-8" alt="nistTech Logo">
        </a>

        <div class="items-center w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul class="flex flex-col p-4 mt-4 font-medium bg-gray-50 rounded-lg border border-gray-100 md:p-0 md:flex-row md:space-x-4 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                <a href="/" class={path === '/' ? activeClass : inactiveClass}>Submit</a>
                </li>
                <li>
                <a href="/leaderboard" class={path === '/leaderboard' ? activeClass : inactiveClass}>Leaderboard</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<slot />