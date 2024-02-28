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

import { GitHub } from '../libs/GitHub';
import { TuXiaoCao } from '../libs/TuXiaoCao';
import { makeGitHubComment, makeGitHubIssue } from './txc';

export async function findIssueWithTopicId(gh: GitHub, txc: TuXiaoCao, topicId: string) {
  let link = txc.makeTopicURL(topicId);
  let issues = await gh.searchIssues(link);

  if (issues.total_count > 0) {
    let issueIndex = issues.items.findIndex(function (issue) {
      // Ensure the txcId exist in the RH field of the issue body
      let rhFieldPattern = new RegExp('<RH>\r?\n?([\\s\\S]*)\r?\n?</RH>');
      let match = issue.body?.match(rhFieldPattern);
      if (match) {
        let rhField = match[1];
        return rhField.includes(topicId);
      }
      return false;
    });
    if (issueIndex !== -1) {
      return issues.items[issueIndex];
    }
  }
  return null;
}

export async function createIssueWithTopicId(gh: GitHub, txc: TuXiaoCao, topicId: string) {
  let exist = await findIssueWithTopicId(gh, txc, topicId);
  if (exist !== null) {
    return Promise.reject(`Issue already exists for txc topic id: ${topicId} -> ${exist.html_url}`);
  }

  let topic = await txc.getTopicOnly(topicId);
  if (topic === null) {
    return Promise.reject(`Invalid txc topic id: ${topicId}`);
  }
  let issue = makeGitHubIssue(txc, topic);

  return await gh.createIssue(issue);
}

export async function createIssueCommentWithTopicId(gh: GitHub, txc: TuXiaoCao, topicId: string, reply: any) {
  let issue = await findIssueWithTopicId(gh, txc, topicId);
  if (issue === null) {
    return Promise.reject(`Issue not found for txc topic id: ${topicId}`);
  }

  let comment = makeGitHubComment(reply);
  return await gh.createIssueComment(issue, comment);
}
