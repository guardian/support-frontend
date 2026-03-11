import type { ZuoraQuerierConfig } from "./configService";

interface RatePlanCharge {
  price?: string;
  currency: string;
}

interface RatePlan {
  id: string;
  ratePlanCharges: RatePlanCharge[];
}

export interface MinimalZuoraSubscription {
  ratePlans: RatePlan[];
}

export class ZuoraSubscriptionService {
  constructor(private readonly config: ZuoraQuerierConfig) {}

  private authHeaders(): HeadersInit {
    return {
      apiSecretAccessKey: this.config.password,
      apiAccessKeyId: this.config.username,
    };
  }

  async getSubscription(id: string): Promise<MinimalZuoraSubscription> {
    const response = await fetch(
      `${this.config.url.replace(/\/$/, "")}/subscriptions/${id}`,
      {
        method: "GET",
        headers: this.authHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Zuora subscription ${id}: ${response.status}`
      );
    }

    return (await response.json()) as MinimalZuoraSubscription;
  }
}
