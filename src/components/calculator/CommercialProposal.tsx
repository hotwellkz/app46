import React from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { CalculatorState, CostBreakdown } from '../../types/calculator';
import { generatePDF } from '../../utils/pdfUtils';
import { shareContent } from '../../utils/shareUtils';

interface CommercialProposalProps {
  formData: CalculatorState;
  pricePerSqm: number;
  totalPrice: number;
  costBreakdown: CostBreakdown;
  onClose: () => void;
}

export const CommercialProposal: React.FC<CommercialProposalProps> = ({
  formData,
  pricePerSqm,
  totalPrice,
  costBreakdown,
  onClose
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₸';
  };

  const handleShare = async () => {
    const content = `
Коммерческое предложение от HotWell.KZ

Параметры дома:
- Площадь: ${formData.area} м²
- Этажность: ${formData.floors}
- Высота 1-го этажа: ${formData.firstFloorHeight}
${formData.floors === '2 этажа' ? `- Высота 2-го этажа: ${formData.secondFloorHeight}\n` : ''}
- Тип крыши: ${formData.roofType}
- Форма дома: ${formData.houseShape}

Стоимость:
- За м²: ${formatPrice(pricePerSqm)}
- Общая: ${formatPrice(totalPrice)}

Расшифровка стоимости:
- Фундамент: ${formatPrice(costBreakdown.foundation)}
- Домокомплект: ${formatPrice(costBreakdown.houseKit)}
- Монтаж: ${formatPrice(costBreakdown.assembly)}

ТОО "HotWell.KZ"
Тел: +7 747 743 4343
WhatsApp: +7 747 743 4343
Email: HotWell.KZ@gmail.com
    `;

    await shareContent('Коммерческое предложение HotWell.KZ', content);
  };

  const handleDownload = async () => {
    await generatePDF('commercial-proposal-content', 'Коммерческое_предложение.pdf');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl mx-4" style={{ maxHeight: '90vh' }}>
        {/* Шапка */}
        <div className="sticky top-0 bg-white rounded-t-lg border-b border-gray-200 z-10">
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold">Коммерческое предложение</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                title="Поделиться"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                title="Скачать PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                title="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Содержимое */}
        <div id="commercial-proposal-content" className="overflow-auto p-8 space-y-8">
          {/* Логотип и контакты */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HotWell.KZ</h1>
            <p className="text-gray-600">Строительство домов из СИП-панелей</p>
          </div>

          {/* Параметры дома */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Параметры дома</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Площадь:</span>
                <span className="ml-2 font-medium">{formData.area} м²</span>
              </div>
              <div>
                <span className="text-gray-600">Этажность:</span>
                <span className="ml-2 font-medium">{formData.floors}</span>
              </div>
              <div>
                <span className="text-gray-600">Высота 1-го этажа:</span>
                <span className="ml-2 font-medium">{formData.firstFloorHeight}</span>
              </div>
              {formData.floors === '2 этажа' && (
                <div>
                  <span className="text-gray-600">Высота 2-го этажа:</span>
                  <span className="ml-2 font-medium">{formData.secondFloorHeight}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Тип крыши:</span>
                <span className="ml-2 font-medium">{formData.roofType}</span>
              </div>
              <div>
                <span className="text-gray-600">Форма дома:</span>
                <span className="ml-2 font-medium">{formData.houseShape}</span>
              </div>
            </div>
          </div>

          {/* Стоимость */}
          <div className="bg-emerald-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Стоимость</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-emerald-800">Стоимость за м²:</span>
                <p className="text-2xl font-bold text-emerald-900">{formatPrice(pricePerSqm)}</p>
              </div>
              <div>
                <span className="text-emerald-800">Общая стоимость:</span>
                <p className="text-2xl font-bold text-emerald-900">{formatPrice(totalPrice)}</p>
              </div>
            </div>
          </div>

          {/* Расшифровка стоимости */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Расшифровка стоимости</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Фундамент</span>
                <span className="font-medium">{formatPrice(costBreakdown.foundation)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Домокомплект</span>
                <span className="font-medium">{formatPrice(costBreakdown.houseKit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Монтаж</span>
                <span className="font-medium">{formatPrice(costBreakdown.assembly)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Итого</span>
                  <span className="font-bold text-emerald-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="text-center text-gray-600">
            <p>ТОО "HotWell.KZ"</p>
            <p>Тел: +7 747 743 4343</p>
            <p>WhatsApp: +7 747 743 4343</p>
            <p>Email: HotWell.KZ@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};