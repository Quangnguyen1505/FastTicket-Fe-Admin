import axiosClientFe from "@/helpers/call-fe";

// Fetch all users
export const getUsersProfile = async (user_id: string, accessToken: string) => {
    try {
        console.log("userid and acces", user_id, accessToken);
        
        const response = await axiosClientFe.get(`/api/users/profile`, {
            headers: {
                'x-client-id': user_id,
                'authorization': accessToken
            }
        });
        console.log("response ", response)
        return response;  
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;  
    }
}