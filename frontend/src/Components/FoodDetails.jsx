import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import BASE_URL from '../config';

const FoodDetails = () => {
  const { foodItem } = useParams();
  const navigate = useNavigate();
  const [negativeReviews, setNegativeReviews] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Configure axios with proper headers
        const axiosConfig = {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        
        // Make API calls with proper error handling
        const [reviewsRes, summaryRes] = await Promise.all([
          axios.get(`${BASE_URL}/analytics/${foodItem}`, axiosConfig),
          axios.post(`${BASE_URL}/food-summary`, { food: foodItem }, axiosConfig)
        ]);
        
        // Check if data exists before setting state
        if (reviewsRes.data && 'negative_reviews' in reviewsRes.data) {
          setNegativeReviews(reviewsRes.data.negative_reviews);
        } else {
          setNegativeReviews([]);
          console.warn('No negative reviews data found in API response');
        }
        
        // Check for summary data
        if (summaryRes.data && 'summary' in summaryRes.data) {
          setSummary(summaryRes.data.summary);
          console.log('Summary loaded:', summaryRes.data.summary.substring(0, 50) + '...');
        } else {
          setSummary('No summary available for this food item.');
          console.warn('No summary data found in API response');
        }
      } catch (error) {
        console.error('API Error:', error);
        setError('Failed to load data. Please try again later.');
        
        // Set default values to prevent UI from breaking
        setNegativeReviews([]);
        setSummary('Unable to fetch summary at this time.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [foodItem]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 p-4 rounded-lg text-red-700 flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="text-sm text-red-600 hover:text-red-800 mt-2 underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 capitalize">
          Analysis for {foodItem}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Summary Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-blue-50 rounded-lg text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">AI Analysis</h3>
                <p className="text-sm text-gray-500">Detailed insights and recommendations</p>
              </div>
            </div>
            <button 
              onClick={() => window.print()} 
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Print Analysis"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none text-gray-600 
              prose-headings:font-semibold 
              prose-h1:text-xl prose-h1:text-blue-600 prose-h1:mb-4
              prose-h2:text-lg prose-h2:text-gray-700 prose-h2:mt-6 prose-h2:mb-3
              prose-p:text-gray-600 prose-p:my-2
              prose-strong:text-gray-700 prose-strong:font-medium
              prose-ul:pl-4 prose-ul:my-2
              prose-ol:pl-4 prose-ol:my-2
              prose-li:my-1.5 prose-li:leading-relaxed">
            {!summary ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No summary available</p>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  h1: ({node, children, ...props}) => (
                    <h1 className="text-xl text-blue-600 font-semibold mb-4 flex items-center gap-2" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({node, children, ...props}) => (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h2 className="text-lg text-gray-700 font-semibold flex items-center gap-2" {...props}>
                        {children}
                      </h2>
                    </div>
                  ),
                  p: ({node, children, ...props}) => (
                    <p className="text-gray-600 my-3 leading-relaxed" {...props}>
                      {children}
                    </p>
                  ),
                  ul: ({node, children, ...props}) => (
                    <ul className="list-disc space-y-2 my-4" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({node, children, ...props}) => (
                    <ol className="list-decimal space-y-2 my-4" {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({node, children, ...props}) => (
                    <li className="ml-4" {...props}>
                      {children}
                    </li>
                  ),
                  blockquote: ({node, children, ...props}) => (
                    <blockquote className="border-l-4 border-blue-200 pl-4 my-4 bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-r" {...props}>
                      {children}
                    </blockquote>
                  ),
                  strong: ({node, children, ...props}) => (
                    <strong className="font-semibold text-blue-700" {...props}>
                      {children}
                    </strong>
                  ),
                  code: ({node, inline, children, ...props}) => (
                    inline ? 
                      <code className="bg-gray-50 rounded px-1.5 py-0.5 text-blue-600" {...props}>
                        {children}
                      </code> :
                      <pre className="bg-gray-50 rounded-lg p-4 my-4 overflow-x-auto">
                        <code className="text-blue-600" {...props}>
                          {children}
                        </code>
                      </pre>
                  )
                }}
              >
                {summary}
              </ReactMarkdown>
            )}
          </div>
        </div>

        {/* Negative Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            Customer Feedback
          </h3>
          {negativeReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No negative reviews available</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {negativeReviews.map((review, index) => (
                <div
                  key={index}
                  className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-gray-700"
                >
                  <p className="leading-relaxed">{review}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;