import { RestResource } from '@axonivy/inscription-protocol';
import { useEditorContext, useMeta } from '../../../context';
import { useRestRequestData } from './useRestRequestData';

export const useRestResourceMeta = (): Partial<RestResource> => {
  const { config } = useRestRequestData();
  const { context } = useEditorContext();
  const resource = useMeta(
    'meta/rest/resource',
    { context, clientId: config.target.clientId, method: config.method, path: config.target.path },
    {} as RestResource
  ).data;
  if (resource === null) {
    return {};
  }
  return resource;
};