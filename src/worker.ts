/**
 * Rabbit-hole boost IssueOps by connecting 兔小巢 and GitHub.
 * Copyright (C) 2024  GuiYunBao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { githubRoute as githubWebhook } from './routes/webhooks/github';
import { statusRoute } from './routes/status';
import { setupTuXiaoCao, setupGitHub } from './utils';
import { txcRoute as txcWebhook } from './routes/webhooks/txc';

export default {
  async fetch(request: any, env: Env, ctx: ExecutionContext): Promise<Response> {
    const res = await handle(request, env, ctx);
    return res;
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    //
  },
};

async function handle(request: any, env: Env, ctx: ExecutionContext): Promise<Response> {
  try {
    const reqPath = new URL(request.url).pathname;

    // static route
    switch (reqPath) {
      case '/webhooks/github':
        return githubWebhook(request, env, ctx);
      case '/webhooks/txc':
        return txcWebhook(request, env, ctx);
      case '/status':
        return statusRoute(request, env, ctx);
      default:
        return new Response('', { status: 404 });
    }
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
