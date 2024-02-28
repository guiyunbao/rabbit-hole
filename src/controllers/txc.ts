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
import { createIssueWithTopicId } from './github';

export function makeGitHubIssue(txc: TuXiaoCao, topic: any) {
  let images = '';

  for (const image of topic.images) {
    try {
      images += `![](${image.original_url})\n`;
    } catch (e) {}
  }

  let title: string;
  let content: string;

  switch (topic.type) {
    case 3: {
      let data = JSON.parse(topic.content);
      title = data.title;
      let issue = data.content;
      let solution = data.solution;
      content = `## 问题描述\n${issue}\n## 解决方案\n${solution}`;
      break;
    }

    default: {
      content = topic.content;
      title = makeGitHubIssueTitle(content);
    }
  }

  const template = `原始链接：${txc.makeTopicURL(topic.id)}

${topic.created_at}  
【${topic.nick_name}】(${topic.user_id})

---

${content}
${images}
${makeRHDataField(topic)}
`;

  return {
    title,
    body: template,
  };
}

function makeGitHubIssueTitle(content: string): string {
  return content.slice(0, 20);
}

export function makeGitHubComment(reply: any) {
  let images = '';

  for (const image of reply.images) {
    try {
      images += `![](${image.original_url})\n`;
    } catch (e) {}
  }

  const template = `回复ID：${reply.id}

${reply.created_at}  
【${reply.nick_name}】(${reply.user_id})

---

${reply.content}
${images}
${makeRHDataField(reply)}
`;
  return template;
}

function makeRHDataField(data: any) {
  return `---

<details><summary>此部分为自动生成，请勿编辑</summary>
<RH>
${JSON.stringify(data)}
</RH>
</details>
`;
}

// export async function pollingTXC(txc: TuXiaoCao, gh: GitHub) {
//   const topics = await txc.getTopics({ count: 5 });
//   for (const topic of topics) {
//     console.log(`--- Start Processing txc/${topic.id} ---`);

//     let issue = await createIssueWithTopicId(gh, txc, topic.id);
//     console.log(`Issue: ${issue.html_url}`);
//     if (!Array.isArray(topic.replies_all)) {
//       for (const replyId in topic.replies_all) {
//         const reply = topic.replies_all[replyId].self;
//         console.log(`Reply: ${reply.id}`);
//         let exist = await gh.existIssueComment(reply.id);
//         if (exist) {
//           console.log(`Exist: ${exist.html_url}`);
//           continue;
//         }

//         let comment = makeGitHubComment(reply);
//         let ghComment = await gh.client.request({
//           method: 'POST',
//           url: issue.url + '/comments',
//           data: { body: comment },
//         });
//         console.log(`Comment: ${ghComment.data.html_url}`);
//       }
//     }

//     console.log(`--- End Processing txc/${topic.id} ---`);
//   }
// }
