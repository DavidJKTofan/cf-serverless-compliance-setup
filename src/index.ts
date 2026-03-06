/**
 * Compliance-aware Serverless Setup — Interactive Learning Guide
 *
 * This Worker serves the static walkthrough via the ASSETS binding
 * and exposes a lightweight /api route for progress tracking.
 *
 * Static assets are served automatically by the assets configuration
 * in wrangler.jsonc. The Worker only handles /api/* routes.
 */

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Handle API routes
		if (url.pathname.startsWith('/api/')) {
			return handleApiRoute(url, request);
		}

		// For all other requests, serve static assets
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;

async function handleApiRoute(url: URL, request: Request): Promise<Response> {
	const headers = {
		'Content-Type': 'application/json',
		'Cache-Control': 'no-cache',
	};

	switch (url.pathname) {
		case '/api/health':
			return Response.json(
				{
					status: 'ok',
					guide: 'Compliance-aware Serverless Setup',
					version: '1.0.0',
				},
				{ headers }
			);

		case '/api/steps':
			return Response.json(
				{
					totalSteps: 8,
					steps: [
						{ id: 0, title: 'Overview', slug: 'overview' },
						{ id: 1, title: 'Cloudflare Developer Platform', slug: 'platform' },
						{ id: 2, title: 'Business Continuity', slug: 'resiliency' },
						{ id: 3, title: 'Data Security', slug: 'data-security' },
						{ id: 4, title: 'Jurisdictional Restrictions', slug: 'jurisdictions' },
						{ id: 5, title: 'Data Localization Suite', slug: 'dls' },
						{ id: 6, title: 'Summary', slug: 'summary' },
						{ id: 7, title: 'Knowledge Check', slug: 'quiz', optional: true },
					],
				},
				{ headers }
			);

		default:
			return Response.json({ error: 'Not found' }, { status: 404, headers });
	}
}
