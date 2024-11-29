import React, { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { ContractTemplate } from '../components/ContractTemplate';
import { numberToWords } from '../utils/numberToWords';

const mockClient = {
  clientNumber: "2024-001",
  lastName: "Иванов",
  firstName: "Иван",
  middleName: "Иванович",
  objectName: "Жилой дом",
  constructionAddress: "г. Алматы, мкр. Алатау, ул. Жетысу, уч. 123",
  totalAmount: 10500000,
  totalAmountWords: numberToWords(10500000),
  iin: "123456789012",
  livingAddress: "г. Алматы, ул. Абая, д. 1, кв. 1",
  phone: "+7 747 743 4343",
  email: "HotWell.KZ@gmail.com",
  constructionDays: 45,
  deposit: 75000,
  depositWords: numberToWords(75000),
  firstPayment: 4170000,
  firstPaymentWords: numberToWords(4170000),
  secondPayment: 4170000,
  secondPaymentWords: numberToWords(4170000),
  thirdPayment: 1981500,
  thirdPaymentWords: numberToWords(1981500),
  fourthPayment: 103500,
  fourthPaymentWords: numberToWords(103500)
};

interface ContractType {
  id: string;
  title: string;
  description: string;
  lastModified: string;
}

export const ContractTemplates: React.FC = () => {
  const [showTemplate, setShowTemplate] = useState(false);

  const contractTemplates: ContractType[] = [
    {
      id: '1',
      title: 'Договор подряда на строительство дома',
      description: 'Стандартный договор для строительства частного дома',
      lastModified: '10.03.2024'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Шаблоны договоров</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid gap-4">
          {contractTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setShowTemplate(true)}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-4 sm:p-6 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {template.description}
                  </p>
                  <p className="text-sm text-gray-400">
                    Последнее изменение: {template.lastModified}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Шаблон договора */}
      {showTemplate && (
        <ContractTemplate
          client={mockClient}
          isOpen={showTemplate}
          onClose={() => setShowTemplate(false)}
        />
      )}
    </div>
  );
};