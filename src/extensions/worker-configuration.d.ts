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

interface Env {
  TXC_ID: string;
  TXC_SECRET: string;

  GH_REPO_NAME: string;
  GH_APP_ID: string;
  GH_APP_PRIV_KEY: string;
  GH_INSTALLATION_ID: string;

  GH_HOOK_SECRET: string;
}
