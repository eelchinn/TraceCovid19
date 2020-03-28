import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, Alert, Platform, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
//@ts-ignore
import {BluetoothStatus} from 'react-native-bluetooth-status';
import {BLE} from 'ble';
import {useRecentDetectionsStore, addNearbyUser} from 'store';
import {Text, Appbar} from 'react-native-paper';
import {getDistance} from 'utils';
import {IOnScanResult} from 'types';
//@ts-ignore
import {useBluetoothStatus} from 'react-native-bluetooth-status';
import {colors} from 'theme';
import {UserCard} from '../user-card';

const DISTANCE_THRESHOLD = 4;
const insertRecord = (e: IOnScanResult) => {
  console.log('on scan result ', e);
  const distance = getDistance(e.rssi, e.txPower);
  let user = {
    uuid: e.deviceId,
    distance: Number(distance.toPrecision(4)),
  };
  console.log('onScanResult', e, distance);
  if (distance <= DISTANCE_THRESHOLD) {
    addNearbyUser(user);
  }
};

async function enableBluetooth() {
  if (Platform.OS === 'android') {
    Alert.alert(
      'Enable Bluetooth',
      'Click Okay to go to settings',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Okay',
          onPress: () => BluetoothStatus.enable(),
        },
      ],
      {cancelable: true},
    );
  }
}

function Nearby() {
  const detections = useRecentDetectionsStore(state => state.detections);
  const [isScaning, setIsScanning] = useState(false);

  let scanListener = useRef({remove: () => {}});
  let bulkScanListener = useRef({remove: () => {}});
  const [btStatus, isPending] = useBluetoothStatus();

  useEffect(() => {
    scanListener.current = BLE.addListener('onScanResult', insertRecord);

    bulkScanListener.current = BLE.addListener(
      'onScanResultBulk',
      (e: IOnScanResult[]) => {
        e.forEach(insertRecord);
      },
    );

    if (!btStatus && !isPending) {
      enableBluetooth();
    }

    return () => {
      scanListener.current.remove();
      bulkScanListener.current.remove();
    };
  }, [btStatus, isPending]);

  const startEmittingAndReceiving = () => {
    setIsScanning(true);
    BLE.startBroadcast();
    BLE.startScanning();
  };

  const stopEmitting = () => {
    setIsScanning(false);
    BLE.stopBroadcast();
    BLE.stopScanning();
  };

  return (
    <>
      <View style={styles.container}>
        {isScaning ? (
          <Button style={styles.scanButton} onPress={stopEmitting}>
            Stop
          </Button>
        ) : (
          <Button style={styles.scanButton} onPress={startEmittingAndReceiving}>
            Scan
          </Button>
        )}
        <ScrollView style={{width: '100%'}}>
          <View>
            {detections.map(user => {
              return <UserCard item={user} />;
            })}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    borderRadius: 100,
    height: 200,
    width: 200,
    borderWidth: 6,
    elevation: 10,
    borderColor: colors['cool-blue-80'],
    backgroundColor: 'white',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  textStyle: {
    fontSize: 16,
    color: colors['cool-black-100'],
    margin: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {Nearby};
