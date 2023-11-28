<script>
    import {PUBLIC_BACKEND_BASE_URL} from '$env/static/public';
    import {goto} from '$app/navigation';
    import { authenticateUser} from './../../../utils/auth.js';
    import { isValidToken } from './../../../utils/auth.js';
    import Spinner from "../../../lib/Spinner.svelte";
    
    let formErrors = {};
    let loading = false;

    async function postSignup(){
        isValidToken();
        goto('/');
        loading = false;
    }

    async function createUser(evt){
        evt.preventDefault();
        loading = true;
        const userData = {
            name: evt.target['name'].value,
            email: evt.target['email'].value,
            password: evt.target['password'].value
        };

        const resp = await fetch(PUBLIC_BACKEND_BASE_URL+'/users',{
            method:"POST",
            mode:"cors",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify(userData)
        });

        if(resp.status==200){

            const res = await authenticateUser(userData.email, userData.password)

            if(res.success){
                postSignup();
            }else{
                
                loading = false;
                throw 'Sign up succeeded but authentication failed';
            }
        }else{
            
            const res = await resp.json();
            
            loading = false;
            formErrors = await res.error;
        }
    }

</script>


<svelte:head><title>NEXT photos | Sign Up</title></svelte:head>

<h1 class="text-center text-xl">Create an Account to Upload Photos</h1>
<div class="text-center">
    <a class="link-hover italic text-xs" href="/users/login">
    Already have an account? Click here to login instead.
    </a>
</div>


<div class="flex justify-center items-center mt=8">
    <form on:submit={createUser} class="w-1/3">
        <div class="form-control w-full">
            <label class="label" for="name">
                <span class="label-text">Username</span>
            </label>
            <input
                type="text"
                name="name"
                placeholder="John Doe"
                class="input input-bordered w-full"
            />
            {#if 'name' in formErrors}
                <label class="label" for="name">
                    <span class="label-text-alt text-red-500">{formErrors['name']}</span>                    
                </label>
            {/if}
        </div>

        <div class="form-control w-full">
            <label class="label" for="email">
                <span class="label-text">Email</span>
            </label>
            <input
                type="email"
                name="email"
                placeholder="john@example.com"
                class="input input-bordered w-full"
                required
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
            <button class="btn btn-md">Create an Account</button>
            {/if}
        </div>


    </form>
</div>