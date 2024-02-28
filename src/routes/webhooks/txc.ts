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

import { createIssueCommentWithTopicId, createIssueWithTopicId } from '../../controllers/github';
import { setupGitHub, setupTuXiaoCao } from '../../utils';
import { Route } from '../handler';

export const txcRoute: Route = async (request, env, ctx) => {
  const [gh, txc, req] = await Promise.all([setupGitHub(env), setupTuXiaoCao(env), request.json<any>()]);

  console.log(JSON.stringify(req));

  switch (req.type) {
    case 'post.created': {
      let topicId = req.payload.post.id;
      ctx.waitUntil(createIssueWithTopicId(gh, txc, topicId));
      break;
    }
    case 'reply.created': {
      let topicId = req.payload.reply.f_title_id;
      ctx.waitUntil(createIssueCommentWithTopicId(gh, txc, topicId, req.payload.reply));
      break;
    }
    default: {
      //
    }
  }

  return Response.json({ message: 'OK' });
};
