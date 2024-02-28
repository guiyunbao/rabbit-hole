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

import { App, Octokit } from 'octokit';

export class GitHub {
  readonly app: App;

  get client(): Octokit {
    return this._client!;
  }
  protected _client?: Octokit;

  get owner(): string {
    return this._owner!;
  }
  protected _owner?: string;
  public readonly repo: string;

  constructor(
    app: {
      id: string;
      privateKey: string;
      webhooks: {
        secret: string;
      };
    },
    repo: string
  ) {
    this.app = new App({
      appId: app.id,
      privateKey: app.privateKey,
      webhooks: {
        secret: app.webhooks.secret,
      },
    });
    this.repo = repo;
  }

  async setupFor(installationId: number | string): Promise<void> {
    if (this._client) return;
    this._client = await this.app.getInstallationOctokit(Number(installationId));
    // @ts-ignore - False Positive about nullable `account` and missing `login`
    this._owner = (await this.app.octokit.rest.apps.getInstallation({ installation_id: Number(installationId) })).data.account.login;
  }

  async searchIssues(keywords: string) {
    let issues = await this.client.rest.search.issuesAndPullRequests({
      q: `owner:${this.owner} is:issue in:body ${keywords}`,
    });

    return issues.data;
  }

  async existIssueComment(keywords: string) {
    let issues = await this.client.rest.search.issuesAndPullRequests({
      q: `owner:${this.owner} is:issue in:comments ${keywords}`,
    });

    return issues.data.items.length > 0 ? issues.data.items[0] : null;
  }

  async createIssue(issue: { title: string; body: string }) {
    let ghIssue = await this.client.rest.issues.create({
      owner: this.owner,
      repo: this.repo,
      title: issue.title,
      body: issue.body,
    });

    return ghIssue.data;
  }

  async createIssueComment(issue: { url: string }, comment: string) {
    let ghComment = await this.client.request(`POST ${issue.url}/comments`, {
      body: comment,
    });

    return ghComment.data;
  }
}
