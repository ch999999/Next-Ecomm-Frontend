<script>
	import { isLoggedIn } from '../utils/auth.js';
	import { goto } from '$app/navigation';
	import Modal from '../lib/Modal.svelte';
	import { uploadMedia } from '../utils/s3-uploader.js';
	import {generateFileWithUniqueName} from '../utils/filename-generator.js';
	import { getUserId } from '../utils/auth.js';
	import {PUBLIC_BACKEND_BASE_URL} from '$env/static/public';
	import { getTokenFromLocalStorage } from '../utils/auth.js';
	export let data;

	let showModal = false;
	let LogggedInValue;
	let formErrors = {};

	//get whether the user is logged in or not.
	isLoggedIn.subscribe((value) => {
		LogggedInValue = value;
	});

	function gotoUploadPage() {
		goto('../../images/upload');
	}

	function toggleModalVisibility() {
		if (showModal == false) {
			showModal = true;
		} else {
			showModal = false;
		}
	}

	function priceIsValid(price){
		const positiveNumberRegex = /^\d*\.?\d+$/;
		const twodecimalplaceRegex = /^\d+(\.\d{1,2})?$/;
		
		if(positiveNumberRegex.test(price)){ //if its a valid positive number, continue
			if(twodecimalplaceRegex.test(price)){ //if it contains 0-2 decimal places, return true
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

	function uploadIsValid(imgData) {
		if (typeof imgData['file'].files[0] === 'undefined') {
			formErrors['file'] = 'no file uploaded';
			return false;
		} else if (!imgData['file'].files[0].type.includes('image')) {
			formErrors['file'] = 'must be an image';
			return false;
		}
		
		if(imgData['title'].value.length==0){
			formErrors['title'] = "cannot be blank";
			return false;
		}

		if(imgData['description'].value.length==0){
			formErrors['description'] = {message: "cannot be blank"};
			return false;
		}

		if(!priceIsValid(imgData['price'].value)){
			formErrors['price'] = "must be a valid, non-negative number containing 0-2 decimal places";
			return false;
		}
		return true;
	}

	async function uploadImage(evt) {
		//evt.preventDefault();
		if(!uploadIsValid(evt.target)){
			
			return;
		}
		
		const fileToUpload = generateFileWithUniqueName(evt.target['file'].files[0]);
		const [fileName, fileUrl] = await uploadMedia(fileToUpload);
		
		try{
		const userId = getUserId();
		const imgData = {
			url: fileUrl,
			ownerId: userId,
			price: evt.target['price'].value,
			title: evt.target['title'].value,
			description: evt.target['description'].value
		}
		
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL+'/upload',{
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: "Bearer "+getTokenFromLocalStorage()
			},
			body: JSON.stringify(imgData)
		});

		if(resp.status==200){
			alert("upload successful!")
			
		}else{
			const res = await resp.json();
			alert(JSON.stringify(res));
		}
	}catch(err){
		alert(err)
	}
	}
</script>

<svelte:head>
	<script src="/aws-sdk-s3.min.js"></script>
</svelte:head>
<Modal bind:showModal>
	<form on:submit|preventDefault={uploadImage} >
		<div class="flex flex-col lg:flex-row">
			<div class="form-control w-full lg:w-1/2 mt-2">
				<input class="file-input w-full max-w-xs" type="file" name="file" />
			</div>
			{#if 'file' in formErrors}
			<label class='label' for="file">
				<span class="label-text-alt text-red-500">{formErrors['file']}</span>
			</label>
			{/if}
			<div class="w-full lg:w-1/2"></div>
		</div>
		<div class="form-control w-full">
			<label class="label" for="price"><span class="label-text">Price</span></label>
			<input type="text" name="price" placeholder="1.96" class="input input-bordered w-full" />
			{#if 'price' in formErrors}
			<label class='label' for="price">
				<span class="label-text-alt text-red-500">{formErrors['price']}</span>
			</label>
			{/if}
		</div>
		<div class="form-control w-full">
			<label class="label" for="title"><span class="label-text">Title</span></label>
			<input type="text" name="title" placeholder="Sunset" class="input input-bordered w-full" />
			{#if 'title' in formErrors}
			<label class='label' for="title">
				<span class="label-text-alt text-red-500">{formErrors['title']}</span>
			</label>
			{/if}
		</div>
		<class class="form-control w-full">
			<label class="label" for="description"><span class="label-text">Description</span></label>
			<textarea
				name="description"
				class="textarea textarea-bordered"
				placeholder="Beautiful Sunset in San Marino"
			></textarea>
			{#if 'description' in formErrors}
			
			<label class='label' for="description">
				<span class="label-text-alt text-red-500">{formErrors['description'].message}</span>
			</label>
			{/if}
		</class>
		<div class="form-control w-full mt-4"><button class="btn btn-md"> Upload</button></div>
	</form>
</Modal>

{#if LogggedInValue}
	<div class="flex justify-end">
		<button for="upload-image-modal" class="btn btn-ghost gap-2" on:click={toggleModalVisibility}
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.5"
				><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"></path></svg
			>
			Upload Image</button
		>
	</div>
{/if}

<div class="grid grid-rows-1 lg:grid-cols-3 gap-4">
    {#each data.images as image}
	<div class="card border-2 bg-base-100 shadow-xl">
		<figure><img src={image.url} alt="pic" /></figure>
		<div class="card-body">
		  <h2 class="card-title">{image.title}</h2>
		  <p>{image.description}</p>
		  <div class="card-actions justify-end">
			<button class="btn btn-primary">Buy Now</button>
		  </div>
		</div>
	  </div>
    {/each}
</div>
