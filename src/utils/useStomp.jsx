import { useStompContext } from '../stomp/StompProvider';

export const useStomp = () => {
  const context = useStompContext();
  if (!context) throw new Error('useStomp must be used within a StompProvider');
  return context;
};
