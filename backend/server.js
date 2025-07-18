require('dotenv').config();

// Set up global proxy BEFORE any other imports
const globalAgent = require('global-agent');
const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || 'http://127.0.0.1:33210';

// Enable debugging
process.env.DEBUG = 'global-agent';
globalAgent.bootstrap({
  environmentVariableNamespace: '',
  forceGlobalAgent: true,
  socketConnectionTimeout: 60000,
});

global.GLOBAL_AGENT.HTTP_PROXY = proxyUrl;
global.GLOBAL_AGENT.HTTPS_PROXY = proxyUrl;

// Force proxy for all requests
process.env.HTTP_PROXY = proxyUrl;
process.env.HTTPS_PROXY = proxyUrl;
process.env.http_proxy = proxyUrl;
process.env.https_proxy = proxyUrl;

console.log('Global proxy configured:', proxyUrl);
console.log('GLOBAL_AGENT.HTTP_PROXY:', global.GLOBAL_AGENT.HTTP_PROXY);
console.log('GLOBAL_AGENT.HTTPS_PROXY:', global.GLOBAL_AGENT.HTTPS_PROXY);

// Check API key
const apiKey = process.env.ANTHROPIC_API_KEY;
console.log('API Key length:', apiKey ? apiKey.length : 'undefined');
console.log('API Key starts with:', apiKey ? apiKey.substring(0, 15) + '...' : 'undefined');
console.log('API Key format valid:', apiKey && apiKey.startsWith('sk-ant-api') && apiKey.length > 50);

const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8001;

// Test proxy connection
function testProxyConnection() {
  console.log('Testing proxy connection...');
  const req = https.request({
    hostname: 'httpbin.org',
    port: 443,
    path: '/ip',
    method: 'GET'
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Proxy test response:', data);
    });
  });
  
  req.on('error', (err) => {
    console.log('Proxy test error:', err.message);
  });
  
  req.end();
}

// Test Anthropic API domain accessibility
function testAnthropicDomain() {
  console.log('Testing Anthropic API domain...');
  const req = https.request({
    hostname: 'api.anthropic.com',
    port: 443,
    path: '/v1/messages',
    method: 'GET',
    headers: {
      'User-Agent': 'curl/7.68.0'
    }
  }, (res) => {
    console.log('Anthropic domain test status:', res.statusCode);
    console.log('Anthropic domain test headers:', res.headers);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Anthropic domain response:', data.substring(0, 200));
    });
  });
  
  req.on('error', (err) => {
    console.log('Anthropic domain test error:', err.message);
  });
  
  req.end();
}

// Initialize Anthropic client with undici proxy
const { ProxyAgent } = require('undici');
const proxyAgent = new ProxyAgent(proxyUrl);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  fetch: (url, options) => {
    return fetch(url, {
      ...options,
      dispatcher: proxyAgent,
    });
  },
});

// Test proxy on startup
setTimeout(testProxyConnection, 2000);
setTimeout(testAnthropicDomain, 3000);

// Test Anthropic API with simple request
async function testAnthropicAPI() {
  console.log('Testing Anthropic API...');
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hello' }]
    });
    console.log('Anthropic API test successful:', response.content[0].text.substring(0, 50));
  } catch (error) {
    console.log('Anthropic API test failed:', error.message);
    console.log('Status:', error.status);
    console.log('Error details:', error.error);
  }
}

setTimeout(testAnthropicAPI, 5000);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RWA Search Backend is running' });
});

// Claude API proxy endpoint
app.post('/api/search-rwa-cases', async (req, res) => {
  try {
    const { companyName, industry, companyType, description } = req.body;
    
    console.log('Received search request:', { companyName, industry, companyType });
    console.log('About to make Anthropic API call with proxy:', proxyUrl);
    
    const prompt = `请帮我搜索并分析与以下企业信息相关的RWA（真实世界资产）代币化案例：

企业信息：
- 企业名称：${companyName}
- 所属行业：${industry || '未指定'}
- 企业类型：${companyType || '未指定'}
- 企业描述：${description || '未提供'}

请基于真实的区块链和金融科技项目，提供详细的RWA代币化案例分析。重点关注以下几个方面：

1. 与该企业同行业或类似业务的RWA代币化案例
2. 每个案例需要包含详细的技术实现信息：
   - 项目名称和背景
   - 资产类型和代币化的具体资产
   - 项目规模和融资情况
   - 实施时间和发展阶段
   - 使用的区块链技术平台
   - 智能合约架构和代币标准
   - 详细的代币化流程（每一步的具体实施方法）
   - 流动性提供机制
   - 治理和合规框架
   - 风险管理策略
   - 项目成果和市场表现
   - 可验证的信息来源链接

特别要求：
- 代币化过程要详细展开，说明每一步的具体实施方法
- 包含真实的项目案例，避免虚构信息
- 提供技术架构和智能合约的具体实现细节
- 如果涉及新能源行业，请包含相关的绿色金融和碳信用代币化案例

请以JSON格式返回，包含至少3个相关案例：

{
  "cases": [
    {
      "projectName": "项目名称",
      "assetType": "资产类型",
      "tokenizedAsset": "具体代币化资产",
      "scale": "项目规模",
      "implementationDate": "实施时间",
      "platform": "技术平台",
      "outcome": "项目成果",
      "sourceUrl": "信息来源链接",
      "relevanceScore": "相关度评分(1-10)",
      "technicalDetails": {
        "tokenStandard": "代币标准",
        "blockchainNetwork": "区块链网络",
        "smartContractAddress": "智能合约地址(如有)",
        "tokenizationProcess": "详细的代币化流程，包含每一步的具体实施方法",
        "liquidityMechanism": "流动性机制",
        "governanceModel": "治理模式",
        "riskManagement": "风险管理",
        "regulatoryCompliance": "监管合规",
        "codeExample": "智能合约代码示例"
      }
    }
  ]
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 8192,
      temperature: 1,
      system: prompt,
      messages: [
        {
          role: 'user',
          content: '请搜索'
        }
      ]
    });

    const content = response.content[0].text;
    console.log('Claude API response received');
    
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsedCases = JSON.parse(jsonMatch[0]);
        res.json(parsedCases);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // Return the raw content if parsing fails
        res.json({
          cases: [{
            projectName: "Claude API 响应解析失败",
            assetType: "解析错误",
            tokenizedAsset: "请查看原始响应",
            scale: "未知",
            implementationDate: "未知",
            platform: "未知",
            outcome: content.substring(0, 500) + "...",
            sourceUrl: "",
            relevanceScore: "5",
            technicalDetails: {
              tokenStandard: "解析失败",
              tokenizationProcess: "无法解析详细流程",
              liquidityMechanism: "未知",
              governanceModel: "未知",
              riskManagement: "未知",
              regulatoryCompliance: "未知"
            }
          }]
        });
      }
    } else {
      // If no JSON found, create a structured response from the text
      res.json({
        cases: [{
          projectName: "Claude API 文本响应",
          assetType: "文本内容",
          tokenizedAsset: "请查看完整响应",
          scale: "未知",
          implementationDate: "未知",
          platform: "Claude AI",
          outcome: content,
          sourceUrl: "",
          relevanceScore: "7",
          technicalDetails: {
            tokenStandard: "文本响应",
            tokenizationProcess: "详细信息请查看项目成果部分",
            liquidityMechanism: "请参考完整响应",
            governanceModel: "请参考完整响应",
            riskManagement: "请参考完整响应",
            regulatoryCompliance: "请参考完整响应"
          }
        }]
      });
    }

  } catch (error) {
    console.error('Claude API Error:', error);
    
    res.status(500).json({
      error: 'API调用失败',
      message: error.message,
      cases: []
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Claude API Key configured:', process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No');
});