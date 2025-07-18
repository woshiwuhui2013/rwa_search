import React, { useState } from 'react';
import EnterpriseForm from './components/EnterpriseForm';
import CaseDisplay from './components/CaseDisplay';

function App() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (enterpriseData) => {
    setLoading(true);
    setError(null);
    setCases([]);

    try {
      // This will be implemented in the Claude API integration
      const response = await searchRWACases(enterpriseData);
      setCases(response.cases);
    } catch (err) {
      setError('搜索失败，请稍后重试');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchRWACases = async (enterpriseData) => {
    // Claude API integration will go here
    return { cases: [] };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            RWA资产代币化案例搜索
          </h1>
          <p className="text-lg text-gray-600">
            输入企业信息，获取相关的真实世界资产代币化案例
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <EnterpriseForm onSearch={handleSearch} loading={loading} />
          
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <CaseDisplay cases={cases} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default App;