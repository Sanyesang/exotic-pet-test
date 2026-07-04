/**
 * 饲养档案
 * 每种异宠的饲养指南，按 pet id 索引
 */
const careGuides = {
  'leopard-gecko': {
    environment: '28-32°C热区 · 24-26°C冷区 · 湿度40-60% · 30cm盒子即可',
    feeding: '主食面包虫蟋蟀 · 幼体每天喂 · 成体隔天喂 · 每周补钙粉',
    maintenance: '每天清理粪便 · 每月换垫材 · 水盆保持干净',
    tips: '新手首选 · 基因颜色超多 · 小空间就能养 · 很皮实',
    commonIssues: '拒食温度不够 · 脱皮不顺湿度低 · 尾巴自切惊吓'
  },
  'bearded-dragon': {
    environment: '35-40°C晒点 · 28-30°C冷区 · 湿度30-40% · 120cm+箱子',
    feeding: '幼体天天蟋蟀 · 成体杂食蔬菜+虫 · 每天新鲜蔬菜',
    maintenance: '每天清粪便 · UVB灯6个月换 · 泡澡助排便',
    tips: '互动性最好的爬宠 · 会认主人 · 需要UVB灯（必须）',
    commonIssues: '缺钙下巴软 · 代谢性骨病 · 寄生虫 · 拒食发情期'
  },
  'corn-snake': {
    environment: '25-30°C热区 · 22-24°C冷区 · 湿度40-60% · 60cm+箱子',
    feeding: '冻鼠（大小≈蛇最粗处1.5倍） · 幼体5天 · 成体7-10天',
    maintenance: '排便后随时清 · 每月换垫材 · 水盆常换水',
    tips: '温顺不咬人 · 基因色超多 · 新手蛇首选 · 很省心',
    commonIssues: '拒食发情期 · 呼吸道感染湿度高 · 体外寄生虫'
  },
  'ball-python': {
    environment: '30-32°C热区 · 26-28°C冷区 · 湿度50-60% · 90cm+箱子',
    feeding: '冻鼠 · 幼体5天一次 · 成体7-14天一次',
    maintenance: '排便后清理 · 喷水保湿 · 每月换垫材',
    tips: '性格超温顺 · 颜值天花板 · 偶尔拒食别慌 · 勇士黄金等基因',
    commonIssues: '拒食最著名 · 呼吸道感染 · 螨虫 · 口腔炎'
  },
  'pacman-frog': {
    environment: '24-28°C · 湿度60-80% · 潮湿垫材椰土 · 20cm盒子即可',
    feeding: '蟋蟀面包虫小鱼 · 幼体每天 · 成体2-3天',
    maintenance: '保持垫材湿润 · 每周换垫材 · 少上手',
    tips: '肥宅代表 · 一张嘴占身体1/3 · 适合懒人 · 观赏主',
    commonIssues: '肥胖喂太多 · 皮肤感染垫材不干净 · 红腿病'
  },
  'tarantula': {
    environment: '24-28°C · 湿度60-70% · 椰土垫材10cm+挖洞 · 20cm盒子',
    feeding: '蟋蟀杜比亚 · 幼体2-3天 · 成体5-7天',
    maintenance: '几乎不用清理 · 每月换水 · 蜕皮期别打扰',
    tips: '低维护之王 · 一周喂一次 · 独特小众 · 观赏解压',
    commonIssues: '拒食蜕皮前 · 脱水湿度不够 · 摔伤爬高处坠落'
  },
  'sugar-glider': {
    environment: '22-26°C · 湿度50-70% · 大笼子60cm+ · 需要攀爬空间',
    feeding: '专用粮+水果+虫 · 每天喂 · 需要钙粉',
    maintenance: '每天清洗食盆水盆 · 每周全面清洁 · 每天至少2小时陪伴',
    tips: '需要大量陪伴 · 建议养一对 · 晚上最活跃 · 粘人但需耐心',
    commonIssues: '抑郁症孤独 · 营养不良 · 自残压力大 · 咬人'
  },
  'hedgehog': {
    environment: '24-27°C · 湿度40-60% · 加热垫必须 · 60cm笼子',
    feeding: '专用粮/高蛋白猫粮 · 面包虫当零食 · 每天喂',
    maintenance: '每天清跑轮粪便 · 每周换垫材 · 每周洗澡剪指甲',
    tips: '需要耐心建立信任 · 刚到家会缩刺球 · 养熟后躺手开肚皮',
    commonIssues: '皮肤病最常见 · 肥胖 · 牙结石 · 呼吸道感染温度低'
  },
  'chinchilla': {
    environment: '18-24°C怕热！ · 湿度40-50% · 大笼子多层跳板 · 必须空调',
    feeding: '龙猫专用粮+提摩西草无限量 · 每天喂 · 苹果枝磨牙',
    maintenance: '每天清厕所 · 每周换垫材 · 每周沙浴2-3次',
    tips: '毛最密的陆地动物 · 超怕热28℃可能中暑 · 空调续命',
    commonIssues: '中暑致命 · 牙齿过长 · 消化不良 · 食毛症压力大'
  },
  'guinea-pig': {
    environment: '18-24°C · 湿度40-60% · 60cm笼子 · 需要躲藏小屋',
    feeding: '提摩西草无限量+粮+维C · 每天新鲜蔬菜',
    maintenance: '每天换垫材 · 食盆水盆每天洗 · 每周消毒',
    tips: '群居最好养两只 · 会发超可爱的嘤嘤声 · 需要补充维生素C',
    commonIssues: '缺维C坏血病 · 呼吸道感染 · 足皮炎 · 牙齿过长'
  },
  'turtle': {
    environment: '水温24-28°C · 晒台30-35°C · 水陆环境 · 晒背灯',
    feeding: '龟粮主+小鱼虾蔬菜 · 幼体每天 · 成体2-3天',
    maintenance: '每2-3天换部分水 · 每月清洗过滤 · 每周刷背甲',
    tips: '超长寿30-50年 · 需要晒背灯必须 · 水脏容易生病',
    commonIssues: '白眼病水质差 · 腐皮腐甲 · 肺炎水温低 · 软壳缺钙'
  },
  'squirrel': {
    environment: '18-26°C · 大笼子带跑轮攀爬架 · 需要放风空间',
    feeding: '专用粮+坚果+水果 · 每天喂 · 需要磨牙',
    maintenance: '每天清理食盆 · 每周全面清理 · 每天放风',
    tips: '活泼可爱 · 但不太亲人可能咬 · 需要大空间 · 有耐心细心',
    commonIssues: '咬人未驯化 · 肥胖运动不足 · 牙齿过长 · 皮肤病'
  },
  'call-duck': {
    environment: '室外阳台大笼子+水池 · 需要游泳水域 · 冬天保暖',
    feeding: '鸭粮+蔬菜+谷物 · 每天喂 · 无限量清水',
    maintenance: '每天换水鸭子超脏 · 每周清洗水池 · 羽毛清理',
    tips: '王思聪同款网红鸭 · 可爱但麻烦 · 排便量大 · 可能吵闹',
    commonIssues: '羽毛脏 · 脚部感染 · 肥胖 · 叫声扰民'
  },
  'dwarf-rabbit': {
    environment: '20-24°C · 笼子60cm+运动空间 · 需要放风',
    feeding: '提摩西草无限量+兔粮+蔬菜 · 每天喂',
    maintenance: '每天清厕所 · 每周换垫材 · 磨牙 · 会咬电线注意！',
    tips: '会认主人超治愈 · 必须无限量提摩西草 · 训练定点上厕所',
    commonIssues: '毛球症 · 牙齿过长 · 腹泻 · 歪头病'
  },
  'tortoise': {
    environment: '室外大龟箱+晒点30-35°C · 需要大面积活动空间',
    feeding: '蔬菜+草+专用粮 · 每天喂 · 钙粉+维生素D3',
    maintenance: '每天泡澡促排便 · 每周清理 · 需要UVB灯',
    tips: '寿命超长可当传家宝 · 需要大空间院子 · 冬眠需准备',
    commonIssues: '隆背生长过快 · 呼吸道感染 · 软壳 · 结石'
  },
  'blue-tongue-skink': {
    environment: '28-32°C热区 · 24-26°C冷区 · 湿度40-60% · 90cm箱子',
    feeding: '猫粮+蔬菜+水果+虫 · 2-3天喂 · 钙粉',
    maintenance: '每天清粪便 · 每周换垫材 · 偶尔泡澡',
    tips: '智商高会认主人 · 蓝舌头超搞笑 · 互动性极好 · 进阶玩家首选',
    commonIssues: '肥胖喂太多 · 寄生虫 · 呼吸道感染'
  },
  'hermit-crab': {
    environment: '24-28°C · 湿度70-80% · 沙质垫材+换壳 · 群居养3-5只',
    feeding: '水果蔬菜鱼虾专用粮 · 2-3天喂 · 海水+淡水',
    maintenance: '每天喷水保湿 · 每周换部分垫材 · 提供不同螺壳',
    tips: '养了会换壳超有趣 · 成本极低 · 群居 · 适合体验养宠',
    commonIssues: '换壳失败壳不够 · 脱水 · 压力大不群居'
  },
  'chameleon': {
    environment: '25-30°C · 湿度60-80% · 网箱通风 · 喷淋系统',
    feeding: '蟋蟀蟑螂苍蝇 · 每天喂 · 钙粉+维生素超重要',
    maintenance: '每天喷水2-3次 · 每周清理 · 绝对不能上手',
    tips: '高难度专属高手 · 观赏价值天花板 · 每天手工喷水 · 新手别碰',
    commonIssues: '缺钙致命 · 呼吸道感染 · 寄生虫 · 压力上手'
  },
  'axolotl': {
    environment: '14-20°C怕热！ · 水深30cm+ · 过滤 · 不用加热棒',
    feeding: '红虫蚯蚓专用颗粒 · 每天喂 · 镊子喂',
    maintenance: '每周换1/3水 · 清理过滤器 · 温度不能超22°C',
    tips: '永远保持幼体状态 · 喜欢冷水 · 六根外鳃像天使翅膀',
    commonIssues: '水霉病水质差 · 温度过高致命 · 四肢再生异常'
  },
  'hognose-snake': {
    environment: '26-30°C热区 · 22-24°C冷区 · 湿度30-50% · 60cm箱子',
    feeding: '冻鼠蜥蜴 · 幼体5天 · 成体7-10天 · 有时挑食',
    maintenance: '排便后清 · 每月换垫材 · 保持干燥 · 省心',
    tips: '戏精本精会装死 · 猪鼻子超可爱 · 体型小60cm · 新手友好',
    commonIssues: '拒食挑战期 · 装死过度 · 呼吸道感染'
  },
  'milk-frog': {
    environment: '24-28°C · 湿度60-80% · 雨林缸高湿 · 攀爬植物',
    feeding: '蟋蟀蟑螂 · 2-3天喂 · 钙粉',
    maintenance: '每天喷水 · 每周清理缸体 · 定期修剪植物',
    tips: '圆滚滚像融化的巧克力 · 温顺会爬手上讨食 · 雨林缸观赏性拉满',
    commonIssues: '皮肤感染湿度不够 · 肥胖 · 钙缺乏'
  },
  'emperor-scorpion': {
    environment: '25-30°C · 湿度70-80% · 10cm+厚椰土挖洞 · 20cm盒子',
    feeding: '蟋蟀杜比亚面包虫 · 成体5-7天 · 晚上捕食',
    maintenance: '偶尔喷水 · 2-3月换垫材 · 极低维护',
    tips: '霸气黑武士造型 · 毒性很低≈蜜蜂 · 挖洞捕食解压',
    commonIssues: '脱水湿度不够 · 螨虫 · 拒食蜕皮前'
  }
}

export default careGuides
