import { useQuery } from "@tanstack/react-query";
import { getUser } from "../apis/AuthAPI";

export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { dataAuth: data, isError, isLoadingAuth: isLoading };
};
