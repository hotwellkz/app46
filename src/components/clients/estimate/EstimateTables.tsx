import React from 'react';
import { EstimateTable } from './EstimateTable';
import { EstimateValues } from '../../../types/estimate';
import { useEstimateTotals } from '../../../hooks/useEstimateTotals';

interface EstimateTablesProps {
  foundationValues: EstimateValues;
  lumberValues: EstimateValues;
  roofValues: EstimateValues;
  onFoundationChange: (key: keyof EstimateValues) => (value: number) => void;
  onFoundationCheckChange: (key: keyof EstimateValues) => (checked: boolean) => void;
  onLumberChange: (key: keyof EstimateValues) => (value: number) => void;
  onLumberCheckChange: (key: keyof EstimateValues) => (checked: boolean) => void;
  onRoofChange: (key: keyof EstimateValues) => (value: number) => void;
  onRoofCheckChange: (key: keyof EstimateValues) => (checked: boolean) => void;
  isEditing: boolean;
  clientId: string;
  projectNumber: string; // Добавляем площадь дома как параметр
}

export const EstimateTables: React.FC<EstimateTablesProps> = ({
  foundationValues,
  lumberValues,
  roofValues,
  onFoundationChange,
  onFoundationCheckChange,
  onLumberChange,
  onLumberCheckChange,
  onRoofChange,
  onRoofCheckChange,
  isEditing,
  clientId,
  projectNumber
}) => {
  const { grandTotal } = useEstimateTotals(clientId);
  const netIncome = roofValues.contractPrice.value - grandTotal;

  // Расчет ЗП строителей по формуле: (площадь дома * 15) * 500
  const houseArea = parseFloat(projectNumber) || 0;
  const builderSalary = (houseArea * 15) * 500;

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('ru-RU') + ' тг';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <EstimateTable
          title="Фундамент"
          rows={[
            { label: 'Периметр фундам', value: foundationValues.perimeter.value, isChecked: foundationValues.perimeter.isChecked, onChange: onFoundationChange('perimeter'), onCheckChange: onFoundationCheckChange('perimeter') },
            { label: 'Кол-во свай', value: foundationValues.pilesCount.value, isChecked: foundationValues.pilesCount.isChecked, onChange: onFoundationChange('pilesCount'), onCheckChange: onFoundationCheckChange('pilesCount') },
            { label: 'м2 засыпки', value: foundationValues.backfillArea.value, isChecked: foundationValues.backfillArea.isChecked, onChange: onFoundationChange('backfillArea'), onCheckChange: onFoundationCheckChange('backfillArea') },
            { label: 'Труба 80x80 в метр', value: foundationValues.pipeLength.value, isChecked: foundationValues.pipeLength.isChecked, onChange: onFoundationChange('pipeLength'), onCheckChange: onFoundationCheckChange('pipeLength') },
            { label: 'СИП стены', value: '', isHeader: true },
            { label: 'общая м2 СИП 2,5м', value: foundationValues.sip25Area.value, isChecked: foundationValues.sip25Area.isChecked, onChange: onFoundationChange('sip25Area'), onCheckChange: onFoundationCheckChange('sip25Area') },
            { label: 'общая м2 СИП 2,8м', value: foundationValues.sip28Area.value, isChecked: foundationValues.sip28Area.isChecked, onChange: onFoundationChange('sip28Area'), onCheckChange: onFoundationCheckChange('sip28Area') },
            { label: 'ГКЛ перегородки', value: '', isHeader: true },
            { label: 'м2 межк стен', value: lumberValues.gklWallsArea.value, isChecked: lumberValues.gklWallsArea.isChecked, onChange: onLumberChange('gklWallsArea'), onCheckChange: onLumberCheckChange('gklWallsArea') },
            { label: 'Длина межк стен', value: lumberValues.gklWallsLength.value, isChecked: lumberValues.gklWallsLength.isChecked, onChange: onLumberChange('gklWallsLength'), onCheckChange: onLumberCheckChange('gklWallsLength') },
            { label: 'С/У 1эт длина вн стен', value: lumberValues.firstFloorWallsLength.value, isChecked: lumberValues.firstFloorWallsLength.isChecked, onChange: onLumberChange('firstFloorWallsLength'), onCheckChange: onLumberCheckChange('firstFloorWallsLength') },
            { label: 'С/У 2эт длина вн стен', value: lumberValues.secondFloorWallsLength.value, isChecked: lumberValues.secondFloorWallsLength.isChecked, onChange: onLumberChange('secondFloorWallsLength'), onCheckChange: onLumberCheckChange('secondFloorWallsLength') },
            { label: 'Профиль для перег', value: lumberValues.partitionProfile.value, isChecked: lumberValues.partitionProfile.isChecked, onChange: onLumberChange('partitionProfile'), onCheckChange: onLumberCheckChange('partitionProfile') }
          ]}
          isEditing={isEditing}
        />

        <EstimateTable
          title="Пиломатериал"
          rows={[
            { label: '40x14 стены в метрах', value: lumberValues.walls40x14.value, isChecked: lumberValues.walls40x14.isChecked, unit: 'м.', onChange: onLumberChange('walls40x14'), onCheckChange: onLumberCheckChange('walls40x14') },
            { label: '40x14 Крыша в метрах', value: lumberValues.roof40x14.value, isChecked: lumberValues.roof40x14.isChecked, unit: 'м.', onChange: onLumberChange('roof40x14'), onCheckChange: onLumberCheckChange('roof40x14') },
            { label: '40x14 Черд перекр в метрах', value: lumberValues.attic40x14.value, isChecked: lumberValues.attic40x14.isChecked, unit: 'м.', onChange: onLumberChange('attic40x14'), onCheckChange: onLumberCheckChange('attic40x14') },
            { label: '40x19 перекрытие в метрах', value: lumberValues.floor40x19.value, isChecked: lumberValues.floor40x19.isChecked, unit: 'м.', onChange: onLumberChange('floor40x19'), onCheckChange: onLumberCheckChange('floor40x19') },
            { label: '40x19 ригель в метрах', value: lumberValues.beam40x19.value, isChecked: lumberValues.beam40x19.isChecked, unit: 'м.', onChange: onLumberChange('beam40x19'), onCheckChange: onLumberCheckChange('beam40x19') },
            { label: '20x9 обрешетка в метрах', value: lumberValues.lathing20x9.value, isChecked: lumberValues.lathing20x9.isChecked, unit: 'м.', onChange: onLumberChange('lathing20x9'), onCheckChange: onLumberCheckChange('lathing20x9') },
            { label: 'Перекр + Потолок + Франтон', value: '', isHeader: true },
            { label: 'м2 межэтажн перекрытия', value: lumberValues.floorArea.value, isChecked: lumberValues.floorArea.isChecked, onChange: onLumberChange('floorArea'), onCheckChange: onLumberCheckChange('floorArea') },
            { label: 'м2 чердачного перекрытия', value: lumberValues.atticArea.value, isChecked: lumberValues.atticArea.isChecked, onChange: onLumberChange('atticArea'), onCheckChange: onLumberCheckChange('atticArea') },
            { label: 'м2 франтона', value: lumberValues.frontonArea.value, isChecked: lumberValues.frontonArea.isChecked, onChange: onLumberChange('frontonArea'), onCheckChange: onLumberCheckChange('frontonArea') },
            { label: 'Разное', value: '', isHeader: true },
            { label: 'ЗП строителям', value: builderSalary, isChecked: roofValues.builderSalary.isChecked, onChange: onRoofChange('builderSalary'), onCheckChange: onRoofCheckChange('builderSalary') },
            { label: 'Цена по договору', value: roofValues.contractPrice.value, isChecked: roofValues.contractPrice.isChecked, onChange: onRoofChange('contractPrice'), onCheckChange: onRoofCheckChange('contractPrice') }
          ]}
          isEditing={isEditing}
        />

        <EstimateTable
          title="Крыша"
          rows={[
            { label: 'Мет. Череп м2', value: roofValues.metalTileArea.value, isChecked: roofValues.metalTileArea.isChecked, onChange: onRoofChange('metalTileArea'), onCheckChange: onRoofCheckChange('metalTileArea') },
            { label: 'Длина коньков', value: roofValues.ridgeLength.value, isChecked: roofValues.ridgeLength.isChecked, unit: 'м.', onChange: onRoofChange('ridgeLength'), onCheckChange: onRoofCheckChange('ridgeLength') },
            { label: 'Длина вн ендов', value: roofValues.endowLength.value, isChecked: roofValues.endowLength.isChecked, unit: 'м.', onChange: onRoofChange('endowLength'), onCheckChange: onRoofCheckChange('endowLength') },
            { label: 'Заглушка конусная', value: roofValues.conicPlug.value, isChecked: roofValues.conicPlug.isChecked, onChange: onRoofChange('conicPlug'), onCheckChange: onRoofCheckChange('conicPlug') },
            { label: 'Тройник', value: roofValues.tee.value, isChecked: roofValues.tee.isChecked, onChange: onRoofChange('tee'), onCheckChange: onRoofCheckChange('tee') },
            { label: 'Планка примык к стене', value: roofValues.wallPlank.value, isChecked: roofValues.wallPlank.isChecked, onChange: onRoofChange('wallPlank'), onCheckChange: onRoofCheckChange('wallPlank') },
            { label: 'Паропленка под обреш', value: roofValues.vaporBarrier.value, isChecked: roofValues.vaporBarrier.isChecked, onChange: onRoofChange('vaporBarrier'), onCheckChange: onRoofCheckChange('vaporBarrier') },
            { label: 'Паропленка пот 2 эт.', value: roofValues.steamBarrier2.value, isChecked: roofValues.steamBarrier2.isChecked, onChange: onRoofChange('steamBarrier2'), onCheckChange: onRoofCheckChange('steamBarrier2') },
            { label: 'Конек бочкообразный', value: roofValues.barrelRidge.value, isChecked: roofValues.barrelRidge.isChecked, unit: 'м.', onChange: onRoofChange('barrelRidge'), onCheckChange: onRoofCheckChange('barrelRidge') },
            { label: 'Ендова Внешняя', value: roofValues.externalEndow.value, isChecked: roofValues.externalEndow.isChecked, onChange: onRoofChange('externalEndow'), onCheckChange: onRoofCheckChange('externalEndow') },
            { label: 'Ендова Внутренняя', value: roofValues.internalEndow.value, isChecked: roofValues.internalEndow.isChecked, onChange: onRoofChange('internalEndow'), onCheckChange: onRoofCheckChange('internalEndow') }
          ]}
          isEditing={isEditing}
        />
      </div>

      <div className="space-y-2">
        <div className="bg-blue-100 p-3 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-800">ИТОГО ОБЩАЯ:</span>
            <span className="font-bold text-blue-800">{formatAmount(grandTotal)}</span>
          </div>
        </div>

        <div className={`${netIncome < 0 ? 'bg-red-100' : 'bg-green-100'} p-3 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <span className={`font-bold ${netIncome < 0 ? 'text-red-800' : 'text-green-800'}`}>Чистый доход:</span>
            <span className={`font-bold ${netIncome < 0 ? 'text-red-800' : 'text-green-800'}`}>{formatAmount(netIncome)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};