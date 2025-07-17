"use client";

import { useAuth } from "@/lib/auth-context";
import { useFeatures, useFeatureMutations } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Feature } from "@/types";
import {
  Plus,
  Search,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  LogOut,
  Edit,
  Trash2,
  Home,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    features,
    pagination,
    isLoading: featuresLoading,
    error,
    refetch,
  } = useFeatures({
    search: debouncedSearch || undefined,
    limit: 20,
    page,
  });
  const { deleteFeature, isLoading: isDeleting } = useFeatureMutations();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle features accumulation for pagination
  useEffect(() => {
    if (page === 1) {
      // First page or filters changed - replace all features
      setAllFeatures(features);
    } else {
      // Subsequent pages - append to existing features
      // Filter out any duplicates by ID that might already exist in the previous pages
      setAllFeatures(prev => {
        const existingIds = new Set(prev.map(f => f.id));
        const newUniqueFeatures = features.filter(f => !existingIds.has(f.id));
        return [...prev, ...newUniqueFeatures];
      });
    }
    setIsLoadingMore(false);
  }, [features, page]);

  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
    setAllFeatures([]);
  }, [debouncedSearch]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BC342]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredFeatures = allFeatures.filter(
    (feature) =>
      feature.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      feature.description.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const stats = {
    total: pagination?.totalFeatures || allFeatures.length,
    completed: pagination?.totalCompleted || allFeatures.filter((f) => f.status === "completed").length,
    inProgress: pagination?.totalInProgress || allFeatures.filter((f) => f.status === "in-progress").length,
    planned: pagination?.totalPlanned || allFeatures.filter((f) => f.status === "planned").length,
  };

  const handleShowMore = () => {
    setIsLoadingMore(true);
    setPage(prev => prev + 1);
  };

  const hasNextPage = pagination?.hasNextPage || false;

  const handleDeleteClick = (featureId: string) => {
    setFeatureToDelete(featureId);
  };

  const handleDeleteConfirm = async () => {
    if (!featureToDelete) return;

    try {
      await deleteFeature(featureToDelete);
      setFeatureToDelete(null);
      // Refresh the features list
      refetch();
    } catch (error) {
      console.error("Failed to delete feature:", error);
      // Error handling is already done in the hook
    }
  };

  const handleDeleteCancel = () => {
    setFeatureToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>{" "}
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {user?.name || user?.email}
                {user?.role === "superadmin" && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Super Admin
                  </span>
                )}
              </p>
            </div>{" "}
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Features
              </Link>
              <Link
                href="/admin/change-password"
                className="inline-flex items-center px-4 py-2 border border-[#8BC342] text-sm font-medium rounded-md text-[#8BC342] bg-white hover:bg-green-50 hover:text-[#6fa332] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC342] transition-colors"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Link>
              {user?.role === "superadmin" && (
                <Link
                  href="/admin/users"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#6fa332] to-[#5c8a28] hover:from-[#5c8a28] hover:to-[#4a7320] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6fa332] transition-all"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              )}
              <Link
                href="/admin/features/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-[#8BC342] to-[#6fa332] hover:from-[#6fa332] hover:to-[#5c8a28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC342]"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Feature
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Features
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.completed}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-[#8BC342]" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      In Progress
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.inProgress}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Planned
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.planned}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Manage Features
              </h3>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <div className="flex rounded-md shadow-sm">
                  <div className="relative flex-grow focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search features..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-[#8BC342] focus:ring-[#8BC342] sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {featuresLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BC342]"></div>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Feature
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFeatures.map((feature) => (
                      <tr key={feature.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {feature.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {feature.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              feature.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : feature.status === "in-progress"
                                ? "bg-green-100 text-green-800"
                                : feature.status === "planned"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {feature.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              feature.priority === "critical"
                                ? "bg-red-100 text-red-800"
                                : feature.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : feature.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {feature.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(feature.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/features/${feature.id}/edit`}
                              className="text-[#8BC342] hover:text-[#6fa332]"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>{" "}
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteClick(feature.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Load More Button */}
                {hasNextPage && !debouncedSearch && (
                  <div className="flex justify-center mt-6 px-6 pb-6">
                    <button
                      onClick={handleShowMore}
                      disabled={isLoadingMore}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#8BC342] to-[#6fa332] hover:from-[#6fa332] hover:to-[#5c8a28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BC342] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Loading...
                        </>
                      ) : (
                        'Load More Features'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {featureToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Delete Feature
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this feature? This action
                  cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
