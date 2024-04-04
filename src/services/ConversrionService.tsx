import { format } from 'date-fns';

export const formatDate = (isoDateString: string): string => {
    return format(new Date(isoDateString), 'dd/MM/yyyy HH:mm:ss');
  };

