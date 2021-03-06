import { Field, FormikProps } from 'formik';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RadioButton from '../../../../components/form-controls/RadioButton';
import { AppSettingsFormValues } from '../AppSettings.types';
import { settingsWrapper } from '../AppSettingsForm';
import { PermissionsContext, WebAppStacksContext } from '../Contexts';
import SiteHelper from '../../../../utils/SiteHelper';
import { Links } from '../../../../utils/FwLinks';

const DebuggingLinux: React.FC<FormikProps<AppSettingsFormValues>> = props => {
  const { t } = useTranslation();
  const { app_write, editable, saving } = useContext(PermissionsContext);
  const disableAllControls = !app_write || !editable || saving;
  const webAppStacks = useContext(WebAppStacksContext);
  const [enabledStack, setEnabledStack] = useState(false);
  const [flexStamp, setFlexStamp] = useState(false);

  const remoteDebuggingEnabledStacks = useMemo(() => {
    return webAppStacks
      .flatMap(value => {
        return value.majorVersions.flatMap(majorVersion => {
          return majorVersion.minorVersions.flatMap(minorVersion => ({
            runtimeVersion: minorVersion.stackSettings.linuxRuntimeSettings
              ? minorVersion.stackSettings.linuxRuntimeSettings.runtimeVersion
              : '',
            isRemoteDebuggingEnabled: minorVersion.stackSettings.linuxRuntimeSettings
              ? minorVersion.stackSettings.linuxRuntimeSettings.remoteDebuggingSupported
              : false,
          }));
        });
      })
      .filter(x => x.isRemoteDebuggingEnabled)
      .map(x => x.runtimeVersion && x.runtimeVersion.toLowerCase());
  }, [webAppStacks]);

  const getInfoBubbleText = (): string => {
    if (!enabledStack) {
      return t('remoteDebuggingNotAvailableForRuntimeStack');
    }
    return flexStamp ? t('remoteDebuggingNotAvailableOnFlexStamp') : '';
  };

  useEffect(() => {
    const currentLinuxFxVersion = props.values.config.properties.linuxFxVersion;
    const enabled =
      !!currentLinuxFxVersion &&
      (remoteDebuggingEnabledStacks.includes(currentLinuxFxVersion) || currentLinuxFxVersion.toLowerCase().startsWith('python'));
    setEnabledStack(enabled);
    if (!enabled) {
      props.setFieldValue('config.properties.remoteDebuggingEnabled', false);
    }
    setFlexStamp(SiteHelper.isFlexStamp(props.values.site));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.values.config.properties.linuxFxVersion,
    remoteDebuggingEnabledStacks,
    props.values.site.properties.possibleInboundIpAddresses,
  ]);
  return (
    <div id="app-settings-remote-debugging-section">
      <h3>{t('debugging')}</h3>
      <div className={settingsWrapper}>
        <Field
          name="config.properties.remoteDebuggingEnabled"
          dirty={props.values.config.properties.remoteDebuggingEnabled !== props.initialValues.config.properties.remoteDebuggingEnabled}
          component={RadioButton}
          fullpage
          label={t('remoteDebuggingEnabledLabel')}
          disabled={disableAllControls || !enabledStack || flexStamp}
          id="remote-debugging-switch"
          infoBubbleMessage={getInfoBubbleText()}
          learnMoreLink={flexStamp && Links.remoteDebuggingLearnMore}
          options={[
            {
              key: true,
              text: t('on'),
            },
            {
              key: false,
              text: t('off'),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default DebuggingLinux;
