<script>
	import { isLoggedIn } from '../utils/auth.js';
	import { goto } from '$app/navigation';
	import Modal from '../lib/Modal.svelte';
	import { uploadMedia } from '../utils/s3-uploader.js';

	let showModal = false;
	let LogggedInValue;

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

	async function uploadImage(evt) {
		const [fileName, fileUrl] = await uploadMedia(evt.target['file'].files[0]);
		alert('name: ' + fileName + ', ' + 'url: ' + fileUrl);
		// code to make POST request to your backend
	}
</script>

<svelte:head>
	<script src="/aws-sdk-s3.min.js"></script>
</svelte:head>
<Modal bind:showModal>
	<form class="w-full">
		<div class="flex flex-col lg:flex-row">
			<div class="form-control w-full lg:w-1/2 mt-2">
				<input class="file-input w-full max-w-xs" type="file" name="file" />
			</div>
			<div class="w-full lg:w-1/2"></div>
		</div>
		<div class="form-control w-full">
			<label class="label" for="price"><span class="label-text">Price</span></label>
			<input type="text" name="price" placeholder="1.96" class="input input-bordered w-full" />
		</div>
		<div class="form-control w-full">
			<label class="label" for="title"><span class="label-text">Title</span></label>
			<input type="text" name="title" placeholder="Sunset" class="input input-bordered w-full" />
		</div>
		<div class="form-control w-full">
			<label class="label" for="description"><span class="label-text">Description</span></label>
			<textarea
				name="description"
				class="textarea textarea-bordered"
				placeholder="Beautiful Sunset in San Marino"
			></textarea>
		</div>
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
