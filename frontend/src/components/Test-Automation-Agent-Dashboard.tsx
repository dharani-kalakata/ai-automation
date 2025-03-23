// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import * as echarts from 'echarts';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  expanded?: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const projectTree: TreeNode[] = [
    {
      id: '1',
      name: 'Project Root',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: '2',
          name: 'src',
          type: 'folder',
          children: [
            { id: '3', name: 'login.test.js', type: 'file' },
            { id: '4', name: 'api.test.js', type: 'file' },
          ]
        },
        {
          id: '5',
          name: 'tests',
          type: 'folder',
          children: [
            { id: '6', name: 'integration.test.js', type: 'file' },
            { id: '7', name: 'e2e.test.js', type: 'file' },
          ]
        }
      ]
    }
  ];

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isSelected = selectedNode === node.id;
    const paddingLeft = level * 20;

    return (
      <div key={node.id}>
        <div 
          className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => setSelectedNode(node.id)}
        >
          <i className={`fas ${node.type === 'folder' ? 'fa-folder text-blue-500' : 'fa-file-code text-gray-500'} mr-2`}></i>
          <span className="text-sm">{node.name}</span>
        </div>
        {node.children && node.expanded && (
          <div>
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setIsProcessing(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Test generation completed. Running automated tests...',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Project Tree */}
      <div className="w-1/5 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <i className="fas fa-project-diagram text-blue-500 mr-2"></i>
            <h2 className="font-semibold">Project Files</h2>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              className="w-full px-3 py-2 pl-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fas fa-search absolute left-2.5 top-3 text-gray-400"></i>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-100px)]">
          {projectTree.map(node => renderTreeNode(node))}
        </div>
      </div>

      {/* Middle Panel - Communication Area */}
      <div className="w-[45%] bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">AI Communication</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 !rounded-button whitespace-nowrap">
                <i className="fas fa-cog mr-2"></i>
                Settings
              </button>
            </div>
          </div>
          <div className="flex space-x-2 mb-4">
            <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 !rounded-button whitespace-nowrap">
              <i className="fas fa-code-branch mr-2"></i>
              Unit Tests
            </button>
            <button className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 !rounded-button whitespace-nowrap">
              <i className="fas fa-vial mr-2"></i>
              Integration Tests
            </button>
            <button className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 !rounded-button whitespace-nowrap">
              <i className="fas fa-robot mr-2"></i>
              E2E Tests
            </button>
          </div>
        </div>
        <div className="p-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your testing requirements..."
            className="w-full h-48 p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              onClick={() => setInputValue('')}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 !rounded-button whitespace-nowrap"
            >
              Clear
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isProcessing}
              className={`px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center !rounded-button whitespace-nowrap ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Generate Tests
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Results Display */}
      <div className="w-[35%] bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold">Test Results & History</h2>
        </div>
        <div className="h-[calc(100vh-72px)] overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

