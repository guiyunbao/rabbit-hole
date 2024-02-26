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

import md5 from 'md5';

const Endpoint = 'https://txc.qq.com/api';

export class TuXiaoCao {
  id: string;
  protected secret: string;

  constructor(id: string | number, secret: string) {
    this.id = String(id);
    this.secret = secret;
  }

  protected makeSignature(timestamp: number | string): string {
    let payload = `${timestamp}${this.secret}`;
    let signature = md5(payload);
    return signature;
  }

  protected makeHeaders(): Headers {
    let now = (new Date().getTime() / 1000).toFixed(0);

    let headers = new Headers();
    headers.set('Timestamp', now);
    headers.set('Signature', this.makeSignature(now));
    return headers;
  }

  async available(): Promise<number | null> {
    try {
      const topicsData = await this.getTopicsData({ count: 114514 });
      return topicsData.pagination.total;
    } catch (e) {
      return null;
    }
  }

  async getTopics(param?: { max_id?: string; from?: string; to?: string; count?: number }) {
    let data = await this.getTopicsData(param);
    return data.data;
  }

  protected async getTopicsData(param?: { max_id?: string; from?: string; to?: string; count?: number }) {
    const path = new URL(`${Endpoint}/v1/${this.id}/posts`);
    const headers = this.makeHeaders();

    if (param) {
      if (param.max_id) path.searchParams.set('max_id', param.max_id);
      if (param.from) path.searchParams.set('from', param.from);
      if (param.to) path.searchParams.set('to', param.to);
      if (param.count) path.searchParams.set('count', param.count.toString());
    }

    let res = await fetch(path.toString(), { headers });
    let data = (await res.json()) as any;
    return data;
  }

  makeTopicURL(topicId: string): string {
    return `https://txc.qq.com/products/${this.id}/post/${topicId}`;
  }

  async getTopic(topicId: string) {
    let topic = await this.getTopicOnly(topicId);
    let replies = await this.getTopicReplies(topicId);
    return {
      topic,
      replies,
    };
  }

  async getTopicOnly(topicId: string) {
    // @undocumented
    const path = `${Endpoint}/v2/${this.id}/posts/${topicId}`;
    const headers = this.makeHeaders();

    let res = await fetch(path, { headers });
    let topic = (await res.json()) as any;
    if (Array.isArray(topic.data)) return null;
    return topic.data;
  }

  async getTopicReplies(topicId: string, page?: number) {
    // @undocumented
    const path = `${Endpoint}/v2/${this.id}/posts/${topicId}/replies`;
    const headers = this.makeHeaders();

    let res = await fetch(path, { headers });
    let replies = (await res.json()) as any;
    return replies.data;
  }
}
