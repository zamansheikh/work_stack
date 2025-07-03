'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FeatureCard from '@/components/FeatureCard';
import { useFeatures } from '@/lib/hooks';
import { Search, Grid, List, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounce search query to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use real API data
  const {
    features,
    isLoading,
    error,
    refetch,
    clearError
  } = useFeatures({
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
  });

  const stats = useMemo(() => {
    const total = features.length;
    const completed = features.filter(f => f.status === 'completed').length;
    const inProgress = features.filter(f => f.status === 'in-progress').length;
    const planned = features.filter(f => f.status === 'planned').length;

    return { total, completed, inProgress, planned };
  }, [features]);

  const handleRetry = () => {
    clearError();
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#8BC342] to-[#6fa332] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              BowlersNetwork
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Feature Development Tracker
            </p>
            <p className="text-lg max-w-3xl mx-auto text-green-100">
              Track our progress building the ultimate bowling ecosystem. See why we&apos;re implementing each feature,
              how we&apos;re building it, and the value it brings to bowlers, centers, and manufacturers.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 hover:bg-white/25 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{stats.total}</div>
              <div className="text-white/90 font-medium text-sm md:text-base mt-1">Total Features</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 hover:bg-white/25 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-emerald-200 drop-shadow-lg">{stats.completed}</div>
              <div className="text-white/90 font-medium text-sm md:text-base mt-1">Completed</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 hover:bg-white/25 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-amber-200 drop-shadow-lg">{stats.inProgress}</div>
              <div className="text-white/90 font-medium text-sm md:text-base mt-1">In Progress</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 hover:bg-white/25 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-blue-200 drop-shadow-lg">{stats.planned}</div>
              <div className="text-white/90 font-medium text-sm md:text-base mt-1">Planned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search features, descriptions, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent"
                disabled={isLoading}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
                <option value="on-hold">On Hold</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC342] focus:border-transparent"
                disabled={isLoading}
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-[#8BC342] text-white' : 'bg-white text-gray-600'}`}
                  disabled={isLoading}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-[#8BC342] text-white' : 'bg-white text-gray-600'}`}
                  disabled={isLoading}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-800">
                  Failed to load features
                </h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="ml-4 inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC342]"></div>
            <span className="ml-3 text-lg text-gray-600">Loading features...</span>
          </div>
        ) : (
          <>
            {/* Results */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Features ({features.length})
              </h2>
              <p className="text-gray-600">
                Discover how we&apos;re building the future of bowling technology
              </p>
            </div>

            {/* Feature Grid */}
            {features.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {features.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    className={viewMode === 'list' ? 'col-span-full' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No features found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters.'
                    : 'No features have been added yet.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
