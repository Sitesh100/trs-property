import { realStateAPI } from "@/redux/createAPI";

const notificationApi = realStateAPI.injectEndpoints({
    endpoints: (build) => ({
        sendNotification: build.mutation({
            query: ({ property_id, property_name }) => {
                const formData = new FormData();
                formData.append("property_id", property_id);
                formData.append("property_name", property_name);

                return {
                    url: `property/send_notification/`,
                    method: "POST",
                    body: formData,
                }
            },
        }),
    }),
});

export const {
    useSendNotificationMutation
} = notificationApi;

