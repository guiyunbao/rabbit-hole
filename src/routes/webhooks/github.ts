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

import { Route } from '../handler';
import { setupGitHub } from '../../utils';

export const githubRoute: Route = async (request, env, ctx) => {
  const github = await setupGitHub(env);

  try {
    await github.app.webhooks.verifyAndReceive({
      id: request.headers.get('x-github-delivery')!,
      name: request.headers.get('x-github-event') as any,
      signature: request.headers.get('x-hub-signature')!,
      payload: await request.text(),
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }

  return Response.json({ message: 'OK' });
};
