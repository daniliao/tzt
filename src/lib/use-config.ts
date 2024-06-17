import { ConfigDTO } from '@/data/models';
import { useEffect, useState } from 'react';

const useConfig = (): { configs: ConfigDTO[], getByKey: (arg0:string) => any } => {
    const [configs, setConfigs] = useState<ConfigDTO[]>([]);

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const response = await fetch('/***REMOVED***/config');
                const data = await response.json();
                setConfigs(data);
            } catch (error) {
                console.error('Error fetching configs:', error);
            }
        };

        fetchConfigs();
    }, []);

    return { configs, getByKey: (***REMOVED***: string) => configs.find((config) => config.***REMOVED*** === ***REMOVED***) }
};

export default useConfig;