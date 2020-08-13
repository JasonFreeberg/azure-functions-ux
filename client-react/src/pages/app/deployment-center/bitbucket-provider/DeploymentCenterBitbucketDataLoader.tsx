import React, { useState, useEffect } from 'react';
import { BitbucketUser } from '../../../../models/bitbucket';
import { useTranslation } from 'react-i18next';
import { DeploymentCenterFieldProps } from '../DeploymentCenter.types';
import { IDropdownOption } from 'office-ui-fabric-react';
import DeploymentCenterBitbucketProvider from './DeploymentCenterBitbucketProvider';

const DeploymentCenterBitbucketDataLoader: React.FC<DeploymentCenterFieldProps> = props => {
  const { t } = useTranslation();
  const { formProps } = props;

  const [bitbucketUser, setBitbucketUser] = useState<BitbucketUser | undefined>(undefined);
  const [bitbucketAccountStatusMessage, setBitbucketAccountStatusMessage] = useState<string | undefined>(
    t('deploymentCenterOAuthFetchingUserInformation')
  );

  const [organizationOptions, setOrganizationOptions] = useState<IDropdownOption[]>([]);
  const [repositoryOptions, setRepositoryOptions] = useState<IDropdownOption[]>([]);
  const [branchOptions, setBranchOptions] = useState<IDropdownOption[]>([]);

  let orgToRepoMapping: { [key: string]: IDropdownOption[] } = {};

  const fetchData = async () => {
    setBitbucketUser(undefined);
    throw Error('Not implemented');
  };

  const fetchRepositoryOptions = async () => {
    orgToRepoMapping = {};
    setBitbucketAccountStatusMessage(undefined);
    setOrganizationOptions([]);
    setRepositoryOptions([]);
    setBranchOptions([]);
    throw Error('Not implemented');
  };

  const fetchRepositoriesInOrganization = (org: string) => {
    setRepositoryOptions(orgToRepoMapping[org]);
    setBranchOptions([]);
    throw Error('Not implemented');
  };

  const fetchBranchOptions = async (org: string, repo: string) => {
    throw Error('Not implemented');
  };

  const authorizeBitbucketAccount = async () => {
    throw Error('Not implemented');
  };

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchRepositoryOptions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitbucketUser]);

  return (
    <DeploymentCenterBitbucketProvider
      formProps={formProps}
      accountUser={bitbucketUser}
      accountStatusMessage={bitbucketAccountStatusMessage}
      authorizeAccount={authorizeBitbucketAccount}
      fetchRepositoriesInOrganization={fetchRepositoriesInOrganization}
      fetchBranchOptions={fetchBranchOptions}
      organizationOptions={organizationOptions}
      repositoryOptions={repositoryOptions}
      branchOptions={branchOptions}
    />
  );
};

export default DeploymentCenterBitbucketDataLoader;