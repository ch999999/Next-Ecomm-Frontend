<script>
    import {authenticateUser} from "../../../utils/auth";
    import {goto} from "$app/navigation";
    import { isValidToken } from "../../../utils/auth";
    import Spinner from "../../../lib/Spinner.svelte";
    import { alerts } from "../../../utils/alerts";

    let formErrors={};
    let loading = false;
    function postLogIn(){
        isValidToken();
        alerts.clearAlert();
        goto('/');
        loading = false;
    }

    async function logIn(evt){
        evt.preventDefault();
        loading = true
        const userData = {
            email: evt.target['email'].value,
            password: evt.target['password'].value
        };

        const resp = await authenticateUser(userData.email, userData.password);

        if(resp.success){
            postLogIn();
            loading = false;
        }else{
            alerts.setAlert("Invalid email or password.", "alert-error");
            loading = false;
        }
        loading = false;
    }
</script>


<svelte:head><title>NEXT photos | Login</title></svelte:head>
<h1 class="text-center text-xl">Login</h1>
<div class="flex justify-center items-center mt=8">
    <form on:submit={logIn} class="w-1/3">
        <div class="form-control w-full">
            <label class="label" for="email">
                <span class="label-text">Email</span>
            </label>
            <input
                type="text"
                name="email"
                placeholder="johndoe@example.com"
                class="input input-bordered w-full"
            />
            {#if 'email' in formErrors}
            <label class="label" for="email">
                <span class="label-text-alt text-red-500">{formErrors['email']}</span>
            </label>
            {/if}
        </div>

        <div class="form-control w-full">
            <label class="label" for="password">
                <span class="label-text">Password</span>
            </label>
            <input
                type="password"
                name="password"
                placeholder=""
                class="input input-bordered w-full"
                required
            />
            {#if 'password' in formErrors}
            <label class="label" for="password">
                <span class="label-text-alt text-red-500">{formErrors['password']}</span>
            </label>
            {/if}
        </div>

        <div class="form-control w-full mt-4">
            {#if loading==true}
            <button class="btn btn-md"><Spinner/></button>
            {:else}
            <button class="btn btn-md">Log in</button>
            {/if}
        </div>


    </form>
</div>