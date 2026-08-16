import { authClient } from '@/lib/auth-client'


const getUserData = async () => {
    const {data, error} = await authClient.useSession();
    return {data, error};
}

export { getUserData }