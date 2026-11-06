import { optionalDropNulls } from '@modules/schemaUtils';
import { z } from 'zod';

const metadataSchema = z.object({
	capturedAt: z.string(),
	consentManagerVersion: z.string(),
	gpcSignal: optionalDropNulls(z.boolean()),
});

const tcfv2ConsentSnapshotSchema = z.object({
	gdprApplies: z.boolean().nullable(),
	consents: z.record(z.string(), z.boolean()),
	vendorConsents: z.record(z.string(), z.boolean()),
	eventStatus: z.string(),
	addtlConsent: z.string(),
	tcString: z.string(),
});

const usnatConsentSnapshotSchema = z.object({
	doNotSell: z.boolean(),
	signalStatus: z.string(),
});

const ausConsentSnapshotSchema = z.object({
	personalisedAdvertising: z.boolean(),
	signalStatus: z.string(),
});

export const cmpConsentSnapshotSchema = z.discriminatedUnion('framework', [
	metadataSchema.extend({
		framework: z.literal('tcfv2'),
		tcfv2: tcfv2ConsentSnapshotSchema,
	}),
	metadataSchema.extend({
		framework: z.literal('usnat'),
		usnat: usnatConsentSnapshotSchema,
	}),
	metadataSchema.extend({
		framework: z.literal('aus'),
		aus: ausConsentSnapshotSchema,
	}),
]);

export type CmpConsentSnapshot = z.infer<typeof cmpConsentSnapshotSchema>;
