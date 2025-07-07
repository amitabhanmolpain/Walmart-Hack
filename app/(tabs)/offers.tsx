import React, { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Wallet2 } from 'lucide-react-native';
import type { FC } from 'react';
import { useApp } from '@/contexts/AppContext';
import { products } from '@/constants/data';
import { useEffect, useState } from 'react';

let ProfitChart: FC<any> | null = null;
let hasChart = false;
try {
  // @ts-ignore
  const Chart = require('react-native-svg-charts').LineChart;
  if (Chart) {
    ProfitChart = Chart;
    hasChart = true;
  }
} catch {}

const ProfitChartPlaceholder = () => (
  <View style={{ height: 180, backgroundColor: '#e3e3e3', borderRadius: 16, marginVertical: 16, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: '#888' }}>Profit Graph Placeholder</Text>
  </View>
);

export default function ProfitsScreen() {
  // Read profit and EMI data from localStorage
  const [profitData, setProfitData] = useState<{profit: number, emi: number, date: string}[]>([]);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('profitData') || '[]');
      setProfitData(data);
    } catch {
      setProfitData([]);
    }
  }, []);
  const realProfit = profitData.reduce((sum, p) => sum + p.profit, 0);
  const emiThisMonth = profitData.filter(p => p.emi > 0 && new Date(p.date).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.emi, 0);
  const profitDataChart = [0, realProfit * 0.2, realProfit * 0.4, realProfit * 0.6, realProfit * 0.8, realProfit];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1565C0', '#2196F3']} style={styles.header}>
        <Text style={styles.headerTitle}>Profits</Text>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profitCard}>
          <TrendingUp size={36} color="#2196F3" />
          <Text style={styles.profitLabel}>Total Profit</Text>
          <Text style={styles.profitValue}>₹{realProfit.toLocaleString()}</Text>
        </View>
        {emiThisMonth > 0 && (
          <View style={{ backgroundColor: '#FFFDE7', borderRadius: 12, padding: 16, marginBottom: 18, alignItems: 'center' }}>
            <Text style={{ color: '#FBC02D', fontWeight: 'bold', fontSize: 18 }}>₹{emiThisMonth} EMI this month</Text>
          </View>
        )}
        <View style={styles.graphSection}>
          <Text style={styles.graphLabel}>Profit Over Time</Text>
          {/* Chart or placeholder */}
          {hasChart && ProfitChart ? (
            <ProfitChart
              style={{ height: 180, borderRadius: 16 }}
              data={profitDataChart}
              svg={{ stroke: '#1565C0', strokeWidth: 3 }}
              contentInset={{ top: 20, bottom: 20 }}
            />
          ) : (
            <ProfitChartPlaceholder />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1565C0',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profitCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profitLabel: {
    fontSize: 16,
    color: '#1565C0',
    marginTop: 8,
    fontWeight: '600',
  },
  profitValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 4,
  },
  graphSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  graphLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
});