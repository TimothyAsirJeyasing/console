import * as _ from 'lodash';
import i18next from 'i18next';
import {
  AlertAction,
  CustomFeatureFlag,
  ModelDefinition,
  ModelFeatureFlag,
  Plugin,
  RoutePage,
  HorizontalNavTab,
} from '@console/plugin-sdk';
import { referenceForModel } from '@console/internal/module/k8s';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager';
import { NodeModel } from '@console/internal/models';
import { detectOCSAttachedDeviceMode, OCS_ATTACHED_DEVICES_FLAG } from './features';
import * as models from './models';

type ConsumedExtensions =
  | AlertAction
  | CustomFeatureFlag
  | HorizontalNavTab
  | ModelFeatureFlag
  | ModelDefinition
  | RoutePage;

const LSO_FLAG = 'LSO';
export const LSO_DEVICE_DISCOVERY = 'LSO_DEVICE_DISCOVERY';

const plugin: Plugin<ConsumedExtensions> = [
  {
    type: 'ModelDefinition',
    properties: {
      models: _.values(models),
    },
  },
  {
    type: 'FeatureFlag/Model',
    properties: {
      model: models.LocalVolumeModel,
      flag: LSO_FLAG,
    },
  },
  {
    type: 'FeatureFlag/Model',
    properties: {
      model: models.LocalVolumeDiscovery,
      flag: LSO_DEVICE_DISCOVERY,
    },
  },
  {
    type: 'FeatureFlag/Custom',
    properties: {
      detect: detectOCSAttachedDeviceMode,
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: `/k8s/ns/:ns/${ClusterServiceVersionModel.plural}/:appName/${referenceForModel(
        models.LocalVolumeSetModel,
      )}/~new`,
      loader: () =>
        import(
          './components/local-volume-set/create-local-volume-set' /* webpackChunkName: "lso-create-local-volume-set" */
        ).then((m) => m.default),
    },
    flags: {
      required: [LSO_FLAG],
    },
  },
  {
    type: 'HorizontalNavTab',
    properties: {
      model: NodeModel,
      page: {
        href: 'disks',
        name: i18next.t('lso-plugin~Disks'),
      },
      loader: () =>
        import(
          './components/disks-list/disks-list-page' /* webpackChunkName: "lso-disks-list" */
        ).then((m) => m.NodesDisksListPage),
    },
    flags: {
      required: [LSO_DEVICE_DISCOVERY],
      disallowed: [OCS_ATTACHED_DEVICES_FLAG],
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: `/k8s/ns/:ns/${ClusterServiceVersionModel.plural}/:appName/${referenceForModel(
        models.LocalVolumeDiscovery,
      )}/~new`,
      loader: () =>
        import(
          './components/auto-detect-volume/auto-detect-volume' /* webpackChunkName: "lso-auto-detect-volume" */
        ).then((m) => m.default),
    },
    flags: {
      required: [LSO_FLAG],
    },
  },
];

export default plugin;
