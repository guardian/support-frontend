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
    const url = `${this.config.url.replace(/\/$/, "")}/subscriptions/${id}`;
    console.info("Zuora API request", { method: "GET", url });

    const response = await fetch(url, {
      method: "GET",
      headers: this.authHeaders(),
    });

    console.info("Zuora API response", {
      method: "GET",
      url,
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Zuora subscription ${id}: ${response.status}`
      );
    }

    const body = (await response.json()) as MinimalZuoraSubscription;
    console.info("Zuora getSubscription response body", {
      subscriptionId: id,
      ratePlanCount: body.ratePlans.length,
    });
    return body;
  }
}
