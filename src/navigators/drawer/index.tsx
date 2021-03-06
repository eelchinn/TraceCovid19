import React from 'react';
import {StyleSheet, AsyncStorage, Share} from 'react-native';
import {Drawer} from 'react-native-paper';
import {Dimensions} from 'react-native';
import {logout} from 'services';
import {useTranslation} from 'react-i18next';
import {useTranslatedText} from 'components';

const shareAppURL = () => {
  Share.share({
    title: 'eFight',
    message: 'https://play.google.com/store/apps/details?id=com.efight',
  });
};

export function CustomDrawerContent(props: any) {
  const {i18n} = useTranslation();
  const shareThisAppText = useTranslatedText('shareThisApp');

  return (
    <Drawer.Section title="eFight" style={styles.appTitle}>
      <Drawer.Item
        icon="account-arrow-right-outline"
        label={'Logout'}
        active={false}
        onPress={logout}
      />
      <Drawer.Item
        label={'English'}
        active={i18n.language === 'en'}
        onPress={() => {
          i18n.changeLanguage('en');
          AsyncStorage.setItem('defaultLang', 'en');
          props.handleClose();
        }}
      />
      <Drawer.Item
        label={'ગુજરાતી'}
        active={i18n.language === 'gu'}
        onPress={() => {
          i18n.changeLanguage('gu');
          AsyncStorage.setItem('defaultLang', 'gu');
          props.handleClose();
        }}
      />
      <Drawer.Item
        label={'हिन्दी'}
        active={i18n.language === 'hi'}
        onPress={() => {
          i18n.changeLanguage('hi');
          AsyncStorage.setItem('defaultLang', 'hi');
          props.handleClose();
        }}
      />
      <Drawer.Item
        icon="share"
        label={shareThisAppText}
        active={false}
        onPress={shareAppURL}
      />
    </Drawer.Section>
  );
}

const styles = StyleSheet.create({
  drawerStyle: {
    width: Dimensions.get('window').width / 1.5,
  },
  appTitle: {
    marginVertical: 10,
  },
});
