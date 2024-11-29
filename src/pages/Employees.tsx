import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Employee, EmployeeFormData } from '../types/employee';
import { EmployeeList } from '../components/employees/EmployeeList';
import { EmployeeForm } from '../components/employees/EmployeeForm';
import { DeleteEmployeeModal } from '../components/employees/DeleteEmployeeModal';
import { TransactionHistory } from '../components/transactions/TransactionHistory';
import { EmployeeContract } from '../components/employees/EmployeeContract';
import { CategoryCardType } from '../types';
import { createEmployee, updateEmployee, deleteEmployeeWithHistory, deleteEmployeeOnly } from '../services/employeeService';
import { showErrorNotification } from '../utils/notifications';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import { useEmployeeStats } from '../hooks/useEmployeeStats';
import { EmployeeSearchBar } from '../components/employees/EmployeeSearchBar';
import { EmployeeStatusFilter } from '../components/employees/EmployeeStatusFilter';
import { EmployeeStats } from '../components/employees/EmployeeStats';
import { useEmployeeHistory } from '../hooks/useEmployeeHistory';

export const Employees: React.FC = () => {
  const { employees, loading } = useEmployees();
  const { 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter, 
    filteredEmployees 
  } = useEmployeeFilters(employees);
  
  const stats = useEmployeeStats(employees);
  
  const { 
    selectedCategory,
    showHistory,
    handleViewHistory,
    handleCloseHistory 
  } = useEmployeeHistory();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = async (formData: EmployeeFormData) => {
    try {
      await createEmployee(formData);
      setShowAddForm(false);
    } catch (error) {
      showErrorNotification(error instanceof Error ? error.message : 'Произошла ошибка при сохранении');
    }
  };

  const handleUpdate = async (formData: EmployeeFormData) => {
    if (!selectedEmployee) return;

    try {
      await updateEmployee(selectedEmployee.id, formData);
      setShowEditForm(false);
      setSelectedEmployee(null);
    } catch (error) {
      showErrorNotification(error instanceof Error ? error.message : 'Произошла ошибка при обновлении');
    }
  };

  const handleDeleteWithHistory = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteEmployeeWithHistory(selectedEmployee);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      showErrorNotification(error instanceof Error ? error.message : 'Произошла ошибка при удалении');
    }
  };

  const handleDeleteIconOnly = async () => {
    if (!selectedEmployee) return;

    try {
      await deleteEmployeeOnly(selectedEmployee);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      showErrorNotification(error instanceof Error ? error.message : 'Произошла ошибка при удалении');
    }
  };

  const handleViewContract = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowContract(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Сотрудники</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-5 h-5 mr-1" />
              Добавить сотрудника
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmployeeStats {...stats} />
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <EmployeeSearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <EmployeeStatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <EmployeeList
            employees={filteredEmployees}
            onEdit={(employee) => {
              setSelectedEmployee(employee);
              setShowEditForm(true);
            }}
            onDelete={(employee) => {
              setSelectedEmployee(employee);
              setShowDeleteModal(true);
            }}
            onViewHistory={handleViewHistory}
            onViewContract={handleViewContract}
          />
        )}
      </div>

      <EmployeeForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleSave}
      />

      {selectedEmployee && (
        <>
          <EmployeeForm
            isOpen={showEditForm}
            onClose={() => {
              setShowEditForm(false);
              setSelectedEmployee(null);
            }}
            onSave={handleUpdate}
            employee={selectedEmployee}
          />

          <DeleteEmployeeModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedEmployee(null);
            }}
            onDeleteWithHistory={handleDeleteWithHistory}
            onDeleteIconOnly={handleDeleteIconOnly}
            employeeName={`${selectedEmployee.lastName} ${selectedEmployee.firstName}`}
          />

          <EmployeeContract
            isOpen={showContract}
            onClose={() => {
              setShowContract(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
          />
        </>
      )}

      {showHistory && selectedCategory && (
        <TransactionHistory
          category={selectedCategory}
          isOpen={showHistory}
          onClose={handleCloseHistory}
        />
      )}
    </div>
  );
};