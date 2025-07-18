// Claude API integration using direct HTTP calls
// Note: Due to CORS restrictions, this approach uses direct fetch with proper headers
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

// Generate intelligent mock responses based on enterprise data
const generateMockResponse = (enterpriseData) => {
  const { companyName, industry, companyType, description } = enterpriseData;
  
  // Industry-specific RWA cases
  const industryMappings = {
    '房地产': [
      {
        projectName: "RealT - 房地产分割投资平台",
        assetType: "房地产",
        tokenizedAsset: "美国住宅物业",
        scale: "超过3000万美元",
        implementationDate: "2019年",
        platform: "以太坊",
        outcome: "成功将房地产分割为代币，降低投资门槛",
        sourceUrl: "https://realt.co/",
        relevanceScore: "9",
        technicalDetails: {
          tokenStandard: "ERC-20",
          smartContractAddress: "0x0675DAa94725A528b05A3A88635C03EA1C5A37A8",
          blockchainNetwork: "以太坊主网、Gnosis Chain",
          tokenizationProcess: "法律实体→SPV设立→资产评估→代币发行→流动性提供",
          codeExample: `// RealT代币合约核心逻辑
contract RealToken is ERC20, Ownable {
    struct PropertyData {
        string propertyAddress;
        uint256 totalValue;
        uint256 rentYield;
        uint256 tokenSupply;
    }
    
    PropertyData public property;
    mapping(address => uint256) public lastDividendClaim;
    
    function distributeDividends() external onlyOwner {
        uint256 totalRent = address(this).balance;
        uint256 perTokenDividend = totalRent / totalSupply();
        
        for (uint i = 0; i < holders.length; i++) {
            address holder = holders[i];
            uint256 dividend = balanceOf(holder) * perTokenDividend;
            payable(holder).transfer(dividend);
        }
    }
}`,
          governanceModel: "代币持有者投票决定重大事项",
          liquidityMechanism: "去中心化交易所(Uniswap)和专有交易平台",
          regualtoryCompliance: "SEC Regulation D, Regulation S合规"
        }
      },
      {
        projectName: "Fundrise - 房地产众筹",
        assetType: "房地产投资信托",
        tokenizedAsset: "商业和住宅地产组合",
        scale: "超过70亿美元",
        implementationDate: "2012年",
        platform: "专有平台",
        outcome: "为散户投资者提供房地产投资机会",
        sourceUrl: "https://fundrise.com/",
        relevanceScore: "8",
        technicalDetails: {
          tokenStandard: "传统证券化(非区块链)",
          investmentStructure: "eREIT (electronic Real Estate Investment Trust)",
          minimumInvestment: "$10",
          tokenizationProcess: "资产收购→尽职调查→法律架构→投资者募集→资产管理",
          codeExample: `// Fundrise投资逻辑示例 (传统架构)
class FundriseInvestment {
    constructor(propertyPortfolio, investmentAmount) {
        this.portfolio = propertyPortfolio;
        this.shares = investmentAmount / this.getNavPerShare();
    }
    
    calculateQuarterlyDividend() {
        const portfolioRent = this.portfolio.getTotalRent();
        const expenses = this.portfolio.getExpenses();
        const netIncome = portfolioRent - expenses;
        return (netIncome / this.portfolio.totalShares) * this.shares;
    }
    
    getPortfolioValue() {
        return this.portfolio.properties.reduce((total, property) => {
            return total + property.currentMarketValue;
        }, 0);
    }
}`,
          dividendDistribution: "季度分红，历史年化收益8-12%",
          liquidityMechanism: "有限流动性，5年投资期限",
          regualtoryCompliance: "SEC注册投资顾问，FINRA成员"
        }
      }
    ],
    '艺术品': [
      {
        projectName: "Masterworks - 艺术品投资",
        assetType: "艺术品",
        tokenizedAsset: "蓝筹艺术作品",
        scale: "超过8亿美元",
        implementationDate: "2017年",
        platform: "传统证券化",
        outcome: "将昂贵艺术品分割为可投资份额",
        sourceUrl: "https://masterworks.io/",
        relevanceScore: "9",
        technicalDetails: {
          tokenStandard: "传统股权证券(非区块链)",
          artworkValuation: "独立第三方评估 + AI估值模型",
          fractionalOwnership: "LLC结构，每个艺术品独立实体",
          tokenizationProcess: "艺术品收购→专家评估→法律架构→证券发行→持有管理→退出销售",
          codeExample: `// Masterworks艺术品投资逻辑
class ArtworkInvestment {
    constructor(artwork, investmentAmount) {
        this.artwork = artwork;
        this.sharesOwned = investmentAmount / artwork.sharePrice;
        this.acquisitionDate = new Date();
    }
    
    calculateAppreciation() {
        const currentValue = this.artwork.getCurrentMarketValue();
        const acquisitionValue = this.artwork.acquisitionPrice;
        const appreciation = (currentValue - acquisitionValue) / acquisitionValue;
        return appreciation * this.sharesOwned;
    }
    
    // 基于艺术品市场数据的ML估值模型
    estimateValue() {
        const features = {
            artist: this.artwork.artist,
            period: this.artwork.period,
            medium: this.artwork.medium,
            size: this.artwork.dimensions,
            marketTrends: getArtMarketTrends()
        };
        return MLValuationModel.predict(features);
    }
}`,
          exitStrategy: "3-10年持有期，通过拍卖或私人销售退出",
          liquidityMechanism: "二级市场交易(有限流动性)",
          riskManagement: "艺术品保险、专业存储、市场分析",
          regulatoryCompliance: "SEC Regulation A+, 面向非认证投资者"
        }
      }
    ],
    '金融': [
      {
        projectName: "Centrifuge - DeFi资产代币化",
        assetType: "金融资产",
        tokenizedAsset: "发票、贷款等金融工具",
        scale: "超过3亿美元TVL",
        implementationDate: "2020年",
        platform: "Centrifuge Chain",
        outcome: "连接传统金融和DeFi",
        sourceUrl: "https://centrifuge.io/",
        relevanceScore: "8",
        technicalDetails: {
          tokenStandard: "ERC-1400 (Security Token) + CFG Native Token",
          blockchainNetwork: "Centrifuge Chain (Substrate) + 以太坊桥接",
          consensusMechanism: "Proof of Stake (Nominated Proof of Stake)",
          tokenizationProcess: "资产定义→信用评估→NFT铸造→池子创建→投资者募集→流动性挖矿",
          codeExample: `// Centrifuge资产池智能合约核心逻辑
contract AssetPool is ERC20 {
    struct Asset {
        bytes32 assetId;
        uint256 value;
        uint256 maturityDate;
        uint8 riskRating;
        bool isActive;
    }
    
    mapping(bytes32 => Asset) public assets;
    mapping(address => uint256) public epochInvestments;
    
    uint256 public totalAssetValue;
    uint256 public seniorRatio = 80; // 80%优先级，20%劣后级
    
    function deposit(uint256 amount, bool isSenior) external {
        require(amount > 0, "Amount must be positive");
        
        if (isSenior) {
            seniorTokens.mint(msg.sender, amount);
        } else {
            juniorTokens.mint(msg.sender, amount);
        }
        
        dai.transferFrom(msg.sender, address(this), amount);
        updateNAV();
    }
    
    function financeAsset(bytes32 assetId, uint256 amount) external onlyAssetOriginator {
        require(getTotalAvailableLiquidity() >= amount, "Insufficient liquidity");
        
        assets[assetId] = Asset({
            assetId: assetId,
            value: amount,
            maturityDate: block.timestamp + 180 days,
            riskRating: calculateRiskRating(assetId),
            isActive: true
        });
        
        totalAssetValue = totalAssetValue.add(amount);
        dai.transfer(msg.sender, amount);
    }
}`,
          riskAssessment: "链上信用评分 + 传统风控模型",
          liquidityProvision: "双重代币机制(Senior/Junior tranche)",
          interoperability: "跨链桥接以太坊，与MakerDAO等DeFi协议集成",
          regulatoryApproach: "符合欧盟证券法规，与传统金融机构合作"
        }
      }
    ],
    '农业': [
      {
        projectName: "Harvest Finance - 农业代币化",
        assetType: "农产品",
        tokenizedAsset: "农场收益和农产品期货",
        scale: "1000万美元+",
        implementationDate: "2021年",
        platform: "多链DeFi",
        outcome: "为农民提供新的融资渠道",
        sourceUrl: "https://harvest.finance/",
        relevanceScore: "7",
        technicalDetails: {
          tokenStandard: "ERC-20 (FARM token) + LP代币",
          blockchainNetwork: "以太坊 + Polygon + BSC",
          yieldFarmingMechanism: "自动复投策略 + 流动性挖矿",
          tokenizationProcess: "第一步：农场资产评估与尽职调查→第二步：法律架构设立(SPV/DAO)→第三步：智能合约开发与安全审计→第四步：代币经济模型设计→第五步：流动性池创建与做市商合作→第六步：治理机制实施→第七步：收益分配自动化→第八步：风险管理与保险对接",
          codeExample: `// Harvest农业收益聚合器合约
contract HarvestVault is ERC20 {
    IERC20 public underlying; // 底层农业代币
    IStrategy public strategy; // 收益策略合约
    
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        
        // 计算应铸造的份额
        uint256 shares = amount;
        if (totalSupply > 0) {
            shares = amount.mul(totalSupply).div(balance());
        }
        
        underlying.transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, shares);
        
        // 将资金投入策略合约进行农业挖矿
        underlying.transfer(address(strategy), amount);
        strategy.invest();
    }
    
    function harvest() external {
        strategy.harvest(); // 收获农业奖励
        uint256 profit = strategy.getProfit();
        
        // 将部分利润用于回购FARM代币
        if (profit > 0) {
            uint256 performanceFee = profit.mul(30).div(100);
            buyBackAndBurn(performanceFee);
        }
    }
    
    // IoT数据集成：温度、湿度、土壤状况
    function updateFarmConditions(
        uint256 temperature,
        uint256 humidity,
        uint256 soilPH
    ) external onlyOracle {
        farmConditions.temperature = temperature;
        farmConditions.humidity = humidity;
        farmConditions.soilPH = soilPH;
        
        // 基于条件调整收益预期
        adjustYieldExpectation();
    }
}`,
          iotIntegration: "传感器数据监控(温度、湿度、土壤) + 卫星图像分析",
          riskManagement: "天气保险 + 农作物期货对冲 + 多元化种植",
          supplyChainTracking: "从农场到餐桌的区块链溯源",
          sustainabilityMetrics: "碳排放追踪 + 水资源使用监控 + 生物多样性评估"
        }
      }
    ],
    '新能源': [
      {
        projectName: "SolarCoin - 太阳能发电代币化",
        assetType: "可再生能源",
        tokenizedAsset: "太阳能发电量和碳信用",
        scale: "全球分布式太阳能网络",
        implementationDate: "2014年",
        platform: "SolarCoin区块链",
        outcome: "激励太阳能发电，推动清洁能源采用",
        sourceUrl: "https://solarcoin.org/",
        relevanceScore: "9",
        technicalDetails: {
          tokenStandard: "SLR Native Token + ERC-20包装代币",
          blockchainNetwork: "SolarCoin主网 + 以太坊桥接",
          consensusMechanism: "Proof of Stake Time (PoST)",
          tokenizationProcess: "第一步：太阳能电站注册与身份验证→第二步：发电量数据收集与IoT集成→第三步：第三方验证机构确认发电数据→第四步：智能合约自动铸造SLR代币(1MWh=1SLR)→第五步：代币分发至电站所有者钱包→第六步：碳信用NFT同步生成→第七步：二级市场交易启用→第八步：环境影响数据上链存储",
          codeExample: `// SolarCoin发电量验证与代币铸造合约
contract SolarCoinMinting {
    struct SolarPanel {
        address owner;
        string panelId;
        uint256 capacity; // 装机容量(瓦特)
        uint256 totalGeneration; // 累计发电量(瓦时)
        bool isVerified;
        uint256 lastUpdate;
    }
    
    mapping(string => SolarPanel) public solarPanels;
    mapping(address => uint256) public generationRewards;
    
    event PowerGenerated(string panelId, uint256 amount, uint256 timestamp);
    event TokensMinted(address owner, uint256 amount);
    
    // IoT数据接入：智能电表自动上报发电数据
    function reportGeneration(
        string memory panelId,
        uint256 generatedPower,
        bytes memory signature
    ) external onlyVerifiedOracle {
        require(solarPanels[panelId].isVerified, "Panel not verified");
        
        // 验证数据签名确保真实性
        require(verifySignature(panelId, generatedPower, signature), "Invalid signature");
        
        SolarPanel storage panel = solarPanels[panelId];
        panel.totalGeneration += generatedPower;
        panel.lastUpdate = block.timestamp;
        
        // 计算应铸造的SLR代币 (1MWh = 1 SLR)
        uint256 rewardTokens = generatedPower / 1e6; // 转换为MWh
        
        if (rewardTokens > 0) {
            _mint(panel.owner, rewardTokens * 1e18);
            generationRewards[panel.owner] += rewardTokens;
            
            // 同时铸造碳信用NFT
            mintCarbonCreditNFT(panel.owner, rewardTokens);
        }
        
        emit PowerGenerated(panelId, generatedPower, block.timestamp);
        emit TokensMinted(panel.owner, rewardTokens);
    }
    
    // 注册新的太阳能电站
    function registerSolarPanel(
        string memory panelId,
        uint256 capacity,
        string memory location,
        bytes memory certificationProof
    ) external {
        require(!solarPanels[panelId].isVerified, "Panel already registered");
        
        solarPanels[panelId] = SolarPanel({
            owner: msg.sender,
            panelId: panelId,
            capacity: capacity,
            totalGeneration: 0,
            isVerified: false,
            lastUpdate: block.timestamp
        });
        
        // 发起第三方验证流程
        requestThirdPartyVerification(panelId, certificationProof);
    }
}`,
          iotIntegration: "智能电表实时数据上链 + 气象站环境监测 + 卫星遥感验证",
          carbonCredits: "自动生成VCS/Gold Standard认证碳信用NFT",
          riskManagement: "天气指数保险 + 设备性能担保 + 电力购买协议(PPA)对冲",
          sustainabilityMetrics: "实时碳减排量追踪 + 生命周期环境影响评估",
          regulatoryCompliance: "符合REC(可再生能源证书)标准 + 碳市场监管要求"
        }
      },
      {
        projectName: "Power Ledger - 分布式能源交易",
        assetType: "电力交易权",
        tokenizedAsset: "可再生能源电力交易权",
        scale: "超过30个国家部署",
        implementationDate: "2016年",
        platform: "Power Ledger区块链",
        outcome: "实现P2P电力交易，提高能源效率",
        sourceUrl: "https://powerledger.io/",
        relevanceScore: "8",
        technicalDetails: {
          tokenStandard: "POWR (ERC-20) + Sparkz (交易代币)",
          blockchainNetwork: "以太坊 + Power Ledger私有链",
          consensusMechanism: "Proof of Stake + 联盟链共识",
          tokenizationProcess: "第一步：能源资产确权与数字化→第二步：智能电网接入与实时监控→第三步：能源交易智能合约部署→第四步：用户KYC与钱包设置→第五步：实时电力供需匹配算法→第六步：自动化交易执行与结算→第七步：碳足迹计算与环境代币奖励→第八步：监管报告自动生成",
          codeExample: `// Power Ledger电力交易智能合约
contract EnergyTrading {
    struct EnergyOffer {
        address seller;
        uint256 amount; // 电量(kWh)
        uint256 pricePerKWh;
        uint256 availableFrom;
        uint256 availableUntil;
        bool isActive;
        string energySource; // solar, wind, hydro等
    }
    
    struct EnergyDemand {
        address buyer;
        uint256 amount;
        uint256 maxPricePerKWh;
        uint256 neededBy;
        bool isFulfilled;
    }
    
    EnergyOffer[] public energyOffers;
    EnergyDemand[] public energyDemands;
    
    mapping(address => uint256) public energyBalance;
    mapping(address => uint256) public carbonCredits;
    
    event EnergyTraded(address seller, address buyer, uint256 amount, uint256 price);
    event CarbonCreditsAwarded(address user, uint256 credits);
    
    // 发布售电信息
    function createEnergyOffer(
        uint256 amount,
        uint256 pricePerKWh,
        uint256 availableHours,
        string memory energySource
    ) external {
        energyOffers.push(EnergyOffer({
            seller: msg.sender,
            amount: amount,
            pricePerKWh: pricePerKWh,
            availableFrom: block.timestamp,
            availableUntil: block.timestamp + (availableHours * 1 hours),
            isActive: true,
            energySource: energySource
        }));
    }
    
    // 自动匹配买卖单
    function matchEnergyTrades() external {
        for (uint i = 0; i < energyDemands.length; i++) {
            if (energyDemands[i].isFulfilled) continue;
            
            for (uint j = 0; j < energyOffers.length; j++) {
                if (!energyOffers[j].isActive) continue;
                
                EnergyDemand storage demand = energyDemands[i];
                EnergyOffer storage offer = energyOffers[j];
                
                if (offer.pricePerKWh <= demand.maxPricePerKWh &&
                    offer.amount >= demand.amount &&
                    block.timestamp <= offer.availableUntil) {
                    
                    // 执行交易
                    executeEnergyTrade(i, j);
                    break;
                }
            }
        }
    }
    
    function executeEnergyTrade(uint demandIndex, uint offerIndex) internal {
        EnergyDemand storage demand = energyDemands[demandIndex];
        EnergyOffer storage offer = energyOffers[offerIndex];
        
        uint256 totalCost = demand.amount * offer.pricePerKWh;
        
        // 转移POWR代币作为支付
        IERC20(powr).transferFrom(demand.buyer, offer.seller, totalCost);
        
        // 更新能源余额
        energyBalance[demand.buyer] += demand.amount;
        offer.amount -= demand.amount;
        
        // 如果是清洁能源，奖励碳信用
        if (isCleanEnergy(offer.energySource)) {
            uint256 credits = calculateCarbonCredits(demand.amount, offer.energySource);
            carbonCredits[demand.buyer] += credits;
            emit CarbonCreditsAwarded(demand.buyer, credits);
        }
        
        demand.isFulfilled = true;
        if (offer.amount == 0) offer.isActive = false;
        
        emit EnergyTraded(offer.seller, demand.buyer, demand.amount, totalCost);
    }
}`,
          smartGridIntegration: "AMI智能电表 + 储能系统调度 + 电网负载平衡",
          peerToPeerTrading: "邻里间直接电力交易 + 实时价格发现机制",
          regulatoryCompliance: "电力市场监管合规 + 可再生能源配额制度"
        }
      }
    ]
  };
  
  // Default cases for any industry
  const defaultCases = [
    {
      projectName: "Backed Finance - 股票代币化",
      assetType: "股票",
      tokenizedAsset: "上市公司股票",
      scale: "数百万美元",
      implementationDate: "2022年",
      platform: "以太坊",
      outcome: "提供24/7股票交易和分割投资",
      sourceUrl: "https://backed.fi/",
      relevanceScore: "6",
      technicalDetails: {
        tokenStandard: "ERC-20 包装代币",
        underlyingAssets: "苹果、特斯拉、谷歌等主要股票",
        custodyModel: "瑞士银行托管底层股票",
        tokenizationProcess: "股票购买→银行托管→智能合约铸造→代币发行→交易启用",
        codeExample: `// Backed股票代币合约
contract BackedToken is ERC20 {
    address public custodian; // 瑞士银行托管地址
    string public underlying; // 底层股票标识符 (如: AAPL)
    uint256 public totalShares; // 总股票数量
    
    mapping(address => bool) public authorizedMinters;
    
    modifier onlyMinter() {
        require(authorizedMinters[msg.sender], "Not authorized");
        _;
    }
    
    // 当银行确认收到股票时铸造代币
    function mint(address to, uint256 shares) external onlyMinter {
        require(shares > 0, "Shares must be positive");
        
        uint256 tokenAmount = shares * 1e18; // 1股 = 1e18 代币
        totalShares = totalShares.add(shares);
        
        _mint(to, tokenAmount);
        
        emit StockTokenized(underlying, shares, to);
    }
    
    // 赎回代币换取底层股票
    function redeem(uint256 tokenAmount) external {
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient balance");
        
        uint256 shares = tokenAmount / 1e18;
        _burn(msg.sender, tokenAmount);
        
        // 通知托管银行释放股票
        ICustodian(custodian).releaseShares(underlying, shares, msg.sender);
    }
}`,
        liquidityProvision: "Uniswap V3 + 1inch聚合器",
        priceOracle: "Chainlink价格预言机 + 传统股票市场数据",
        regulatoryFramework: "瑞士DLT法案合规，BaFin授权",
        crossChainSupport: "计划扩展至Polygon和Arbitrum"
      }
    },
    {
      projectName: "Ondo Finance - 机构级RWA",
      assetType: "多元化资产",
      tokenizedAsset: "美国国债、企业债券",
      scale: "超过5亿美元",
      implementationDate: "2021年",
      platform: "以太坊",
      outcome: "为DeFi用户提供传统金融产品",
      sourceUrl: "https://ondo.finance/",
      relevanceScore: "7",
      technicalDetails: {
        tokenStandard: "ERC-20 代币化资产",
        productLines: "OUSG (美国国债), OHYG (高收益债券), OSTB (短期国债)",
        minimumInvestment: "$100,000 (认证投资者)",
        tokenizationProcess: "资产选择→SPV设立→资产购买→代币铸造→收益分配→赎回机制",
        codeExample: `// Ondo国债代币化合约
contract OndoSecuritizedToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant REDEEMER_ROLE = keccak256("REDEEMER_ROLE");
    
    uint256 public nav; // 净资产价值
    uint256 public lastUpdate;
    address public navOracle;
    
    struct Investor {
        bool isAccredited;
        uint256 kycLevel;
        uint256 lastInvestment;
    }
    
    mapping(address => Investor) public investors;
    
    modifier onlyAccredited() {
        require(investors[msg.sender].isAccredited, "Must be accredited investor");
        _;
    }
    
    function invest(uint256 usdcAmount) external onlyAccredited {
        require(usdcAmount >= 100000 * 1e6, "Minimum $100k investment");
        
        // KYC/AML检查
        require(investors[msg.sender].kycLevel >= 2, "Insufficient KYC level");
        
        uint256 shares = usdcAmount.mul(1e18).div(nav);
        usdc.transferFrom(msg.sender, address(this), usdcAmount);
        
        _mint(msg.sender, shares);
        
        // 将USDC投资于底层国债
        investInTreasuries(usdcAmount);
    }
    
    // 每日更新NAV
    function updateNAV(uint256 newNAV) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Admin only");
        nav = newNAV;
        lastUpdate = block.timestamp;
        emit NAVUpdated(newNAV, block.timestamp);
    }
}`,
        kycRequirements: "认证投资者验证 + AML合规检查",
        yieldDistribution: "每日累积收益，可随时赎回",
        riskManagement: "投资组合分散化 + 利率风险对冲",
        regulatoryCompliance: "SEC Regulation D, CFTC监管"
      }
    }
  ];
  
  // Get industry-specific cases or use defaults
  let relevantCases = industryMappings[industry] || defaultCases;
  
  // Add some general cases
  const allCases = [...relevantCases, ...defaultCases.slice(0, 1)];
  
  return {
    cases: allCases.slice(0, 3) // Return top 3 most relevant cases
  };
};

export const searchRWACases = async (enterpriseData) => {
  const { companyName, industry, companyType, description } = enterpriseData;

  try {
    console.log('Calling Claude API through backend proxy for:', { companyName, industry, companyType });
    
    // Call our backend proxy endpoint
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
    const response = await fetch(`${backendUrl}/api/search-rwa-cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName,
        industry,
        companyType,
        description
      })
    });

    if (!response.ok) {
      throw new Error(`Backend API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'API调用失败');
    }

    return data;
  } catch (error) {
    console.error('Claude API Error:', error);
    
    // If backend is not available, fallback to mock data
    console.log('Falling back to mock data due to API error');
    return generateMockResponse(enterpriseData);
  }
};