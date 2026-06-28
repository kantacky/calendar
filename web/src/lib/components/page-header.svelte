<script lang="ts">
	import { SidebarTrigger } from "$lib/components/ui/sidebar";
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	type Props = HTMLAttributes<HTMLElement> & {
		title?: string;
		description?: string;
	};

	let {
		class: className,
		title,
		description,
		...restProps
	}: Props = $props();
</script>

<header
	class={cn("flex items-center gap-3 border-b px-6 py-4", className)}
	{...restProps}
>
	<SidebarTrigger />
	{#if title || description}
		<div class="flex flex-col">
			{#if title}
				<h1 class="text-xl font-semibold tracking-tight">{title}</h1>
			{/if}
			{#if description}
				<p class="text-muted-foreground text-sm">{description}</p>
			{/if}
		</div>
	{/if}
</header>
