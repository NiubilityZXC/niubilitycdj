export type DetailLink = {
  label: string;
  href: string;
  description: string;
};

export type DetailSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type DetailEntry = {
  slug: string;
  number: string;
  category: "研究经历" | "项目经历" | "实习经历";
  title: string;
  subtitle: string;
  period: string;
  location: string;
  summary: string;
  tags: string[];
  accent: "teal" | "coral" | "blue" | "yellow";
  sections: DetailSection[];
  links?: DetailLink[];
};

export const details: DetailEntry[] = [
  {
    slug: "vlm-reliability",
    number: "01",
    category: "研究经历",
    title: "视觉语言模型可靠性研究",
    subtitle: "Georgia Tech ML@GT · Essa Lab",
    period: "2025 年 1 月至今",
    location: "美国佐治亚州亚特兰大",
    summary:
      "减少 LLM 在图像描述中的幻觉现象，并提升目标识别与开放场景泛化能力。",
    tags: [
      "Something-Something",
      "CODE Bench",
      "HICO-DET",
      "BLIP2",
      "GLIP",
      "LLaVA-Next",
      "ContextDET",
      "LoRA",
    ],
    accent: "teal",
    sections: [
      {
        title: "研究背景",
        paragraphs: [
          "在 Georgia Tech 跨学科机器学习研究中心 ML@GT 的 Essa Lab 担任研究助理，指导人为 Irfan Essa 与 Nikolai Warner。研究聚焦于减少大语言模型在图像描述中的幻觉现象，并面向 NeurIPS 或 BMVC 推进论文工作。",
        ],
      },
      {
        title: "模型与数据基准",
        bullets: [
          "协助部署 Something-Something、CODE Bench 与 HICO-DET 数据集。",
          "实现 BLIP2、GLIP、GLIP2 与 LLaVA-Next 的图像描述演示。",
          "使用级联 BLIP2 + GLIP、ContextDET 与 LLaVA 作为基准模型进行比较。",
        ],
      },
      {
        title: "微调与可靠性",
        bullets: [
          "基于自行构建的增强 HICO-DET 数据集，使用 LoRA 对 LLaVA 模型进行参数高效微调。",
          "熟悉 LoRA 的工作原理、训练流程和实际使用方法。",
        ],
      },
      {
        title: "研究计划",
        bullets: [
          "生成伪 GT（Pseudo-GT），并评估目标误分类问题。",
          "改进 ContextDET，提升 ITW（In-The-Wild）场景中的泛化能力。",
          "通过混杂与降质数据开展鲁棒性训练。",
          "完成模型微调与最终评估。",
        ],
      },
    ],
    links: [
      {
        label: "ML@GT",
        href: "http://ml.gatech.edu/",
        description: "Georgia Tech 跨学科机器学习研究中心",
      },
      {
        label: "Essa Lab",
        href: "https://www.irfanessa.gatech.edu/",
        description: "Essa Lab 官方网站",
      },
      {
        label: "Irfan Essa",
        href: "https://www.cc.gatech.edu/people/irfan-essa",
        description: "Georgia Tech 教师主页",
      },
    ],
  },
  {
    slug: "visionrl-kuka",
    number: "02",
    category: "项目经历",
    title: "VisionRL-KUKA 视觉伺服平台",
    subtitle: "人工智能对社会影响 · 课程项目",
    period: "2025 年 4 月",
    location: "美国佐治亚州亚特兰大",
    summary:
      "在 PyBullet 中以 PPO 强化学习构建 KUKA 机械臂视觉伺服系统。",
    tags: ["PyBullet", "PPO", "CNN", "Gym", "视觉伺服", "六自由度"],
    accent: "coral",
    sections: [
      {
        title: "项目实现",
        bullets: [
          "在 PyBullet 中使用 PPO 强化学习构建 KUKA 机械臂视觉伺服系统。",
          "设计基于 CNN 感知与六自由度动作空间的自定义 Gym 环境。",
        ],
      },
      {
        title: "奖励设计",
        bullets: [
          "提出结合 MSE、颜色与位置反馈的自适应奖励函数，加速训练收敛。",
          "与固定奖励基线相比，动态奖励塑形呈现出更好的策略学习效果。",
        ],
      },
    ],
  },
  {
    slug: "gt-social",
    number: "03",
    category: "项目经历",
    title: "GT-Social",
    subtitle: "移动应用程序和服务 · 课程项目",
    period: "2024 年 9 月至 12 月",
    location: "美国佐治亚州亚特兰大",
    summary:
      "从 Figma 设计到跨平台软件实现，开发面向校园场景的社交应用。",
    tags: [
      "Flutter",
      "Firebase",
      "Figma",
      "Spring Boot",
      "Kafka",
      "WebSocket",
      "Docker",
      "Kubernetes",
    ],
    accent: "blue",
    sections: [
      {
        title: "产品与移动端",
        bullets: [
          "使用 Flutter 与 Firebase 开发跨平台校园社交应用，并从 Figma 设计推进到软件实现。",
          "负责首页 UI / UX 的设计与实现，以及事件排序功能。",
          "参与商业计划与 BMC（Business Model Canvas）构建，保证应用在不同平台上正常运行。",
        ],
      },
      {
        title: "后端与架构",
        bullets: [
          "使用 Java 11+、Spring Boot 与 JPA 构建 RESTful API。",
          "设计微服务架构，并通过 Docker 与 Kubernetes 部署。",
          "集成 Kafka 进行消息传递，使用 WebSocket 实现实时更新。",
          "利用 MySQL 与 Redis 缓存优化数据库性能。",
          "应用多线程与并发机制，提升事件处理效率。",
        ],
      },
      {
        title: "协作方式",
        paragraphs: [
          "在敏捷开发环境中完成技术实现，并参与商业模型构建。",
        ],
      },
    ],
  },
  {
    slug: "conversational-ai",
    number: "04",
    category: "项目经历",
    title: "会话式人工智能最终项目",
    subtitle: "对话式人工智能 · 课程项目",
    period: "2024 年 10 月至 12 月",
    location: "美国佐治亚州亚特兰大",
    summary:
      "微调 Llama-3，构建模拟治疗师与抑郁症患者对话的生成模型。",
    tags: ["Llama-3", "BERTScore", "BLEU", "模型微调", "模型评估"],
    accent: "yellow",
    sections: [
      {
        title: "项目内容",
        paragraphs: [
          "项目在 Llama-3 上进行微调，并制作一个用于模拟治疗师与抑郁症患者对话的模型，重点生成患者侧的对话内容。",
        ],
      },
      {
        title: "个人职责",
        bullets: [
          "使用 BERTScore、BLEU 等不同评估方法比较候选模型的性能。",
          "协助从全部候选方案中选择表现最佳的模型。",
        ],
      },
    ],
  },
  {
    slug: "bitcoin-price-prediction",
    number: "05",
    category: "项目经历",
    title: "比特币价格预测",
    subtitle: "统计机器学习 · 课程项目",
    period: "2023 年 12 月",
    location: "美国佐治亚州亚特兰大",
    summary:
      "使用时间序列模型预测比特币次日价格，并比较多种循环神经网络结构。",
    tags: ["LSTM", "RNN", "GRU", "时间序列", "区块链"],
    accent: "coral",
    sections: [
      {
        title: "项目内容",
        bullets: [
          "使用 LSTM 预测比特币价格走势。",
          "将 LSTM 与 RNN、GRU 及混合模型进行比较，LSTM 的次日价格预测相对准确。",
        ],
      },
      {
        title: "延伸兴趣",
        paragraphs: [
          "持续关注区块链与加密货币，并自学智能合约和区块链相关知识。",
        ],
      },
    ],
  },
  {
    slug: "aws-cloud-system",
    number: "06",
    category: "项目经历",
    title: "AWS 云计算项目",
    subtitle: "云计算 · 课程项目",
    period: "2023 年 5 月",
    location: "中国广西",
    summary:
      "组合多项 AWS 服务，实现文件使用情况统计与自动化数据入库。",
    tags: ["AWS", "S3", "Cloud9", "Lambda", "DynamoDB", "数据可视化"],
    accent: "blue",
    sections: [
      {
        title: "项目实现",
        bullets: [
          "使用 S3、Cloud9、Lambda 与 DynamoDB 等 AWS 服务创建简单网页。",
          "实现 S3 Bucket 文件夹使用情况的实时统计。",
          "在 Cloud9 中编程，通过触发 Lambda 自动将 S3 Bucket 文件信息写入 DynamoDB。",
          "学习并实践数据清理与可视化。",
        ],
      },
    ],
  },
  {
    slug: "online-education-platform",
    number: "07",
    category: "项目经历",
    title: "在线教育视频平台",
    subtitle: "软件工程毕业设计",
    period: "2023 年 1 月至 6 月",
    location: "中国广西",
    summary:
      "使用 SSM 与 Vue 构建在线教育视频平台，并以微服务架构完成系统设计。",
    tags: [
      "SSM",
      "Vue",
      "Redis",
      "SSO",
      "Nacos",
      "Nuxt",
      "ECharts",
      "微服务",
    ],
    accent: "yellow",
    sections: [
      {
        title: "系统架构",
        bullets: [
          "使用 SSM 与 Vue 开发在线教育视频平台，并基于微服务架构进行系统设计与实现。",
          "构建并集成基于 Redis 的单点登录（SSO）系统进行会话管理，提高身份认证效率。",
          "利用 Nacos 完成微服务的服务发现与配置管理，增强系统的可扩展性和稳定性。",
        ],
      },
      {
        title: "个人职责",
        bullets: [
          "负责首页数据可视化、课程信息展示和后台数据分析面板的开发。",
          "项目使用 Redis、Nacos、Vue、Nuxt、ECharts、Jira 与 Confluence。",
        ],
      },
    ],
  },
  {
    slug: "erp-internship",
    number: "08",
    category: "实习经历",
    title: "ERP 软件实习生",
    subtitle: "上海佳格食品有限公司苏州分公司",
    period: "2022 年 5 月至 7 月",
    location: "中国江苏苏州",
    summary:
      "维护企业网络、服务器与 ERP 系统，支持部署、迁移和终端用户。",
    tags: ["ERP", "服务器维护", "网络管理", "数据迁移", "技术支持"],
    accent: "teal",
    sections: [
      {
        title: "基础设施维护",
        bullets: [
          "管理和维护公司网络与服务器，包括系统更新、性能监控和安全配置。",
          "协助排查网络问题、优化服务器配置，并实施保护公司数据的安全措施。",
          "保障系统达到 99.9% 的正常运行时间。",
        ],
      },
      {
        title: "ERP 支持",
        bullets: [
          "协助系统配置、数据迁移以及与现有基础设施的集成。",
          "与跨职能团队合作分析业务需求并支持 ERP 部署，提高运营效率。",
          "编写技术文档并为终端用户提供支持，提升系统可用性并减少停机时间。",
        ],
      },
    ],
  },
  {
    slug: "software-internship",
    number: "09",
    category: "实习经历",
    title: "软件实习生",
    subtitle: "苏州茵凡科技",
    period: "2022 年 1 月至 2 月",
    location: "中国江苏苏州",
    summary:
      "完成浏览器自动化测试，并开发带身份验证和权限控制的生产订单 API。",
    tags: [
      "Selenium",
      "TestNG",
      "Spring Boot",
      "MyBatis",
      "Spring Security",
      "JWT",
    ],
    accent: "coral",
    sections: [
      {
        title: "自动化测试",
        bullets: [
          "选择 Selenium WebDriver 模拟用户与浏览器的交互。",
          "将 Selenium 与 TestNG 集成，用于管理测试脚本、执行端到端功能测试并分析测试报告。",
        ],
      },
      {
        title: "生产订单 API",
        bullets: [
          "使用 Spring Boot 与 MyBatis 开发生产订单管理 RESTful API。",
          "使用 Spring Security + JWT 实现用户身份验证和基于角色的访问控制。",
          "通过 MyBatis 优化数据库查询并提升 SQL 性能。",
        ],
      },
    ],
  },
];

export const detailBySlug = new Map(details.map((detail) => [detail.slug, detail]));
