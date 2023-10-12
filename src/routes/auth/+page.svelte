<script>
    let name = "";
    let email = "";
    let password = "";
    let school = "";
    let error = "";

    let isRegistering = true;

    const register = async () => {
        if (!name || !email || !password || !school) {
            error = "Please fill in all fields.";
            return;
        }

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, password: password, school: school })
        });

        if (response.ok) {
            // Registration successful
            const { user } = await response.json();
            console.log('User registered: ' + user);
        } else {
            // Registration failed
            const { error: signUpError } = await response.json();
            error = signUpError;
        }

        // Clear the form and error message
        name = "";
        email = "";
        password = "";
        school = "";

        isRegistering = false;
    };

    const login = async () => {
        const res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            // Login successful
            const { user } = await res.json();
            console.log('User logged in:', user);

            localStorage.setItem('name', user.user_metadata.name);
            localStorage.setItem('email', user.email);
            localStorage.setItem('userId', user.id);
        } else {
            // Login failed
            const { error: loginError } = await res.json();
            error = loginError;
        }

        // Clear the form and error message
        email = "";
        password = "";
    };
</script>

<div class="flex flex-col p-6 m-6 space-y-4 bg-white rounded-lg border items-left border-slate-300">
    <h2 class="m-1 text-xl font-bold text-slate-700">{isRegistering ? 'Register' : 'Login'}</h2>
    <form class="space-y-4" on:submit|preventDefault={isRegistering ? register : login}>
        {#if isRegistering}
            <input type="text" bind:value={name} placeholder="Full name" class="p-3 w-full rounded-md border" required />
        {/if}
        <input type="email" bind:value={email} placeholder="Email" class="p-3 w-full rounded-md border" required />
        <input type="password" bind:value={password} placeholder="Password" class="p-3 w-full rounded-md border" required minlength="6" title="Password must be at least 6 characters long" />
        {#if isRegistering}
            <input type="text" bind:value={school} placeholder="School" class="p-3 w-full rounded-md border" required />
        {/if}
        <button type="submit" class="px-4 py-4 font-bold text-white bg-orange-400 rounded-md hover:bg-orange-500 hover:text-orange-100">
            {isRegistering ? 'Register' : 'Login'}
        </button>
    </form>
    <button on:click={() => isRegistering = !isRegistering} class="text-blue-500">
        {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
    </button>
    {#if error}
        <p class="text-red-500">{error}</p>
    {/if}
</div>