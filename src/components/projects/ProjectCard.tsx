import React, { useState } from 'react';
import { Building2, Calendar, DollarSign, Clock, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { Project } from '../../types/project';
import { ProjectPhotos } from './ProjectPhotos';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [showPhotos, setShowPhotos] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'building':
        return 'bg-emerald-100 text-emerald-800';
      case 'deposit':
        return 'bg-amber-100 text-amber-800';
      case 'built':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'building':
        return 'Строительство';
      case 'deposit':
        return 'Задаток';
      case 'built':
        return 'Построен';
      default:
        return 'Неизвестно';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('ru-RU') + ' ₸';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {project.clientName}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Прогресс</span>
              <span className="text-sm font-medium text-gray-900">{Math.round(project.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Срок сдачи:</span>
              <span className="ml-auto font-medium text-gray-900">{formatDate(project.deadline)}</span>
            </div>

            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Бюджет:</span>
              <span className="ml-auto font-medium text-gray-900">{formatMoney(project.budget)}</span>
            </div>

            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Дней строительства:</span>
              <span className="ml-auto font-medium text-gray-900">{project.constructionDays}</span>
            </div>

            <button
              onClick={() => setShowPhotos(true)}
              className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Фотографии проекта
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <ProjectPhotos
        isOpen={showPhotos}
        onClose={() => setShowPhotos(false)}
        projectId={project.id}
        photos={project.photos}
      />
    </>
  );
};