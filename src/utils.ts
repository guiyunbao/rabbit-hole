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

import { TuXiaoCao } from './libs/TuXiaoCao';
import { GitHub } from './libs/GitHub';

export async function setupGitHub(env: Env) {
  const github = new GitHub(
    {
      id: env.GH_APP_ID,
      privateKey: atob(env.GH_APP_PRIV_KEY),
      webhooks: {
        secret: env.GH_HOOK_SECRET,
      },
    },
    env.GH_REPO_NAME
  );

  await github.setupFor(env.GH_INSTALLATION_ID);

  return github;
}

export async function setupTuXiaoCao(env: Env) {
  return new TuXiaoCao(env.TXC_ID, env.TXC_SECRET);
}
