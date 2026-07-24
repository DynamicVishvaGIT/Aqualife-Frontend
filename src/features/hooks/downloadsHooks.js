import { useQuery } from "@tanstack/react-query";
import { getDownloads } from "../downloads/downloads";





// =================================
// Downloads List
// =================================

export const useDownloads = (params = {}) => {

    return useQuery({

        queryKey: [
            "downloads",
            params
        ],


        queryFn: () => getDownloads(params),


        staleTime: 1000 * 60 * 30, // 30 minutes


    });

};