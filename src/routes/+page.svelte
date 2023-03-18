<script lang="ts">
	import SearchableColumn from '$lib/SearchableColumn.svelte';
	import Theme from '$lib/Theme.svelte';
	import Column from '$lib/Column.svelte';
	import { P, Button } from 'flowbite-svelte';
	import { open } from '@tauri-apps/api/dialog';
	import {
		readDir,
		writeFile,
		createDir,
		readTextFile,
		BaseDirectory,
		exists
	} from '@tauri-apps/api/fs';
	import { onMount } from 'svelte';

	let collections: Collection[] = [];
	let selectedCollection: Collection | null = collections?.[0];
	let selectedDocument: Doc | null = null;

	onMount(() => {
		loadCollection();
	});

	const loadCollection = async () => {
		const collection = await readTextFile('data/collection.json', {
			dir: BaseDirectory.AppConfig
		});
		collections = JSON.parse(collection);
	};

	const createDataFolder = async () => {
		const folderExists = await exists('data', { dir: BaseDirectory.AppConfig });
		if (!folderExists) {
			await createDir('data', {
				dir: BaseDirectory.AppConfig,
				recursive: true
			});
		}
	};

	// const cleanName = (obj) => {
	// 	if (obj.children) {
	// 		obj.children.forEach((element) => {});
	// 	}
	// };

	const saveCollection = async () => {
		const folder = await open({ directory: true, multiple: false });

		if (!folder) {
			return;
		}

		const ignore = ['images', 'videos', 'gamelist.xml'];

		const files = await readDir(folder as string, { recursive: true });
		collections = files;

		await createDataFolder();
		await writeFile(
			{
				contents: JSON.stringify(collections),
				path: `data/collection.json`
			},
			{ dir: BaseDirectory.AppConfig }
		);
	};
</script>

<Theme />

<div class="flex-row gap-1 fullwidth dark:bg-gray-800">
	<Button on:click={saveCollection}>Load collection</Button>

	<div class="flex gap-5 pt-4">
		<SearchableColumn
			searchPlaceholder="Search collection"
			items={collections}
			selected={selectedCollection}
			on:itemclick={(e) => {
				selectedCollection = e.detail;
				selectedDocument = null;
			}}
		/>
		<SearchableColumn
			searchPlaceholder="Search document"
			items={selectedCollection?.children || []}
			selected={selectedDocument}
			on:itemclick={(e) => (selectedDocument = e.detail)}
		/>

		<Column>
			{#if selectedDocument}
				<P>
					{selectedDocument.name}
				</P>
			{/if}
		</Column>
	</div>
</div>

<style>
	.fullwidth {
		width: 100vw;
		height: 100vh;
		padding: 16px;
	}
</style>
