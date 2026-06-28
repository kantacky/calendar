<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLLabelAttributes, HTMLLabelElement> = $props();
</script>

<label
	bind:this={ref}
	data-slot="label"
	class={cn(
		'text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</label>
