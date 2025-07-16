import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import {fetchBonusRank} from '../api/bonusscore';

const RankScreen = () => {
  const [rank, setRank] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRank = async () => {
      setLoading(true);
      try {
        const data = await fetchBonusRank();
        setRank(data);
      } catch (err) {
        console.error('🛑 랭크 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRank();
  }, []);

  if (loading)
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );

  return (
    <View>
      <Text>RANK</Text>
      {rank.map(r => (
        <View key={r._id}>
          <Text>{r.rank}</Text>
          <Text>{r.user.id}</Text>
          <Text>{r.totalBonus}</Text>
        </View>
      ))}
    </View>
  );
};

export default RankScreen;
