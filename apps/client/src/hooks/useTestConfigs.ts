import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TestConfigService } from '../services/testConfig.service';

export const useTestConfigsByProject = (projectId: string) => {
  return useQuery({
    queryKey: ['testConfigs', 'project', projectId],
    queryFn: () => TestConfigService.getByProject(projectId),
    enabled: !!projectId,
  });
};

export const useTestConfig = (id: string) => {
  return useQuery({
    queryKey: ['testConfig', id],
    queryFn: () => TestConfigService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTestConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TestConfigService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testConfigs', 'project', data.projectId] });
    },
  });
};

export const useUpdateTestConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => TestConfigService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testConfigs', 'project', data.projectId] });
      queryClient.invalidateQueries({ queryKey: ['testConfig', data.id] });
    },
  });
};

export const useDeleteTestConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TestConfigService.delete,
    onSuccess: () => {
      // Hard to know projectId here without returning it, so we invalidate all or handle it in the component
      queryClient.invalidateQueries({ queryKey: ['testConfigs'] });
    },
  });
};
