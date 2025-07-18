import React, { useState } from 'react';

const CaseDisplay = ({ cases, loading }) => {
  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-lg text-gray-600">正在搜索相关案例...</span>
        </div>
      </div>
    );
  }

  if (!cases || cases.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        相关RWA代币化案例 ({cases.length}个)
      </h2>
      
      <div className="space-y-6">
        {cases.map((caseItem, index) => (
          <CaseCard key={index} caseData={caseItem} />
        ))}
      </div>
    </div>
  );
};

const CaseCard = ({ caseData }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showCodeExample, setShowCodeExample] = useState(false);
  
  const {
    projectName,
    assetType,
    tokenizedAsset,
    scale,
    implementationDate,
    platform,
    outcome,
    sourceUrl,
    relevanceScore,
    technicalDetails
  } = caseData;

  const getRelevanceColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 8) return 'bg-green-100 text-green-800';
    if (numScore >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{projectName}</h3>
        {relevanceScore && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(relevanceScore)}`}>
            相关度: {relevanceScore}/10
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex">
            <span className="font-medium text-gray-700 w-20">资产类型:</span>
            <span className="text-gray-600">{assetType}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-gray-700 w-20">代币化资产:</span>
            <span className="text-gray-600">{tokenizedAsset}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-gray-700 w-20">项目规模:</span>
            <span className="text-gray-600">{scale}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex">
            <span className="font-medium text-gray-700 w-20">实施时间:</span>
            <span className="text-gray-600">{implementationDate}</span>
          </div>
          <div className="flex">
            <span className="font-medium text-gray-700 w-20">技术平台:</span>
            <span className="text-gray-600">{platform}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <span className="font-medium text-gray-700">项目成果:</span>
        <p className="text-gray-600 mt-1">{outcome}</p>
      </div>
      
      {sourceUrl && sourceUrl !== '' && (
        <div className="border-t pt-4">
          <span className="font-medium text-gray-700">信息来源:</span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            {sourceUrl}
          </a>
        </div>
      )}
      
      {/* Technical Details Section */}
      {technicalDetails && (
        <div className="border-t pt-4 mt-4">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <span>技术实现详情</span>
            <svg
              className={`ml-2 h-4 w-4 transform transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showTechnicalDetails && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {technicalDetails.tokenStandard && (
                  <div>
                    <span className="font-medium text-gray-700">代币标准:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.tokenStandard}</p>
                  </div>
                )}
                {technicalDetails.blockchainNetwork && (
                  <div>
                    <span className="font-medium text-gray-700">区块链网络:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.blockchainNetwork}</p>
                  </div>
                )}
                {technicalDetails.smartContractAddress && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">智能合约地址:</span>
                    <p className="text-gray-600 mt-1 font-mono text-xs break-all">{technicalDetails.smartContractAddress}</p>
                  </div>
                )}
              </div>
              
              {technicalDetails.tokenizationProcess && (
                <div>
                  <span className="font-medium text-gray-700">代币化流程:</span>
                  {typeof technicalDetails.tokenizationProcess === 'object' ? (
                    <div className="mt-1 text-sm space-y-2">
                      {Object.entries(technicalDetails.tokenizationProcess).map(([key, value]) => (
                        <div key={key} className="text-gray-600">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 mt-1 text-sm">{technicalDetails.tokenizationProcess}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {technicalDetails.liquidityMechanism && (
                  <div>
                    <span className="font-medium text-gray-700">流动性机制:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.liquidityMechanism}</p>
                  </div>
                )}
                {technicalDetails.governanceModel && (
                  <div>
                    <span className="font-medium text-gray-700">治理模式:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.governanceModel}</p>
                  </div>
                )}
                {technicalDetails.regulatoryCompliance && (
                  <div>
                    <span className="font-medium text-gray-700">监管合规:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.regulatoryCompliance}</p>
                  </div>
                )}
              </div>
              
              {/* Code Example Section */}
              {technicalDetails.codeExample && (
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowCodeExample(!showCodeExample)}
                    className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
                  >
                    <span>查看智能合约代码示例</span>
                    <svg
                      className={`ml-2 h-4 w-4 transform transition-transform ${showCodeExample ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showCodeExample && (
                    <div className="mt-4">
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                          {technicalDetails.codeExample}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Additional Technical Details */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                {technicalDetails.riskManagement && (
                  <div>
                    <span className="font-medium text-gray-700">风险管理:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.riskManagement}</p>
                  </div>
                )}
                {technicalDetails.iotIntegration && (
                  <div>
                    <span className="font-medium text-gray-700">IoT集成:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.iotIntegration}</p>
                  </div>
                )}
                {technicalDetails.sustainabilityMetrics && (
                  <div>
                    <span className="font-medium text-gray-700">可持续性指标:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.sustainabilityMetrics}</p>
                  </div>
                )}
                {technicalDetails.supplyChainTracking && (
                  <div>
                    <span className="font-medium text-gray-700">供应链追踪:</span>
                    <p className="text-gray-600 mt-1">{technicalDetails.supplyChainTracking}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CaseDisplay;