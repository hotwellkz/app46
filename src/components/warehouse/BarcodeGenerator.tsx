import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';

interface BarcodeGeneratorProps {
  value: string;
  type: 'barcode' | 'qrcode';
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ value, type }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (type === 'barcode' && barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        margin: 10
      });
    }
  }, [value, type]);

  if (type === 'qrcode') {
    return (
      <QRCodeSVG
        value={value}
        size={128}
        level="H"
        includeMargin
        className="mx-auto"
      />
    );
  }

  return <svg ref={barcodeRef} className="mx-auto"></svg>;
};