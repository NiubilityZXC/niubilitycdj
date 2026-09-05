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

export type DetailMediaVideo = {
  title: string;
  source: string;
  poster: string;
  duration: string;
  slide: number;
};

export type DetailMediaItem = {
  id: string;
  title: string;
  kind: "PDF" | "PPTX";
  pageCount: number;
  assetBase: string;
  assetPrefix: "page" | "slide";
  videos?: DetailMediaVideo[];
};

export type DetailMediaGroup = {
  eyebrow: string;
  title: string;
  description: string;
  defaultItemIndex?: number;
  items: DetailMediaItem[];
};

export type DetailEntry = {
  slug: string;
  number: string;
  category: "研究经历" | "项目经历" | "工作经历" | "实习经历";
  title: string;
  subtitle: string;
  period: string;
  location: string;
  summary: string;
  tags: string[];
  accent: "teal" | "coral" | "blue" | "yellow";
  sections: DetailSection[];
  mediaGroups?: DetailMediaGroup[];
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
    mediaGroups: [
      {
        eyebrow: "研究资料",
        title: "论文、汇报与实验视频",
        description:
          "完整浏览 Adaptive Reward Mechanism 论文、34 页课程汇报，以及幻灯片中嵌入的三段实验视频。",
        defaultItemIndex: 1,
        items: [
          {
            id: "visionrl-paper",
            title: "Adaptive Reward Mechanism 论文",
            kind: "PDF",
            pageCount: 7,
            assetBase: "/site/media/visionrl/paper",
            assetPrefix: "page",
          },
          {
            id: "visionrl-presentation",
            title: "VisionRL-KUKA 项目汇报",
            kind: "PPTX",
            pageCount: 34,
            assetBase: "/site/media/visionrl/presentation",
            assetPrefix: "slide",
            videos: [
              {
                title: "完整环境运行演示",
                source: "/site/media/visionrl/video/main-demo.mp4",
                poster: "/site/media/visionrl/video/main-demo-poster.webp",
                duration: "00:35",
                slide: 5,
              },
              {
                title: "固定奖励测试",
                source: "/site/media/visionrl/video/simulation-a.mp4",
                poster: "/site/media/visionrl/video/simulation-a-poster.webp",
                duration: "00:20",
                slide: 32,
              },
              {
                title: "自适应奖励测试",
                source: "/site/media/visionrl/video/simulation-b.mp4",
                poster: "/site/media/visionrl/video/simulation-b-poster.webp",
                duration: "00:20",
                slide: 32,
              },
            ],
          },
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
    mediaGroups: [
      {
        eyebrow: "课程资料",
        title: "该课程其他汇报或者小组作业",
        description:
          "集中浏览课程提案、Knowledge Augmented Conversational AI 论文与汇报，以及对应论文评述。",
        items: [
          {
            id: "cai-proposal",
            title: "课程项目提案",
            kind: "PDF",
            pageCount: 6,
            assetBase: "/site/media/conversational-ai/proposal",
            assetPrefix: "page",
          },
          {
            id: "cai-paper",
            title: "Knowledge Augmented CAI 课程论文",
            kind: "PDF",
            pageCount: 10,
            assetBase: "/site/media/conversational-ai/paper",
            assetPrefix: "page",
          },
          {
            id: "cai-presentation",
            title: "Knowledge Augmented CAI 课程汇报",
            kind: "PPTX",
            pageCount: 23,
            assetBase: "/site/media/conversational-ai/presentation",
            assetPrefix: "slide",
          },
          {
            id: "cai-critique",
            title: "Knowledge Augmented CAI 论文评述",
            kind: "PDF",
            pageCount: 2,
            assetBase: "/site/media/conversational-ai/critique",
            assetPrefix: "page",
          },
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
    mediaGroups: [
      {
        eyebrow: "课程报告",
        title: "比特币价格预测项目报告",
        description:
          "在线浏览完整的统计机器学习项目报告，包括数据处理、模型比较、实验结果与结论。",
        items: [
          {
            id: "bitcoin-report",
            title: "Machine Learning Project Report",
            kind: "PDF",
            pageCount: 35,
            assetBase: "/site/media/bitcoin-price-prediction/report",
            assetPrefix: "page",
          },
        ],
      },
    ],
  },
  {
    slug: "technology-entrepreneur",
    number: "06",
    category: "项目经历",
    title: "PosturePerfect 创业课项目",
    subtitle: "Technology Entrepreneur - ECE-6001-TSZ",
    period: "课程项目",
    location: "Georgia Tech",
    summary:
      "围绕儿童久坐与不良体态问题，设计可穿戴姿态提醒设备、数据分析界面与商业化方案。",
    tags: [
      "Technology Entrepreneur",
      "PosturePerfect",
      "可穿戴设备",
      "触觉反馈",
      "数据分析",
      "BMC",
      "NPV",
    ],
    accent: "teal",
    sections: [
      {
        title: "创业命题",
        bullets: [
          "聚焦儿童屏幕使用时间增长、久坐和不良体态带来的健康问题。",
          "提出面向家庭场景的 PosturePerfect 产品概念，以持续姿态监测降低长期体态风险。",
        ],
      },
      {
        title: "产品方案",
        bullets: [
          "设计轻量可穿戴姿态矫正设备，通过触觉反馈及时提醒用户调整坐姿。",
          "配套数据分析界面，呈现姿态趋势、异常记录与个性化提醒。",
        ],
      },
      {
        title: "商业验证",
        bullets: [
          "通过 Learning Card 与 Test Card 验证用户需求、支付意愿和产品假设。",
          "完成市场规模估算、Business Model Canvas 与净现值分析，形成完整创业汇报。",
        ],
      },
    ],
    mediaGroups: [
      {
        eyebrow: "课程汇报",
        title: "Technology Entrepreneur 项目演示",
        description:
          "在线浏览 12 页创业项目汇报，并直接播放第 8 页中的 PosturePerfect 产品演示视频。",
        items: [
          {
            id: "entrepreneurship-presentation",
            title: "PosturePerfect 最终汇报",
            kind: "PPTX",
            pageCount: 12,
            assetBase: "/site/media/entrepreneurship/presentation",
            assetPrefix: "slide",
            videos: [
              {
                title: "PosturePerfect 产品演示",
                source: "/site/media/entrepreneurship/video/product-demo.mp4",
                poster: "/site/media/entrepreneurship/video/product-demo-poster.webp",
                duration: "01:23",
                slide: 8,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "aws-cloud-system",
    number: "07",
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
    number: "08",
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
    slug: "ai-enablement-specialist",
    number: "09",
    category: "工作经历",
    title: "AI 赋能专员",
    subtitle: "安东聚变（太仓）科技有限公司",
    period: "2025 年 9 月至今",
    location: "中国江苏太仓",
    summary:
      "建设企业级 AI 应用、智能体工具链与算力基础设施，推进内部系统和业务流程智能化。",
    tags: [
      "vLLM",
      "Open WebUI",
      "RAGFlow",
      "Nextcloud",
      "WebDAV",
      "FLASH Skill",
      "SolidWorks Skill",
      "Agent",
    ],
    accent: "yellow",
    sections: [
      {
        title: "企业 AI 平台",
        bullets: [
          "负责公司内部 AI 系统开发、AI 工具培训与推广、内网建设及公司网站建设。",
          "基于 vLLM、Open WebUI 和 RAGFlow 私有化部署企业知识库问答系统。",
          "实现用户身份认证、角色权限管理、知识库访问控制及内部资料检索问答。",
        ],
      },
      {
        title: "文件与知识同步",
        bullets: [
          "基于 WebDAV 开发 Nextcloud 文件管理系统与 RAG 知识库之间的自动同步功能。",
          "实现企业文件的自动更新、解析与入库。",
        ],
      },
      {
        title: "工程 Skill",
        bullets: [
          "开发 FLASH 物理仿真软件 Skill，使 Agent 能够通过自然语言完成仿真参数配置、任务运行及结果处理。",
          "开发 SolidWorks Skill，并结合专利检索与分析 Skill，实现从专利技术描述、结构理解到三维模型及工程图纸生成的自动化流程。",
        ],
      },
      {
        title: "评测与算力基础设施",
        bullets: [
          "搭建 SolidWorks 建模自动评测系统，对尺寸精度、结构完整性、特征正确性及任务完成情况进行自动化评估。",
          "负责 AI 算力服务器需求分析、硬件选型、成本评估、系统部署及大模型推理环境配置。",
        ],
      },
    ],
    links: [
      {
        label: "物理模型平台",
        href: "/details/physical-model-platform",
        description: "自由程预测、脉冲电容评估与 Z-pinch 推理",
      },
      {
        label: "Rosseland 自由程计算",
        href: "/details/rosseland-computing",
        description: "使用 AI 编写异构计算程序，最高加速 199.96 倍",
      },
      {
        label: "AI 研发与交付平台",
        href: "/details/ai-development-platform",
        description: "企业代码仓库、AI 代码审查与 CI/CD",
      },
      {
        label: "微信公众号自动运营",
        href: "/details/wechat-automation",
        description: "素材整理、内容生成、排版与发布流程管理",
      },
    ],
  },
  {
    slug: "erp-internship",
    number: "10",
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
    number: "11",
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

export const additionalDetails: DetailEntry[] = [
  {
    slug: "physical-model-platform",
    number: "09",
    category: "项目经历",
    title: "物理模型平台",
    subtitle: "安东聚变（太仓）科技有限公司 · AI 赋能专员",
    period: "2025 年 9 月至今 · 任职期间",
    location: "中国江苏苏州",
    summary: "集自由程预测、脉冲电容评估和 Z-pinch 推理于一体，并将自由程模型接入 FLASH 程序。",
    tags: ["KDTree", "岭回归", "FLASH", "Z-pinch", "自由程预测", "脉冲电容"],
    accent: "teal",
    sections: [
      {
        title: "自由程预测与 FLASH 集成",
        bullets: [
          "自由程采用 KDTree 近邻加权岭多项式回归。",
          "自由程模型已接入 FLASH 程序，可在自由程表查不到数据时直接调用模型预测。",
        ],
      },
      {
        title: "脉冲电容状态评估",
        paragraphs: ["通过滑动窗口提取波形上包络、中位数、众数及历史周期，进行脉冲电容状态预测。"],
      },
      {
        title: "Z-pinch 推理",
        paragraphs: ["Z-pinch 采用四阶多项式岭回归与物理速度约束，完成速度预测。"],
      },
      {
        title: "模型结果",
        bullets: [
          "自由程预测 SMAPE：3.17%。",
          "脉冲电容测试 NMAE：10.68%。",
          "Z-pinch 速度预测 MAPE：0.00155%。",
        ],
      },
    ],
    links: [
      {
        label: "free-path-service-portable",
        href: "https://github.com/NiubilityZXC/free-path-service-portable",
        description: "简历中的物理模型平台 GitHub 链接",
      },
      {
        label: "AI 赋能专员",
        href: "/details/ai-enablement-specialist",
        description: "安东聚变工作经历",
      },
    ],
  },
  {
    slug: "rosseland-computing",
    number: "10",
    category: "项目经历",
    title: "Rosseland 自由程计算",
    subtitle: "安东聚变（太仓）科技有限公司 · AI 赋能专员",
    period: "2025 年 9 月至今 · 任职期间",
    location: "中国江苏苏州",
    summary: "使用 AI 编写 Rosseland 异构自由程计算程序，结果与原版一致，最高加速 199.96 倍。",
    tags: ["Rosseland", "AI 编程", "异构计算", "自由程", "199.96 倍"],
    accent: "coral",
    sections: [
      {
        title: "计算程序开发",
        paragraphs: ["使用 AI 编写 Rosseland 异构自由程计算程序。"],
      },
      {
        title: "一致性与性能",
        bullets: ["计算结果与原版一致。", "最高加速达到 199.96 倍。"],
      },
    ],
    links: [
      {
        label: "AI 赋能专员",
        href: "/details/ai-enablement-specialist",
        description: "安东聚变工作经历",
      },
    ],
  },
  {
    slug: "ai-development-platform",
    number: "11",
    category: "项目经历",
    title: "AI 研发与交付平台",
    subtitle: "安东聚变（太仓）科技有限公司 · AI 赋能专员",
    period: "2025 年 9 月至今 · 任职期间",
    location: "中国江苏苏州",
    summary: "搭建企业内部代码仓库与 CI/CD 系统，开发由 Agent 驱动的代码审查、优化与提交流程。",
    tags: ["Agent", "CI/CD", "代码审查", "版本管理", "自动构建", "持续交付"],
    accent: "blue",
    sections: [
      {
        title: "企业研发平台",
        bullets: [
          "搭建企业内部代码仓库及 CI/CD 持续集成与持续交付系统。",
          "实现代码版本管理、自动构建、测试、部署及发布流程。",
        ],
      },
      {
        title: "AI 自动代码审查",
        bullets: [
          "使 Agent 能够自动分析代码变更、识别潜在缺陷并提出修改建议。",
          "由 Agent 完成代码优化，并通过测试和审查。",
        ],
      },
      {
        title: "自动提交与交付",
        paragraphs: ["在通过测试和审查后，自动提交至代码仓库并触发 CI/CD 流程。"],
      },
    ],
    links: [
      {
        label: "AI 赋能专员",
        href: "/details/ai-enablement-specialist",
        description: "安东聚变工作经历",
      },
    ],
  },
  {
    slug: "wechat-automation",
    number: "12",
    category: "项目经历",
    title: "微信公众号自动运营",
    subtitle: "安东聚变（太仓）科技有限公司 · AI 赋能专员",
    period: "2025 年 9 月至今 · 任职期间",
    location: "中国江苏苏州",
    summary: "开发微信公众号自动运营 Skill，串联素材整理、内容生成与润色、排版适配及发布流程管理。",
    tags: ["Skill", "微信公众号", "内容生成", "排版适配", "发布流程", "自动化"],
    accent: "yellow",
    sections: [
      {
        title: "内容生产",
        bullets: ["整理文章素材。", "实现内容生成与润色。"],
      },
      {
        title: "排版与发布",
        bullets: ["实现排版适配与发布流程管理。", "自动化处理运营内容。"],
      },
      {
        title: "日常运营",
        paragraphs: ["通过微信公众号自动运营 Skill，提升公众号内容生产与日常维护效率。"],
      },
    ],
    links: [
      {
        label: "wx-gongzhonghao",
        href: "https://github.com/NiubilityZXC/wx-gongzhonghao",
        description: "简历中的微信公众号自动运营 GitHub 链接",
      },
      {
        label: "AI 赋能专员",
        href: "/details/ai-enablement-specialist",
        description: "安东聚变工作经历",
      },
    ],
  },
];

export const allDetails = [...details, ...additionalDetails];
export const detailBySlug = new Map(allDetails.map((detail) => [detail.slug, detail]));

// Keep the original pages' previous/next destinations unchanged as projects grow.
export function getDetailNeighbors(detail: DetailEntry) {
  const group = details.includes(detail) ? details : additionalDetails;
  const index = group.indexOf(detail);
  return {
    previous: group[(index - 1 + group.length) % group.length],
    next: group[(index + 1) % group.length],
  };
}
