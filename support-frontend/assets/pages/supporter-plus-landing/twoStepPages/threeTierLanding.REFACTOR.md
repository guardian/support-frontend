# `ThreeTierLanding` refactor proposal

File: [threeTierLanding.tsx](./threeTierLanding.tsx) (~570 lines, single component)

## Summary

`ThreeTierLanding` is doing too many jobs at once: URL parsing, feature-switch
resolution, per-tier pricing/promotion calculation, per-tier checkout URL
building, per-tier "is this card selected" logic, and rendering the whole page
shell (header, footer, T&Cs, tickers, student offer). Almost all of the
~300 lines before the `return` are tier-specific derivations repeated three
times with copy-pasted shapes. This makes the component hard to read, hard to
test in isolation, and risky to change (a fix for Tier 2 pricing can easily be
forgotten for Tier 3).

The rest of this doc lists concrete issues, then proposes a target structure.

## Issues & anti-patterns

### 1. Component doing view + business logic + data-fetching-adjacent work

Lines ~330-535 compute pricing, promotions, checkout URLs, and card content
for three tiers, entirely inside the component body. None of this is
presentational — it's product/pricing domain logic that has nothing to do
with JSX. This violates separation of concerns and makes the component
impossible to unit test without rendering it.

### 2. Copy-pasted "tier" logic (DRY violation)

`tier1Card`, `tier2Card`, `tier3Card` each repeat the same steps:
pricing lookup → promotion lookup → checkout URL → `isDefaultProductSelected`
→ `isUserSelected` → benefits/cta fallback merging → `CardContent` assembly.
The three blocks differ only in which product key and rate plan they use, but
they're hand-written independently, so:

- Tier 1 has no promotion at all (inconsistent with Tier 2/3, possibly a bug
  rather than intentional).
- Any change to the "how do we build a `CardContent`" contract must be made
  in three places.

### 3. Derived/computed values stored in `useState` unnecessarily

```tsx
const [contributionType, setContributionType] = useState<ContributionType>(
	getInitialContributionType(),
);
```

This one is legitimate (user-driven state). But `useRatePlanKey` also keeps
`ratePlanKey` in `useState` and syncs it via `useEffect` purely as a function
of `contributionType` and feature switches — this is a classic "state that
mirrors a prop" anti-pattern. It can be computed directly during render with
`useMemo`, removing a render-lag bug risk (one extra render before the new
value is reflected) and an effect entirely.

### 4. Reading `window.location.search` directly in the component body

```tsx
const urlSearchParams = new URLSearchParams(window.location.search);
```

and again inside `isCardUserSelected`. This makes the component impossible to
snapshot/unit-test deterministically without mocking global `window`, and
couples rendering logic to browser globals. Should be extracted into a
hook (`useUrlSearchParams` / `useSelectedAmountFromUrl`) or computed once and
passed down, ideally memoized.

### 5. Business rules embedded as inline comments/hacks

```tsx
/**
 * We do this as sending the old amount (£10) down the pipes will cause
 * `support-workers` to fail ...
 * This should only exist as long as the Tier three hack is in place.
 */
```

A load-bearing workaround for a cross-repo constraint is buried in a 500-line
component. This should live next to the domain logic it patches (e.g. in a
`tier3.ts` helper) with a tracked follow-up ticket reference, not as a
comment in the render function.

### 6. `getPlanCost` marked `@deprecated` but still central to rendering

```tsx
/**
 * @deprecated - we should be useing ProductCatalog data types.
 */
function getPlanCost(...)
```

A deprecated function is a load-bearing part of the T&Cs rendering path.
Either it should be migrated now as part of this refactor, or the
"TODO/tracking" should be a linked ticket rather than a comment that can be
ignored indefinitely.

### 7. Magic literals & inline style objects mixed with logic

- `['uk', 'us', 'ca'].includes(supportRegionId)` — a business rule ("which
  regions get the student offer") expressed as an inline array literal with
  no name, no test coverage, and no single source of truth.
- Hard-coded color `rgba(170, 170, 180, 0.5)` repeated 4 times as
  `borderColor` prop.
- All the `css` blocks (`recurringContainer`, `lightContainer`,
  `disclaimerContainer`, etc.) are defined at module scope, which is good,
  but they're in the same file as the logic, inflating the file further.

### 8. Props type doesn't match usage

```tsx
type ThreeTierLandingProps = {
	supportRegionId: SupportRegionId;
	settings: LandingPageVariant;
	abParticipations: Participations;
};
export function ThreeTierLanding({
	supportRegionId,
	settings,
}: ThreeTierLandingProps): JSX.Element {
```

`abParticipations` is declared as a required prop but never destructured or
used anywhere in the component. Dead prop — either it should be removed, or
something is silently broken (a consumer might expect it to affect
rendering).

### 9. Long parameter lists / boolean-only helpers

`getUserSelection(productKey, productPrice, promotionAmount)` and
`isCardUserSelected(cardPrice, cardPriceDiscount)` are fine individually, but
because they close over `urlSearchParamsProduct`/`window.location`, they
can't be reused or tested outside this component. They're really pure
functions with hidden inputs.

### 10. No memoization of expensive derived structures

`tier1Card`, `tier2Card`, `tier3Card`, and the `tsAndCsContent` array passed
to `ThreeTierTsAndCs` are recomputed on every render (e.g. every keystroke
that could trigger a parent re-render), including object/array literals
passed as props, which will break `React.memo` on children like
`ThreeTierCards` if it's ever added.

### 11. Large render method mixing layout structure with content assembly

The `return` block (lines ~535-660) builds the footer JSX inline, including
a whole "Support another way" `US`-only block and the T&Cs content array
constructed inline. This should be extracted into smaller named
sub-components (`ThreeTierFooter`, `SupportAnotherWay`) so the top-level
render stays readable at a glance.

## Proposed target structure

```
twoStepPages/
  threeTierLanding.tsx                 # thin: orchestration + layout only
  threeTierLanding/
    useThreeTierUrlSelection.ts        # url parsing (product, ratePlan, selected-amount)
    useTierCardContent.ts              # builds CardContent for a given tier
    getPlanCost.ts                     # migrated off @deprecated, or removed
    threeTierFooter.tsx                # extracted footer JSX (US block + T&Cs + links)
    constants.ts                       # STUDENT_OFFER_REGIONS, BORDER_COLOR, etc.
```

### a. Extract URL-derived state into a hook

```tsx
function useThreeTierUrlSelection() {
	const params = useMemo(() => new URLSearchParams(window.location.search), []);
	return useMemo(
		() => ({
			product: params.get('product')?.toLowerCase(),
			ratePlan: params.get('ratePlan')?.trim().toLowerCase(),
			selectedAmount: Number(params.get('selected-amount')),
			forceWeeklyPricing: params.get('force-weekly') === 'true',
		}),
		[params],
	);
}
```

This removes all direct `window.location` reads from the component body and
makes the values easy to stub in tests (mock the hook, not `window`).

### b. Replace `useState` + `useEffect` mirroring in `useRatePlanKey`

```tsx
export function useRatePlanKey(contributionType, supportRegionId) {
	const { enableCanadaTaxExclusion } = useFeatureSwitches();
	const taxExclusionEnabled =
		supportRegionId === SupportRegionId.CA && enableCanadaTaxExclusion;

	return useMemo(() => {
		const base = getRatePlanKey(contributionType);
		if (!taxExclusionEnabled) return { ratePlanKey: base, taxExclusionEnabled };
		return {
			ratePlanKey:
				base === 'Monthly' ? 'MonthlyTaxExclusive' : 'AnnualTaxExclusive',
			taxExclusionEnabled,
		};
	}, [contributionType, taxExclusionEnabled]);
}
```

Removes the extra render/effect cycle and the risk of `ratePlanKey` being
stale for one render after `contributionType` changes.

### c. Unify the three tier-card builders into one data-driven function

```tsx
type TierConfig = {
	product: ProductKey;
	ratePlanKey: ProductRatePlanKey<ProductKey>;
	getPromotion?: (ratePlan) => Promotion | undefined;
};

function useTierCardContent(
	config: TierConfig,
	ctx: { supportRegionId; settings; urlSelection; currencyId; countryGroupId },
): CardContent {
	// single implementation of: pricing lookup, promotion lookup,
	// checkout URL build, isDefaultProductSelected, isUserSelected,
	// benefits/cta fallback merge.
}
```

Then in the component:

```tsx
const tier1Card = useTierCardContent(tier1Config, ctx);
const tier2Card = useTierCardContent(tier2Config, ctx);
const tier3Card = useTierCardContent(tier3Config, ctx);
```

This collapses ~200 lines of triplicated logic into one tested function plus
three short call sites, and makes it structurally impossible for one tier to
silently diverge from the others (e.g. Tier 1 missing a promotion lookup) —
any intentional difference becomes an explicit config field instead of a
copy-paste omission.

### d. Move `getPlanCost` off the deprecated path (or isolate + ticket it)

If the full ProductCatalog migration isn't in scope for this refactor, at
minimum move `getPlanCost` into its own module with the existing comment,
plus a link to a tracked ticket, so it's not mixed in with rendering code
and its lifecycle is visible outside this file.

### e. Extract the footer into `ThreeTierFooter`

```tsx
<PageScaffold
	header={...}
	footer={
		<ThreeTierFooter
			countryGroupId={countryGroupId}
			taxExclusionEnabled={taxExclusionEnabled}
			tsAndCsContent={tsAndCsContent}
			currency={glyph(currencyId)}
		/>
	}
>
```

`tsAndCsContent` itself should be built via `useMemo` (it depends on
`tier1Card/tier2Card/tier3Card/contributionType`, all of which are already
memoized once (c) is done).

### f. Name the magic literals

```tsx
const STUDENT_OFFER_REGIONS: SupportRegionId[] = [
	SupportRegionId.UK,
	SupportRegionId.US,
	SupportRegionId.CA,
];
const enableStudentOffer = STUDENT_OFFER_REGIONS.includes(supportRegionId);

const DIVIDER_BORDER_COLOR = 'rgba(170, 170, 180, 0.5)';
```

### g. Drop or wire up `abParticipations`

Either remove it from `ThreeTierLandingProps` (and from call sites) if it's
truly unused, or pass it through to whatever downstream logic was supposed to
consume it. Currently it's a silent no-op prop, which is worse than not
having it typed at all.

## Suggested incremental migration order

1. Remove/fix the unused `abParticipations` prop (cheap, low risk, clarifies
   intent).
2. Extract `useThreeTierUrlSelection` and replace direct `window.location`
   reads — unlocks isolated unit tests for selection logic.
3. Simplify `useRatePlanKey` to drop `useState`/`useEffect`.
4. Introduce `useTierCardContent` and migrate tier 2 and tier 3 onto it
   first (they already share the promotion/checkout-url shape); fold tier 1
   in once the "no promotion" case is confirmed intentional.
5. Extract `ThreeTierFooter` and move `getPlanCost` to its own module.
6. Name remaining magic literals (regions list, border colors).

Each step is independently shippable and testable, so this doesn't need to
be a single large PR.
