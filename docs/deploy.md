# 部署

## 准备工作

- [Wrangler CLI](https://github.com/cloudflare/workers-sdk)
- [Cloudflare 账户](https://cloudflare.com) （非必需）
  - 已开通 Workers
- 申请新的 [GitHub App](https://docs.github.com/zh/apps)
  - 配置所需权限
    - 至少需要 `Repository - Issues` 的 **读写** 权限
  - 准备配置 Webhook
    - 至少订阅 `Issue`, `Issue comment` 事件
  - 已生成并下载 Private Key
  - 已为组织安装 App
    - 获得 Installation ID
- 兔小巢账户
  - 已取得 App ID
  - 已取得 Private Key

### 注意事项

配置 GitHub App 时，生成后下载的 Private Key 默认为 `PKCS #1` 格式。
可使用下列命令转换为本项目所需的 `PKCS #8` 格式：

```sh
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private.key | base64
```

Installation ID 可通过以下步骤确认：
1. 打开组织的设置页
2. `Third-party Access` -> `GitHub Apps`
3. 找到之前安装的 App，点击 `Configure`。
4. 此时网页链接形如 `https://github.com/organizations/guiyunbao/settings/installations/114514`，其中 `114514` 即为 Installation ID。

>[!TIP]
>此时也可以将 App 权限收窄到特定仓库，减少攻击暴露面。

## 部署环境

先编辑 [wrangler.toml](../wrangler.toml) 文件，将 `[vars]` 下的变量填写为实际部署所需值。

更新/回退时，如无特殊声明，重复下列步骤即可。

### 本地

将 [.dev.vars.example](../.dev.vars.example) 复制为 `.dev.vars`，并填写实际值。

运行 `npm run start`，即可在本地启动 Worker。

### Cloudflare

如有需要，应编辑 [wrangler.toml](../wrangler.toml) 文件，将 `name` 修改为 worker 名称。

运行 `npm run deploy`，即可将 Worker 部署到 Cloudflare。

检查 [.dev.vars.example](../.dev.vars.example) 中的变量，[配置相应 Secret](https://developers.cloudflare.com/workers/configuration/secrets/) 并重新部署。

## 配置 Webhook

假设部署位置为 `https://example.com` 。

GitHub Webhook 应配置为 `https://example.com/webhooks/github`。
兔小巢 Webhook 应配置为 `https://example.com/webhooks/txc`。

## 验证

访问部署位置的 `GET /status` 即可验证部署是否成功。例如 `https://example.com/status`。

兔子洞将报告当前的使用情况，返回结果可能会更改。
