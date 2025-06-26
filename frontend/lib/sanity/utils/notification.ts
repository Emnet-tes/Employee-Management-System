import { client } from "../client";

export async function getUserNotifications(userId: string) {
  return await client.fetch(
    `*[_type == "notification" && recipient._ref == $userId] | order(timestamp desc)`,
    { userId }
  );
}

export type Notification = {
  _id: string;
  _type: "notification";
  recipient: { _type: "reference"; _ref: string };
  message: string;
  type: "schedule" | "leave_request" | "leave_status";
  read: boolean;
  timestamp: string;
};

export async function createNotification(data: {
  recipientId: string;
  message: string;
  type: "schedule" | "leave_request" | "leave_status";
}): Promise<Notification> {
  return await client.create({
    _type: "notification",
    recipient: {
      _type: "reference",
      _ref: data.recipientId,
    },
    message: data.message,
    type: data.type,
    read: false,
    timestamp: new Date().toISOString(),
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return await client.patch(notificationId).set({ read: true }).commit();
}
