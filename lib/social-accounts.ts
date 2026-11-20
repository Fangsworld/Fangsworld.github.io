export type SocialAccount = {
  platform: string;
  name: string;
  bio: string;
  url: string;
  logo: string;
  followerLabel?: string;
  followers: number;
};

// Manually verified public profile snapshots, not live platform statistics.
export const socialAccountsUpdatedAt = '2026-11-20';
export const socialAccounts: SocialAccount[] = [
  {
    platform: '今日头条', name: '宇文平野',
    bio: '最爱咬文嚼字，但求我心他心天下心。',
    url: 'https://www.toutiao.com/c/user/token/Ciew3dn5o9SUdykyBHE_JHBMHZ4oEcxvjz7L64gf2GhiikL3iy6k_vkaSQo8AAAAAAAAAAAAAFEpcSVDiaL5y71n2R2_pqYyuopAok6Ode992K2LjfmJjUUpKKfjuf8k1uDiSbp-cBYjEOqTog4Yw8WD6gQiAQOdsSkJ/',
    logo: '/images/social/platforms/toutiao.png', followers: 35,
  },
  {
    platform: '知乎', name: '宇文平野', bio: '气盛则言辞皆宜',
    url: 'https://www.zhihu.com/people/da-dou-dou-54-80',
    logo: '/images/social/platforms/zhihu.svg', followers: 54,
  },
  {
    platform: '小红书', name: '宇文平野', bio: '审美，造型，摄影，记录，风格，生活',
    url: 'https://www.xiaohongshu.com/user/profile/5aeaf5ce11be100663d91961',
    logo: '/images/social/platforms/xiaohongshu.svg', followers: 45,
  },
  {
    platform: '抖音', name: '宇文平野', bio: '抖音号：yuwenpingye',
    url: 'https://www.douyin.com/user/MS4wLjABAAAAXC2iHXmI_rso90mWtls-INUSfg-7c2rP-KkxIHssYZw',
    logo: '/images/social/platforms/douyin.png', followers: 77,
  },
  {
    platform: 'B 站', name: '宇文平野', bio: '天行健，君子以自强不息',
    url: 'https://space.bilibili.com/40758928',
    logo: '/images/social/platforms/bilibili.svg', followers: 2,
  },
  {
    platform: 'YouTube', name: '宇文平野', bio: '频道：@廖芳-f3l',
    url: 'https://www.youtube.com/@%E5%BB%96%E8%8A%B3-f3l',
    logo: '/images/social/platforms/youtube.svg', followers: 1, followerLabel: '订阅者',
  },
  {
    platform: '微博', name: '宇文平野', bio: '微博账号：liaofang415',
    url: 'https://weibo.com/u/1896953301',
    logo: '/images/social/platforms/weibo.svg', followers: 183,
  },
  {
    platform: '即刻', name: '宇文平野', bio: '未完成的科幻写手，目前是不思进取的pm',
    url: 'https://web.okjike.com/u/7C80B16C-015F-4ADC-A019-1EBDD6F474AC',
    logo: '/images/social/platforms/jike.png', followers: 4,
  },
];
