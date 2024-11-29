import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Building2, Plus } from 'lucide-react';
import { ProjectCard } from '../components/projects/ProjectCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Project } from '../types/project';
import { AddProjectModal } from '../components/projects/AddProjectModal';
import { ProjectFilters } from '../components/projects/ProjectFilters';
import { subscribeToProjects } from '../services/projectService';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'deposit' | 'building' | 'built'>('all');
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToProjects(
      (allProjects) => {
        setProjects(allProjects);
        setActiveProjectsCount(allProjects.filter(p => p.status === 'building').length);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      },
      {
        year: selectedYear,
        status: selectedStatus
      }
    );

    return () => unsubscribe();
  }, [selectedYear, selectedStatus]);

  const filteredProjects = projects.filter(project => {
    return project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           project.address.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={() => window.history.back()} className="mr-4">
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">Проекты</h1>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-1" />
                Добавить проект
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="w-6 h-6 text-blue-500 mr-2" />
                  <span className="text-blue-900 font-medium">Активные проекты:</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{activeProjectsCount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Поиск проектов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <ProjectFilters
                selectedYear={selectedYear}
                selectedStatus={selectedStatus}
                onYearChange={setSelectedYear}
                onStatusChange={setSelectedStatus}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Нет проектов</h3>
            <p className="text-gray-500">
              {searchQuery ? 'По вашему запросу ничего не найдено' : 'Добавьте новый проект'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddProjectModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};