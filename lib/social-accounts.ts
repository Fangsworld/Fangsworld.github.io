export type SocialAccount = {
  platform: string;
  name: string;
  bio: string;
  description: string;
  url: string;
  logo: string;
  followerLabel?: string;
  followers: number;
};

// Manually verified public profile snapshots, not live platform statistics.
export const socialAccountsUpdatedAt = '2026-11-20';
export const socialAccounts: SocialAccount[] = [
  {
    description: '从具体案例出发，讨论 AI 如何改变工作、学习与日常生活。',
    platform: '今日头条', name: '宇文平野',
    bio: '最爱咬文嚼字，但求我心他心天下心。',
    url: 'https://www.toutiao.com/c/user/token/Ciew3dn5o9SUdykyBHE_JHBMHZ4oEcxvjz7L64gf2GhiikL3iy6k_vkaSQo8AAAAAAAAAAAAAFEpcSVDiaL5y71n2R2_pqYyuopAok6Ode992K2LjfmJjUUpKKfjuf8k1uDiSbp-cBYjEOqTog4Yw8WD6gQiAQOdsSkJ/',
    logo: '/images/social/platforms/toutiao.png', followers: 35,
  },
  {
    description: '围绕一个具体问题，展开推理、证据与不同视角，把思考讲清楚。',
    platform: '知乎', name: '宇文平野', bio: '气盛则言辞皆宜',
    url: 'https://www.zhihu.com/people/da-dou-dou-54-80',
    logo: '/images/social/platforms/zhihu.svg', followers: 54,
  },
  {
    description: '分享生活与产品实践中的具体经历、方法和使用效果。',
    platform: '小红书', name: '宇文平野', bio: '审美，造型，摄影，记录，风格，生活',
    url: 'https://www.xiaohongshu.com/user/profile/5aeaf5ce11be100663d91961',
    logo: '/images/social/platforms/xiaohongshu.svg', followers: 45,
  },
  {
    description: '从一个日常场景切入，用短视频讲清一个观点或演示一种方法。',
    platform: '抖音', name: '宇文平野', bio: '抖音号：yuwenpingye',
    url: 'https://www.douyin.com/user/MS4wLjABAAAAXC2iHXmI_rso90mWtls-INUSfg-7c2rP-KkxIHssYZw',
    logo: '/images/social/platforms/douyin.png', followers: 77,
  },
  {
    description: '用视频完整呈现思考、实践与产品开发的过程，分享复盘与心得。',
    platform: 'B 站', name: '宇文平野', bio: '天行健，君子以自强不息',
    url: 'https://space.bilibili.com/40758928',
    logo: '/images/social/platforms/bilibili.svg', followers: 2,
  },
  {
    description: '记录即时想法、开发进展与日常观察，在交流中继续思考。',
    platform: '微博', name: '宇文平野', bio: '微博账号：liaofang415',
    url: 'https://weibo.com/u/1896953301',
    logo: '/images/social/platforms/weibo.svg', followers: 183,
  },
];
