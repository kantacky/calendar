<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { holidaysClient } from '$lib/rpc/client';
	import { ConnectError } from '@connectrpc/connect';

	type Holiday = {
		date: string;
		name: string;
	};

	const today = new Date().toISOString().slice(0, 10);
	const yearStart = `${today.slice(0, 4)}-01-01`;
	const yearEnd = `${today.slice(0, 4)}-12-31`;

	let from = $state(yearStart);
	let to = $state(yearEnd);
	let holidays = $state<Holiday[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let fetched = $state(false);

	async function fetchHolidays(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		error = null;
		try {
			const res = await holidaysClient.getHolidaysInRange({ from, to });
			holidays = res.events.map((e) => ({ date: e.date, name: e.name }));
			fetched = true;
		} catch (err) {
			error =
				err instanceof ConnectError
					? err.rawMessage
					: err instanceof Error
						? err.message
						: '祝日の取得に失敗しました';
			holidays = [];
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head><title>祝日</title></svelte:head>

<PageHeader title="祝日" description="期間を指定して日本の祝日を取得します。" />

<main class="mx-auto flex max-w-3xl flex-col gap-6 p-6">
	<form class="flex flex-wrap items-end gap-4" onsubmit={fetchHolidays}>
		<div class="flex flex-col gap-1.5">
			<Label for="from">開始日</Label>
			<Input id="from" type="date" bind:value={from} required />
		</div>
		<div class="flex flex-col gap-1.5">
			<Label for="to">終了日</Label>
			<Input id="to" type="date" bind:value={to} required />
		</div>
		<Button type="submit" disabled={loading}>
			{loading ? '取得中...' : '取得'}
		</Button>
	</form>

	{#if error}
		<p class="text-destructive text-sm">{error}</p>
	{/if}

	{#if fetched && !error}
		<section class="flex flex-col gap-3">
			<h2 class="text-sm font-medium">結果（{holidays.length}件）</h2>
			{#if holidays.length === 0}
				<p class="text-muted-foreground text-sm">該当する祝日はありません。</p>
			{:else}
				<ul class="divide-y border-y">
					{#each holidays as holiday (holiday.date)}
						<li class="flex items-center justify-between gap-4 py-2">
							<span class="text-muted-foreground font-mono text-sm tabular-nums">
								{holiday.date}
							</span>
							<span class="flex-1 text-sm">{holiday.name}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/if}
</main>
