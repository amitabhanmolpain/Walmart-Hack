import React, { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Wallet2 } from 'lucide-react-native';
import type { FC } from 'react';
import { useApp } from '@/contexts/AppContext';
import { products } from '@/constants/data';
import { useEffect, useState } from 'react';
// Add this import at the top of the file
import { getExpiryDate } from '@/app/product/[id]';

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
  const [expiringItems, setExpiringItems] = useState<{id: string, name: string, expiryDate: Date}[]>([]);
  
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('profitData') || '[]');
      setProfitData(data);
    } catch {
      setProfitData([]);
    }
    
    // Check for expiring items
    checkExpiringItems();
  }, []);
  
  const checkExpiringItems = () => {
    const today = new Date();
    const expiringProducts: {id: string, name: string, expiryDate: Date}[] = [];
    
    // Check all products for expiry dates
    products.forEach(product => {
      const expiryDateStr = getExpiryDate(product.name, product.category);
      const expiryDate = new Date(expiryDateStr);
      
      // Calculate days until expiry
      const timeDiff = expiryDate.getTime() - today.getTime();
      const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // If product expires in 15 days or less, add to expiring items
      if (daysUntilExpiry <= 15 && daysUntilExpiry > 0) {
        expiringProducts.push({
          id: product.id,
          name: product.name,
          expiryDate: expiryDate
        });
      }
    });
    
    setExpiringItems(expiringProducts);
  };
  
  const realProfit = profitData.reduce((sum, p) => sum + p.profit, 0);
  const emiThisMonth = profitData.filter(p => p.emi > 0 && new Date(p.date).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.emi, 0);
  const profitDataChart = [0, realProfit * 0.2, realProfit * 0.4, realProfit * 0.6, realProfit * 0.8, realProfit];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1565C0', '#2196F3']} style={styles.header}>
        <Text style={styles.headerTitle}>Profits</Text>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Expiring Items Alert */}
        {expiringItems.length > 0 && (
          <View style={styles.expiringItemsAlert}>
            <Text style={styles.expiringItemsTitle}>⚠️ Items Expiring Soon</Text>
            {expiringItems.map(item => (
              <Text key={item.id} style={styles.expiringItemText}>
                {item.name} - Expires on {item.expiryDate.toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}
              </Text>
            ))}
            <Text style={styles.expiringItemsMessage}>
              Consider promoting these items to sell before they expire!
            </Text>
          </View>
        )}
        
        <View style={styles.profitCard}>
          <TrendingUp size={36} color="#2196F3" />
          <Text style={styles.profitLabel}>Total Profit</Text>
          <Text style={styles.profitValue}>₹{realProfit.toLocaleString()}</Text>
        </View>
        {emiThisMonth > 0 && (
          <View style={styles.emiCard}>
            <Wallet2 size={28} color="#FBC02D" />
            <Text style={styles.emiLabel}>EMI Earnings This Month</Text>
            <Text style={styles.emiValue}>₹{emiThisMonth.toLocaleString()}</Text>
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

// Add new styles
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
  expiringItemsAlert: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  expiringItemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },
  expiringItemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  expiringItemsMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#D32F2F',
    marginTop: 8,
  },
  emiCard: {
    backgroundColor: '#FFFDE7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    flexDirection: 'column',
  },
  emiLabel: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  emiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FBC02D',
  },
});