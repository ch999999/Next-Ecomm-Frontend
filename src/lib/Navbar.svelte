<script>
	import {isLoggedIn} from "../utils/auth";
	import {logOut} from "../utils/auth";
	
    let LoggedInValue;

	isLoggedIn.subscribe((value)=>{
		LoggedInValue = value;
	});

</script>

<div class="navbar bg-base-100 sticky top-0">
	<div class="flex-1"><a href="/" class="btn btn-ghost normal-case text-xl">PHOTOS</a></div>
	<div class="flex-none">
		
		<ul class="menu menu-horizontal px-1"><li><a class=""><img class=" btn-circle bg-white w-7 h-7" src="https://www.svgrepo.com/show/309493/dark-theme.svg" alt="Change Theme"></a></li></ul>
		<!-- show logout if user in not logged in, log in and sign up other wise -->
		{#if LoggedInValue}
		<ul class="menu menu-horizontal px-1"><li><a on:click={logOut} href="/users/login">Log Out</a></li></ul>
		{:else}
		<ul class="menu menu-horizontal px-1"><li><a href="/users/login">Log In</a></li></ul>
		<ul class="menu menu-horizontal px-1"><li><a href="/users/new">Sign up</a></li></ul>
		{/if}
		
	</div>
</div>