import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useEstimateTotals = (clientId: string) => {
  const [totals, setTotals] = useState({
    additionalWorks: 0,
    consumables: 0,
    partitions: 0,
    roof: 0,
    floor: 0,
    sipWalls: 0,
    foundation: 0
  });

  useEffect(() => {
    // Subscribe to Additional Works Estimate
    const additionalWorksUnsubscribe = onSnapshot(
      doc(db, 'additionalWorksEstimates', clientId),
      (doc) => {
        if (doc.exists()) {
          setTotals(prev => ({
            ...prev,
            additionalWorks: doc.data().totalCost || 0
          }));
        }
      }
    );

    // Subscribe to Consumables Estimate
    const consumablesUnsubscribe = onSnapshot(
      doc(db, 'consumablesEstimates', clientId),
      (doc) => {
        if (doc.exists()) {
          setTotals(prev => ({
            ...prev,
            consumables: doc.data().totalMaterialsCost || 0
          }));
        }
      }
    );

    // Subscribe to Partitions Estimate
    const partitionsUnsubscribe = onSnapshot(
      doc(db, 'partitionEstimates', clientId),
      (doc) => {
        if (doc.exists()) {
          setTotals(prev => ({
            ...prev,
            partitions: doc.data().totalCost || 0
          }));
        }
      }
    );

    // Subscribe to Roof Estimate
    const roofUnsubscribe = onSnapshot(
      doc(db, 'roofEstimates', clientId),
      (doc) => {
        if (doc.exists()) {
          setTotals(prev => ({
            ...prev,
            roof: doc.data().totalCost || 0
          }));
        }
      }
    );

    // Subscribe to Floor Estimate
    const floorUnsubscribe = onSnapshot(
      doc(db, 'floorEstimates', clientId),
      (doc) => {
        if (doc.exists()) {
          setTotals(prev => ({
            ...prev,
            floor: doc.data().totalCost || 0
          }));
        }
      }
    );

    // Subscribe to SIP Walls Estimate
    const sipWallsUnsubscribe = onSnapshot(
      doc(db, 'sipWallsEstimates', clientId),
      (doc) => {
        if (doc.exists()) {
          setTotals(prev => ({
            ...prev,
            sipWalls: doc.data().totalCost || 0
          }));
        }
      }
    );

    // Subscribe to Foundation Estimate
    const foundationUnsubscribe = onSnapshot(
      doc(db, 'foundationEstimates', clientId),
      (doc) => {
        if (doc.exists()) {
          setTotals(prev => ({
            ...prev,
            foundation: doc.data().totalCost || 0
          }));
        }
      }
    );

    // Cleanup subscriptions
    return () => {
      additionalWorksUnsubscribe();
      consumablesUnsubscribe();
      partitionsUnsubscribe();
      roofUnsubscribe();
      floorUnsubscribe();
      sipWallsUnsubscribe();
      foundationUnsubscribe();
    };
  }, [clientId]);

  const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);

  return { totals, grandTotal };
};