# 兔子洞 🐰🕳️ (rabbit-hole)

将 [腾讯兔小巢](https://txc.qq.com/) 与 [GitHub](https://github.com/) 打通，实现高效的客户-开发 IssueOps 循环。

## 特性列表

- [x] 兔小巢有新帖子时，实时创建为 GitHub Issue。
  - 对于多系统项目，建议使用独立存储库暂存
- [ ] 复制需求内容到有权限的其他仓库 (`!rabbit jump <REPO-NAME>`)。
- [ ] 兔小巢帖子更新时，实时同步到对应 Issue。
- [x] Issue 内快捷跳转到兔小巢原帖。
- [ ] 周期性汇总当前需求进展情况。

## 部署

参考[部署文档](./docs/deploy.md)。

## 注意

### 保留区段

为了确保帖子关联及后续需要，各类自动生成文本中可能包含下述区段，请勿手动编辑或删除：

```markdown
<RH>
保留区段
</RH>
```

### 已知问题

- [ ] 对于兔小巢的新回复，仅进行简单检索确定回复是否已存在，未进行精确验证。

## 杂谈

本项目受 GitHub 开发文章 [How to communicate like a GitHub engineer: our principles, practices, and tools](https://github.blog/2023-10-04-how-to-communicate-like-a-github-engineer-our-principles-practices-and-tools/) 启发。
